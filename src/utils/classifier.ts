import { EmergencyCategory, ClassificationResult, ReportPriority } from '../types/emergency';

// Same keyword dictionaries as classify_emergency.py for BCA project viva
export const HIGH_PRIORITY_KEYWORDS = [
  'fire', 'smoke', 'burning', 'blast', 'explosion',
  'unconscious', 'fainted', 'not breathing', 'heart attack', 'chest pain',
  'severe bleeding', 'fracture', 'head injury', 'collapsed', 'stroke',
  'weapon', 'knife', 'gun', 'assault', 'physical attack', 'violence',
  'trapped', 'stuck in lift', 'drowning', 'electrocution', 'poison', 'immediate danger'
];

export const MEDIUM_PRIORITY_KEYWORDS = [
  'injury', 'accident', 'fall', 'bleeding', 'dizzy', 'asthma',
  'theft', 'stolen', 'harassment', 'stalking', 'ragging', 'threat',
  'water leak', 'short circuit', 'spark', 'gas smell'
];

/**
 * Keyword-based emergency classifier replicating Python viva script
 */
export function classifyEmergency(
  category: EmergencyCategory,
  description: string
): ClassificationResult {
  const descLower = description.toLowerCase();
  
  const matchedHigh = HIGH_PRIORITY_KEYWORDS.filter((kw) =>
    descLower.includes(kw)
  );
  const matchedMedium = MEDIUM_PRIORITY_KEYWORDS.filter((kw) =>
    descLower.includes(kw)
  );

  let priority: ReportPriority = 'Low';
  let reason = 'Standard report without immediate life-safety threat keywords.';

  if (category === 'Fire') {
    priority = 'High';
    reason = 'Fire emergencies are flagged as High Priority by default for life safety.';
  } else if (matchedHigh.length > 0) {
    priority = 'High';
    reason = `Critical high-urgency keywords detected: ${matchedHigh.join(', ')}`;
  } else if (
    matchedMedium.length > 0 ||
    ['Medical Emergency', 'Security Issue', 'Accident'].includes(category)
  ) {
    priority = 'Medium';
    reason = matchedMedium.length > 0
      ? `Medium-urgency keywords detected: ${matchedMedium.join(', ')}`
      : `Elevated priority automatically assigned for category: ${category}`;
  }

  return {
    priority,
    matchedKeywords: [...matchedHigh, ...matchedMedium],
    reason
  };
}
