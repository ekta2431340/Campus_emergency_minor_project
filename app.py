import os
import re
import secrets
import sqlite3
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterator

from flask import Flask, jsonify, request, session
from dotenv import load_dotenv
from werkzeug.security import check_password_hash, generate_password_hash


ROOT = Path(__file__).resolve().parent
load_dotenv(ROOT / ".env.local")
DEFAULT_DATABASE = ROOT / "campus_emergency.db"
USERNAME_PATTERN = re.compile(r"^[a-z0-9_.-]{3,32}$")
PHONE_PATTERN = re.compile(r"^\+[1-9][0-9]{7,14}$")
PASSWORD_HASH_PREFIXES = ("pbkdf2:", "scrypt:")


def connect_database(database_path: Path) -> sqlite3.Connection:
    if not database_path.is_file():
        raise FileNotFoundError(
            f"Database file not found: {database_path}. "
            "The application will not create a replacement database."
        )

    connection = sqlite3.connect(str(database_path))
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


@contextmanager
def database_connection(database_path: Path) -> Iterator[sqlite3.Connection]:
    connection = connect_database(database_path)
    try:
        with connection:
            yield connection
    finally:
        connection.close()


def prepare_database(database_path: Path) -> None:
    with database_connection(database_path) as connection:
        tables = {
            row["name"]
            for row in connection.execute(
                "SELECT name FROM sqlite_master WHERE type = 'table'"
            )
        }
        if not {"users", "emergency_reports"}.issubset(tables):
            raise RuntimeError(
                f"The existing database {database_path} must contain "
                "'users' and 'emergency_reports' tables."
            )

        user_columns = {
            row["name"] for row in connection.execute("PRAGMA table_info(users)")
        }
        report_columns = {
            row["name"]
            for row in connection.execute("PRAGMA table_info(emergency_reports)")
        }
        required_user_columns = {
            "id", "username", "password", "full_name", "role", "roll_no",
            "department", "phone", "email",
        }
        required_report_columns = {
            "id", "student_username", "student_name", "roll_no", "category",
            "location", "description", "priority", "status",
            "classification_reason", "admin_notes", "created_at",
        }
        if not required_user_columns.issubset(user_columns):
            raise RuntimeError("The existing users table does not match the expected schema.")
        if not required_report_columns.issubset(report_columns):
            raise RuntimeError(
                "The existing emergency_reports table does not match the expected schema."
            )

        if "updated_at" not in report_columns:
            connection.execute(
                "ALTER TABLE emergency_reports ADD COLUMN updated_at TIMESTAMP"
            )
            connection.execute(
                "UPDATE emergency_reports SET updated_at = created_at "
                "WHERE updated_at IS NULL"
            )


def user_json(row: sqlite3.Row) -> dict:
    return {
        "id": str(row["id"]),
        "username": row["username"],
        "role": row["role"],
        "fullName": row["full_name"],
        "rollNo": row["roll_no"],
        "department": row["department"],
        "phone": row["phone"],
        "email": row["email"],
    }


def report_json(row: sqlite3.Row) -> dict:
    return {
        "id": row["id"],
        "studentUsername": row["student_username"],
        "studentName": row["student_name"],
        "rollNo": row["roll_no"],
        "category": row["category"],
        "location": row["location"],
        "description": row["description"],
        "priority": row["priority"],
        "status": row["status"],
        "matchedKeywords": [],
        "classificationReason": row["classification_reason"] or "",
        "adminNotes": row["admin_notes"],
        "submittedAt": row["created_at"],
        "updatedAt": row["updated_at"],
    }


