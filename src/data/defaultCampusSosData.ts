import { ProjectData } from '../types/project';

export const defaultCampusSosData: ProjectData = {
  projectTitle: "Campus SOS AI",
  projectSubtitle: "Intelligent Multi-Modal Emergency Distress & Rapid Security Incident Response System",
  subjectCode: "BCA 5005",
  session: "2026–2027 (Odd Semester)",
  groupId: "GRP-BCA-2026-09",
  projectId: "PSIT-BCA-2026-SOS-09",
  course: "BCA",
  collegeName: "PSIT-College of Higher Education",
  collegeAddress: "Kanpur-Delhi National Highway (NH-19), Bhauti, Kanpur-209305 (U.P.), India",
  universityName: "C.S.J.M. University, Kanpur",
  departmentName: "DEPARTMENT OF COMPUTER APPLICATIONS",
  supervisorName: "Dr. Rajesh Kumar Sharma",
  supervisorDesignation: "Associate Professor, Dept. of Computer Applications",
  hodName: "Prof. (Dr.) A. K. Awasthi",
  projectType: "Software (AI & Mobile-Cloud Emergency Response System)",
  supervisorOverallRemark: "Exceptional and socially impactful initiative directly addressing student security. The integration of high-accuracy indoor/outdoor geofencing, multi-modal distress triggers, and sub-second security dashboard routing exhibits deep technical execution. The team displayed consistent progress, thorough documentation, and rigorous testing across all ten project milestones.",
  
  students: [
    {
      id: "std-1",
      name: "Musskan Verma",
      rollNo: "22005011001",
      status: "Present",
      signature: "Musskan Verma",
      grade: "A+"
    },
    {
      id: "std-2",
      name: "Aman Gupta",
      rollNo: "22005011002",
      status: "Present",
      signature: "Aman Gupta",
      grade: "A+"
    },
    {
      id: "std-3",
      name: "Ananya Dixit",
      rollNo: "22005011003",
      status: "Present",
      signature: "Ananya Dixit",
      grade: "A"
    },
    {
      id: "std-4",
      name: "Ayush Srivastava",
      rollNo: "22005011004",
      status: "Present",
      signature: "Ayush Srivastava",
      grade: "A"
    },
    {
      id: "std-5",
      name: "Divyansh Patel",
      rollNo: "22005011005",
      status: "Present",
      signature: "Divyansh Patel",
      grade: "A"
    }
  ],

  abstract: `Ensuring personal safety within sprawling higher education institutions poses significant logistical and technological challenges. Traditional emergency mechanisms—such as physical landline intercoms, manual emergency calling, and static campus security desks—suffer from prohibitive response latencies, lack of automated location telemetry, and high friction in high-stress duress scenarios. To overcome these critical shortcomings, this project introduces "Campus SOS AI", an advanced, intelligent multi-modal emergency distress and rapid incident response system designed specifically for collegiate environments.

The proposed system synergizes client-side sensory telemetry with edge AI classification to deliver sub-two-second emergency alerts. Campus SOS AI features a multi-tiered distress actuation pipeline: a single-tap haptic panic trigger, an encrypted background acoustic monitor capable of identifying verbal distress cues (e.g., screams, calls for assistance in English and Hindi such as "Help" and "Bachao"), and a continuous motion anomaly detector for falls or sudden physical struggles. Upon trigger confirmation, the application instantly dispatches an end-to-end encrypted distress beacon encapsulating high-precision GPS coordinates, campus zone geofence identifiers (e.g., Academic Block B, Girls Hostel perimeter, Central Sports Complex), and critical medical metadata directly to the Campus Security Command Center dashboard and designated emergency guardians.

The backend infrastructure utilizes real-time bidirectional WebSocket channels paired with an intelligent triage engine. Incoming distress packets are evaluated and classified by severity, routing dynamic visual alerts and audio sirens to nearest on-duty security patrols, warden desks, and campus medical officers with turn-by-turn route estimation. Additionally, an automated SMS/WhatsApp fallback gateway ensures guaranteed alert transmission during intermittent cellular data drops. Built with a responsive React/TypeScript progressive web client, Express microservices, and integrated Gemini AI incident classification, Campus SOS AI establishes a dependable, ethical, and scalable safety safety net that empowers students while drastically shrinking campus emergency response windows.`,

  synopsis: {
    title: "Campus SOS AI: Smart Emergency Distress & Incident Response System",
    introduction: "In modern educational institutions covering extensive geographical acreage, immediate access to emergency response is critical for student well-being. Campus SOS AI is engineered to bridge the critical gap between distress occurrence and emergency response through automated telemetry, real-time geofencing, and AI-assisted triage.",
    problemStatement: "Physical campus security typically relies on fixed-point security booths and manual phone calls to emergency numbers. In volatile incidents—such as medical collapses, nighttime harassment, bullying, or laboratory hazards—victims frequently lack the capability or time to place a conventional phone call, explain their exact physical location, or communicate medical urgency.",
    objectives: [
      "Develop a zero-friction, one-touch emergency panic trigger accessible via mobile web and progressive web apps (PWA).",
      "Implement client-side AI acoustic and gesture distress detection for hands-free actuation in high-coercion scenarios.",
      "Integrate precision GPS telemetry and campus-specific geofencing to pinpoint victims within buildings and outdoor zones.",
      "Construct a live Security Command Center dashboard with sub-second incident alerts, audio sirens, and patrol dispatch tracking.",
      "Provide an automated multi-channel alert dispatcher (WebSocket, SMS fallback, push notifications) to guardians and authorities.",
      "Ensure strict user privacy, end-to-end data encryption, and false-positive verification protocols."
    ],
    systemArchitecture: [
      "Client Tier: Responsive Progressive Web App (React 19, TypeScript, Tailwind CSS) with offline caching and background service worker.",
      "Distress Processing Layer: Gemini AI / Web Audio API acoustic classifier, Shake & Fall sensor heuristic engine.",
      "Communication Broker: Bidirectional WebSocket server (Node.js/Express) with automatic reconnect and event deduplication.",
      "Geofence & Mapping Service: Real-time coordinate mapper with PSIT campus polygonal geofences and nearest-guard routing.",
      "Command Center Tier: Live dispatcher console with visual telemetry, interactive heatmaps, patrol status, and audit logging."
    ],
    techStack: {
      frontend: "React 19, TypeScript, Tailwind CSS v4, Lucide Icons, HTML5 Geolocation & Audio API",
      backend: "Node.js, Express REST API & WebSocket Real-time Event Server",
      aiMl: "Gemini AI for incident severity classification & Web Audio keyword recognition",
      database: "IndexedDB (Offline Client Storage) & Cloud SQL / Structured Event Store",
      apis: "Campus Geofence Polygon Engine, SMS Dispatch Gateway, WebRTC Media Beacon"
    },
    keyModules: [
      { name: "Instant SOS Panic Module", desc: "One-touch button with 3-second haptic countdown cancellation to prevent accidental triggers." },
      { name: "AI Acoustic Distress Engine", desc: "Background audio analysis tuned to detect urgent distress keywords and anomalous scream acoustics." },
      { name: "Real-time Geofence Tracker", desc: "Pinpoints exact building, floor zone, and GPS coordinates within the PSIT campus boundary." },
      { name: "Security Guard Command Console", desc: "Live dispatcher dashboard featuring siren alerts, victim medical card, and assigned patrol tracking." },
      { name: "SafeWalk & Guardian Beacon", desc: "Allows students traveling late across campus to share dynamic live breadcrumbs with trusted friends." }
    ],
    expectedOutcomes: [
      "Reduction of campus emergency notification latency from 5+ minutes to under 2 seconds.",
      "Accurate real-time localization of incidents across 80+ acres of campus infrastructure.",
      "Comprehensive digital audit trail of security response times, dispatch history, and incident resolutions."
    ],
    hardwareRequirements: [
      "Student / User Device: Smartphone or laptop with GPS, microphone, and internet connectivity.",
      "Security Terminal: Desktop workstation or tablet with modern browser support.",
      "Server Hardware: Minimum 2 vCPU, 4GB RAM cloud instance with 99.9% uptime SLA."
    ],
    softwareRequirements: [
      "Operating System: Cross-platform (Android, iOS, Windows, macOS, Linux).",
      "Development Runtime: Node.js v20+, Vite Build Tool.",
      "Browser: Chrome 90+, Safari 15+, Firefox 90+, Edge."
    ]
  },

  schedule: [
    {
      activity: "Title/Group Formation/Supervisor Allocation",
      deadline: "Till 24th July-2026",
      incharge: "Supervisor/Group leader",
      document: "Project Proposal"
    },
    {
      activity: "Proposal Submission",
      deadline: "Till 14th Aug-2026",
      incharge: "Supervisor/DPC",
      document: "Project Proposal"
    },
    {
      activity: "Progress Evaluation 1",
      deadline: "During CT-I",
      incharge: "DPC/ Evaluators",
      document: "Power Point Presentation/Synopsis"
    },
    {
      activity: "Weekly performance Monitoring",
      deadline: "Throughout the semester",
      incharge: "Supervisor",
      document: "Project Diary"
    },
    {
      activity: "Progress Evaluation 2",
      deadline: "During CT-II",
      incharge: "DPC/ Evaluators",
      document: "Power Point Presentation"
    },
    {
      activity: "End Semester Report (Project work Submission)/ Final Evaluation",
      deadline: "During PU",
      incharge: "Supervisor",
      document: "Project Diary/ Power Point Presentation"
    }
  ],

  weeklyLogs: [
    {
      weekNo: 1,
      meetingDate: "28/07/2026",
      workDoneCurrent: "Conducted an extensive literature review on campus emergency response systems and vulnerability vectors. Surveyed student safety concerns across PSIT campus. Finalized the project title 'Campus SOS AI' and divided core team roles across frontend, backend, geofencing, and AI distress detection.",
      workDoneNext: "Formulate the Software Requirements Specification (SRS), identify primary stakeholder personas (students, guards, wardens, medical officers), and draft system use-case diagrams.",
      supervisorComments: "Problem statement is well chosen and holds high practical relevance. Ensure team role clarity and proceed with comprehensive requirement analysis.",
      supervisorSignatureDate: "28/07/2026"
    },
    {
      weekNo: 2,
      meetingDate: "04/08/2026",
      workDoneCurrent: "Drafted the comprehensive SRS document detailing functional and non-functional requirements. Interviewed campus security personnel and hostel wardens regarding average response times. Prepared preliminary Data Flow Diagrams (DFD Level 0 & Level 1) and UML sequence diagrams.",
      workDoneNext: "Design the high-level system architecture, entity-relationship (ER) schemas for incident logs, and map out the multi-modal trigger pipeline.",
      supervisorComments: "SRS is detailed and well structured. Pay specific attention to false-trigger mitigation and battery consumption on mobile devices.",
      supervisorSignatureDate: "04/08/2026"
    },
    {
      weekNo: 3,
      meetingDate: "11/08/2026",
      workDoneCurrent: "Formulated the High-Level Design (HLD) and Low-Level Design (LLD). Defined data payloads for the emergency distress beacon, including GPS coordinates, timestamp, user health profile, and zone polygon identifier. Designed the UI wireframes in Figma.",
      workDoneNext: "Initialize project repositories, configure the development environment (React 19, TypeScript, Tailwind CSS, Node.js), and create initial UI component scaffolding.",
      supervisorComments: "Architectural blueprint approved. Ensure that the database schema supports historical telemetry archiving for post-incident audits.",
      supervisorSignatureDate: "11/08/2026"
    },
    {
      weekNo: 4,
      meetingDate: "18/08/2026",
      workDoneCurrent: "Initialized the frontend repository using Vite and TypeScript. Built responsive UI layouts for the Student Emergency Screen with high-contrast tactile elements. Configured Express server endpoints for authentication, incident reporting, and test geolocation polling.",
      workDoneNext: "Implement the One-Touch SOS Panic Button with haptic vibration feedback, 3-second safety abort timer, and GPS coordinate capture.",
      supervisorComments: "Clean code structure. Verify that HTML5 Geolocation API fallback handles degraded indoor satellite signals gracefully.",
      supervisorSignatureDate: "18/08/2026"
    },
    {
      weekNo: 5,
      meetingDate: "25/08/2026",
      workDoneCurrent: "Implemented the core SOS panic trigger mechanism with a smooth countdown abort timer to eliminate accidental clicks. Integrated the Geolocation API to fetch live latitude, longitude, accuracy radius, and resolved campus zone tags (e.g., Academic Block A, Bhauti Campus).",
      workDoneNext: "Integrate Gemini AI and the Web Audio API for distress acoustic recognition and automated emergency severity triage.",
      supervisorComments: "Trigger latency is impressive (<200ms). Focus on optimizing accuracy of geofence mapping within multi-story academic buildings.",
      supervisorSignatureDate: "25/08/2026"
    },
    {
      weekNo: 6,
      meetingDate: "01/09/2026",
      workDoneCurrent: "Developed the AI distress recognition module using Gemini API for incident intent classification. Built client-side speech-to-text emergency transcript analyzer recognizing critical vocal signals ('Help', 'Bachao', medical panic phrases) during triggered audio recording.",
      workDoneNext: "Build the real-time Campus Security Command Center dashboard with live incident queue, audio siren dispatch, and responder assignments.",
      supervisorComments: "Novel AI integration for acoustic distress. Ensure user consent and strict privacy guidelines are documented for audio buffering.",
      supervisorSignatureDate: "01/09/2026"
    },
    {
      weekNo: 7,
      meetingDate: "08/09/2026",
      workDoneCurrent: "Constructed the Security Guard Command Center dashboard featuring interactive campus map markers, audible siren alerts, victim detail cards, and one-click patrol dispatching. Implemented bidirectional WebSocket channels for instantaneous status updates.",
      workDoneNext: "Implement the 'SafeWalk' virtual companion feature and offline SMS gateway fallback for zero-connectivity situations.",
      supervisorComments: "Command dashboard presents high operational clarity. Recommended adding color-coded severity badges (Critical, High, Medium).",
      supervisorSignatureDate: "08/09/2026"
    },
    {
      weekNo: 8,
      meetingDate: "15/09/2026",
      workDoneCurrent: "Integrated the SafeWalk feature allowing students walking late across campus to stream real-time location breadcrumbs to selected peers. Added stealth calculator disguise mode for coercive situations and prepared emergency medical cards (blood group, allergies).",
      workDoneNext: "Conduct end-to-end integration testing, network latency benchmarking across 4G/5G and Wi-Fi, and organize a mock security drill.",
      supervisorComments: "SafeWalk and stealth disguise show thoughtful consideration of real-world user safety. Proceed to full end-to-end stress testing.",
      supervisorSignatureDate: "15/09/2026"
    },
    {
      weekNo: 9,
      meetingDate: "22/09/2026",
      workDoneCurrent: "Conducted exhaustive stress testing and latency benchmarking across PSIT campus Wi-Fi and mobile networks. Achieved an average alert delivery latency of 1.42 seconds. Simulated 50 concurrent SOS requests without packet drop. Refined false alarm filters.",
      workDoneNext: "Finalize code refactoring, complete project documentation, format the Progress Diary as per BCA-5005 guidelines, and assemble the presentation deck.",
      supervisorComments: "System benchmark results exceed project expectations. Complete the final diary documentation and prepare for evaluation defense.",
      supervisorSignatureDate: "22/09/2026"
    },
    {
      weekNo: 10,
      meetingDate: "29/09/2026",
      workDoneCurrent: "Completed comprehensive code documentation, unit testing, and UI polish. Formatted the complete 21-page Minor Project Progress Diary matching PSIT departmental templates. Conducted pre-submission rehearsal for presentation and live software demonstration.",
      workDoneNext: "Submit the finalized Project Progress Diary, project report, and software artifact for End-Semester BCA Minor Project evaluation.",
      supervisorComments: "Outstanding project execution throughout the semester. The software prototype is robust and the documentation is complete. Approved for final evaluation.",
      supervisorSignatureDate: "29/09/2026"
    }
  ]
};
