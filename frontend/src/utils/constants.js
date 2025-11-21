export const ALLOWED_FILE_TYPES = ['text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

export const MAX_FILE_SIZE = 16 * 1024 * 1024; // 16MB

export const ATS_SCORE_LEVELS = {
  EXCELLENT: { min: 70, color: 'green', label: 'Excellent' },
  GOOD: { min: 50, color: 'yellow', label: 'Good' },
  NEEDS_IMPROVEMENT: { min: 0, color: 'red', label: 'Needs Improvement' }
};

export const getATSScoreLevel = (score) => {
  if (score >= ATS_SCORE_LEVELS.EXCELLENT.min) return ATS_SCORE_LEVELS.EXCELLENT;
  if (score >= ATS_SCORE_LEVELS.GOOD.min) return ATS_SCORE_LEVELS.GOOD;
  return ATS_SCORE_LEVELS.NEEDS_IMPROVEMENT;
};