def create_app(database_path: Path | None = None) -> Flask:
    app = Flask(__name__)
    app.config.update(
        SECRET_KEY=os.environ.get("FLASK_SECRET_KEY") or secrets.token_hex(32),
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_SAMESITE="Lax",
        SESSION_COOKIE_SECURE=False,
        PERMANENT_SESSION_LIFETIME=60 * 60 * 12,
    )
    db_path = Path(database_path or os.environ.get("CAMPUS_DB_PATH", DEFAULT_DATABASE))
    prepare_database(db_path)

    def get_user() -> sqlite3.Row | None:
        user_id = session.get("user_id")
        if user_id is None:
            return None
        with database_connection(db_path) as connection:
            return connection.execute(
                "SELECT * FROM users WHERE id = ?", (user_id,)
            ).fetchone()

    def error(message: str, status: int):
        return jsonify({"error": message}), status

    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok", "database": db_path.name})

    @app.get("/api/db-summary")
    def database_summary():
        if request.remote_addr not in {"127.0.0.1", "::1"}:
            return error("The local database viewer is only available on this computer.", 403)

        with database_connection(db_path) as connection:
            users = connection.execute(
                """
                SELECT id, username, full_name, email, role
                FROM users
                ORDER BY id DESC
                LIMIT 100
                """
            ).fetchall()
            user_count = connection.execute(
                "SELECT COUNT(*) FROM users"
            ).fetchone()[0]
            report_count = connection.execute(
                "SELECT COUNT(*) FROM emergency_reports"
            ).fetchone()[0]
        return jsonify({
            "database": db_path.name,
            "userCount": user_count,
            "reportCount": report_count,
            "users": [
                {
                    "id": row["id"],
                    "username": row["username"],
                    "fullName": row["full_name"],
                    "email": row["email"],
                    "role": row["role"],
                }
                for row in users
            ],
        })

    @app.get("/api/session")
    def current_session():
        row = get_user()
        if row is None:
            session.clear()
            return jsonify({"user": None})
        return jsonify({"user": user_json(row)})

    @app.post("/api/register")
    def register():
        payload = request.get_json(silent=True)
        if not isinstance(payload, dict):
            return error("A JSON request body is required.", 400)

        email = str(payload.get("email", "")).strip().lower()
        password = payload.get("password", "")
        username = str(payload.get("username", "")).strip().lower()
        full_name = str(payload.get("fullName", "")).strip()
        roll_no = str(payload.get("rollNo", "")).strip()
        department = str(payload.get("department", "")).strip()
        phone = str(payload.get("phone", "")).strip()
        if not email or "@" not in email or len(email) > 254:
            return error("Enter a valid email address.", 400)
        if not isinstance(password, str) or len(password) < 8:
            return error("Password must contain at least 8 characters.", 400)
        if not PHONE_PATTERN.fullmatch(phone):
            return error("Enter a phone number in international format, such as +14155552671.", 400)
        if not USERNAME_PATTERN.fullmatch(username):
            return error(
                "Username must be 3–32 characters using lowercase letters, numbers, '.', '_' or '-'.",
                400,
            )
        if not full_name or not roll_no or not department:
            return error("Full name, roll number, and department are required.", 400)

        with database_connection(db_path) as connection:
            existing = connection.execute(
                """
                SELECT
                    lower(username) = ? AS username_exists,
                    lower(email) = ? AS email_exists
                FROM users
                WHERE lower(username) = ? OR lower(email) = ?
                LIMIT 1
                """,
                (username, email, username, email),
            ).fetchone()
            if existing:
                conflicts = [
                    field
                    for field, column in (
                        ("username", "username_exists"),
                        ("email", "email_exists"),
                    )
                    if existing[column]
                ]
                conflict_list = ", ".join(conflicts)
                return error(
                    f"Already registered: {conflict_list}. Use different details or sign in.",
                    409,
                )
            try:
                cursor = connection.execute(
                    """
                    INSERT INTO users
                        (username, password, full_name, role, roll_no,
                         department, phone, email)
                    VALUES (?, ?, ?, 'student', ?, ?, ?, ?)
                    """,
                    (
                        username,
                        generate_password_hash(password),
                        full_name,
                        roll_no,
                        department,
                        phone,
                        email,
                    ),
                )
            except sqlite3.IntegrityError:
                return error(
                    "This username is already registered. Choose a different username or sign in.",
                    409,
                )
            user_id = cursor.lastrowid
            row = connection.execute(
                "SELECT * FROM users WHERE id = ?", (user_id,)
            ).fetchone()

        session.clear()
        session["user_id"] = user_id
        session.permanent = True
        return jsonify({"user": user_json(row)}), 201

    @app.post("/api/admins")
    def register_admin():
        current_user = get_user()
        if current_user is None:
            return error("Sign in to register an administrator.", 401)
        if current_user["role"] != "admin":
            return error("Only administrators can register another administrator.", 403)

        payload = request.get_json(silent=True)
        if not isinstance(payload, dict):
            return error("A JSON request body is required.", 400)

        email = str(payload.get("email", "")).strip().lower()
        password = payload.get("password", "")
        username = str(payload.get("username", "")).strip().lower()
        full_name = str(payload.get("fullName", "")).strip()
        department = str(payload.get("department", "")).strip()
        phone = str(payload.get("phone", "")).strip()
        if not email or "@" not in email or len(email) > 254:
            return error("Enter a valid email address.", 400)
        if not isinstance(password, str) or len(password) < 8:
            return error("Password must contain at least 8 characters.", 400)
        if not PHONE_PATTERN.fullmatch(phone):
            return error(
                "Enter a phone number in international format, such as +14155552671.",
                400,
            )
        if not USERNAME_PATTERN.fullmatch(username):
            return error(
                "Username must be 3–32 characters using lowercase letters, numbers, '.', '_' or '-'.",
                400,
            )
        if not full_name or not department:
            return error("Full name and department are required.", 400)

        with database_connection(db_path) as connection:
            existing = connection.execute(
                """
                SELECT
                    lower(username) = ? AS username_exists,
                    lower(email) = ? AS email_exists
                FROM users
                WHERE lower(username) = ? OR lower(email) = ?
                LIMIT 1
                """,
                (username, email, username, email),
            ).fetchone()
            if existing:
                conflicts = [
                    field
                    for field, column in (
                        ("username", "username_exists"),
                        ("email", "email_exists"),
                    )
                    if existing[column]
                ]
                return error(
                    f"Already registered: {', '.join(conflicts)}. "
                    "Use different details or sign in.",
                    409,
                )
            try:
                cursor = connection.execute(
                    """
                    INSERT INTO users
                        (username, password, full_name, role, department, phone, email)
                    VALUES (?, ?, ?, 'admin', ?, ?, ?)
                    """,
                    (
                        username,
                        generate_password_hash(password),
                        full_name,
                        department,
                        phone,
                        email,
                    ),
                )
            except sqlite3.IntegrityError:
                return error(
                    "This username or email is already registered. "
                    "Choose different details.",
                    409,
                )
            row = connection.execute(
                "SELECT * FROM users WHERE id = ?", (cursor.lastrowid,)
            ).fetchone()

        return jsonify({"user": user_json(row)}), 201

    @app.post("/api/admin-registration")
    def public_admin_registration():
        configured_code = os.environ.get("FLASK_ADMIN_REGISTRATION_CODE", "")
        if not configured_code:
            return error("Admin registration is not configured on this server.", 503)

        payload = request.get_json(silent=True)
        if not isinstance(payload, dict):
            return error("A JSON request body is required.", 400)
        supplied_code = payload.get("inviteCode", "")
        if not isinstance(supplied_code, str) or not secrets.compare_digest(
            supplied_code, configured_code
        ):
            return error("Invalid admin invite code.", 403)

        email = str(payload.get("email", "")).strip().lower()
        password = payload.get("password", "")
        username = str(payload.get("username", "")).strip().lower()
        full_name = str(payload.get("fullName", "")).strip()
        department = str(payload.get("department", "")).strip()
        phone = str(payload.get("phone", "")).strip()
        if not email or "@" not in email or len(email) > 254:
            return error("Enter a valid email address.", 400)
        if not isinstance(password, str) or len(password) < 8:
            return error("Password must contain at least 8 characters.", 400)
        if not PHONE_PATTERN.fullmatch(phone):
            return error(
                "Enter a phone number in international format, such as +14155552671.",
                400,
            )
        if not USERNAME_PATTERN.fullmatch(username):
            return error(
                "Username must be 3–32 characters using lowercase letters, numbers, '.', '_' or '-'.",
                400,
            )
        if not full_name or not department:
            return error("Full name and department are required.", 400)

        with database_connection(db_path) as connection:
            existing = connection.execute(
                """
                SELECT
                    lower(username) = ? AS username_exists,
                    lower(email) = ? AS email_exists
                FROM users
                WHERE lower(username) = ? OR lower(email) = ?
                LIMIT 1
                """,
                (username, email, username, email),
            ).fetchone()
            if existing:
                conflicts = [
                    field
                    for field, column in (
                        ("username", "username_exists"),
                        ("email", "email_exists"),
                    )
                    if existing[column]
                ]
                return error(
                    f"Already registered: {', '.join(conflicts)}. "
                    "Use different details or sign in.",
                    409,
                )
            try:
                cursor = connection.execute(
                    """
                    INSERT INTO users
                        (username, password, full_name, role, department, phone, email)
                    VALUES (?, ?, ?, 'admin', ?, ?, ?)
                    """,
                    (
                        username,
                        generate_password_hash(password),
                        full_name,
                        department,
                        phone,
                        email,
                    ),
                )
            except sqlite3.IntegrityError:
                return error(
                    "This username or email is already registered. "
                    "Choose different details.",
                    409,
                )
            row = connection.execute(
                "SELECT * FROM users WHERE id = ?", (cursor.lastrowid,)
            ).fetchone()

        return jsonify({"user": user_json(row)}), 201

    @app.post("/api/login")
    def login():
        payload = request.get_json(silent=True)
        if not isinstance(payload, dict):
            return error("A JSON request body is required.", 400)
        email = str(payload.get("email", "")).strip().lower()
        password = payload.get("password", "")
        requested_role = payload.get("role")
        if not isinstance(password, str) or not email:
            return error("Enter your email and password.", 400)

        with database_connection(db_path) as connection:
            row = connection.execute(
                "SELECT * FROM users WHERE lower(email) = ?", (email,)
            ).fetchone()
            if row is None:
                return error(
                    "No account is registered with this email. Please create an account first.",
                    401,
                )

            stored_password = row["password"]
            if stored_password.startswith(PASSWORD_HASH_PREFIXES):
                valid_password = check_password_hash(stored_password, password)
            else:
                valid_password = secrets.compare_digest(stored_password, password)

            if not valid_password:
                return error("Invalid email or password.", 401)
            if not stored_password.startswith(PASSWORD_HASH_PREFIXES):
                connection.execute(
                    "UPDATE users SET password = ? WHERE id = ?",
                    (generate_password_hash(password), row["id"]),
                )
            if requested_role not in ("student", "admin") or row["role"] != requested_role:
                return error(f"This account does not have the {requested_role} role.", 403)
            user_id = row["id"]

        session.clear()
        session["user_id"] = user_id
        session.permanent = True
        return jsonify({"user": user_json(row)})

    @app.post("/api/logout")
    def logout():
        session.clear()
        return jsonify({"ok": True})

    @app.get("/api/reports")
    def list_reports():
        user = get_user()
        if user is None:
            return error("Sign in to view reports.", 401)
        with database_connection(db_path) as connection:
            if user["role"] == "admin":
                rows = connection.execute(
                    "SELECT * FROM emergency_reports ORDER BY created_at DESC"
                ).fetchall()
            else:
                rows = connection.execute(
                    """
                    SELECT * FROM emergency_reports
                    WHERE student_username = ?
                    ORDER BY created_at DESC
                    """,
                    (user["username"],),
                ).fetchall()
        return jsonify({"reports": [report_json(row) for row in rows]})

    @app.post("/api/reports")
    def add_report():
        user = get_user()
        if user is None:
            return error("Sign in to submit a report.", 401)
        if user["role"] != "student":
            return error("Only student accounts can submit reports.", 403)
        payload = request.get_json(silent=True)
        if not isinstance(payload, dict):
            return error("A JSON request body is required.", 400)

        required_values = {
            "id": payload.get("id"),
            "category": payload.get("category"),
            "location": payload.get("location"),
            "description": payload.get("description"),
            "priority": payload.get("priority"),
        }
        if any(not isinstance(value, str) or not value.strip() for value in required_values.values()):
            return error("Report details are incomplete.", 400)
        allowed_categories = {
            "Medical Emergency", "Fire", "Security Issue", "Accident", "Other",
        }
        if required_values["category"] not in allowed_categories:
            return error("Invalid emergency category.", 400)
        if required_values["priority"] not in {"High", "Medium", "Low"}:
            return error("Invalid report priority.", 400)

        now = datetime.now(timezone.utc).isoformat(timespec="seconds")
        try:
            with database_connection(db_path) as connection:
                connection.execute(
                    """
                    INSERT INTO emergency_reports
                        (id, student_username, student_name, roll_no, category,
                         location, description, priority, status,
                         classification_reason, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Submitted', ?, ?, ?)
                    """,
                    (
                        required_values["id"],
                        user["username"],
                        user["full_name"],
                        user["roll_no"],
                        required_values["category"],
                        required_values["location"].strip(),
                        required_values["description"].strip(),
                        required_values["priority"],
                        str(payload.get("classificationReason", "")),
                        now,
                        now,
                    ),
                )
                row = connection.execute(
                    "SELECT * FROM emergency_reports WHERE id = ?",
                    (required_values["id"],),
                ).fetchone()
        except sqlite3.IntegrityError:
            return error("This report could not be saved; its ID may already exist.", 409)
        return jsonify({"report": report_json(row)}), 201

    @app.patch("/api/reports/<report_id>")
    def update_report(report_id: str):
        user = get_user()
        if user is None:
            return error("Sign in to update reports.", 401)
        if user["role"] != "admin":
            return error("Only administrators can update report status.", 403)
        payload = request.get_json(silent=True)
        if not isinstance(payload, dict):
            return error("A JSON request body is required.", 400)
        status = payload.get("status")
        if status not in {"Submitted", "In Progress", "Resolved"}:
            return error("Invalid report status.", 400)

        with database_connection(db_path) as connection:
            cursor = connection.execute(
                """
                UPDATE emergency_reports
                SET status = ?, admin_notes = ?, updated_at = ?
                WHERE id = ?
                """,
                (
                    status,
                    str(payload.get("adminNotes", "")),
                    datetime.now(timezone.utc).isoformat(timespec="seconds"),
                    report_id,
                ),
            )
            if cursor.rowcount == 0:
                return error("Report not found.", 404)
            row = connection.execute(
                "SELECT * FROM emergency_reports WHERE id = ?", (report_id,)
            ).fetchone()
        return jsonify({"report": report_json(row)})

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)
