import { TriageResult, MasterIssue } from '../types';

interface ClusterMatch {
  masterIssue: MasterIssue;
  similarity: number;
}

const clusterKeywords: Record<string, string[]> = {
  'MI-2026-0042': ['ml', 'machine learning', 'assignment', 'deadline', 'extension', 'ml assignment', 'ml project', 'cs-501'],
  'MI-2026-0038': ['exam', 'stress', 'anxiety', 'overwhelm', 'exam stress', 'study', 'test', 'wellbeing'],
  'MI-2026-0035': ['hostel', 'housing', 'fee', 'rent', 'accommodation', 'housing fee', 'hostel fee'],
};

export function findMatchingMasterIssue(
  triageResult: TriageResult,
  masterIssues: MasterIssue[]
): ClusterMatch | null {
  const allText = [
    triageResult.summary,
    ...triageResult.situations,
    ...Object.values(triageResult.entities),
  ].join(' ').toLowerCase();

  let bestMatch: ClusterMatch | null = null;
  let bestScore = 0;

  for (const issue of masterIssues) {
    const keywords = clusterKeywords[issue.id] || [];
    let matchCount = 0;

    for (const keyword of keywords) {
      if (allText.includes(keyword)) {
        matchCount++;
      }
    }

    const similarity = keywords.length > 0 ? matchCount / keywords.length : 0;

    if (similarity > bestScore && similarity >= 0.2) {
      bestScore = similarity;
      bestMatch = { masterIssue: issue, similarity };
    }
  }

  return bestMatch;
}

export function calculateSimilarityScore(text1: string, text2: string): number {
  const words1 = new Set(text1.toLowerCase().split(/\s+/));
  const words2 = new Set(text2.toLowerCase().split(/\s+/));

  let intersection = 0;
  for (const word of words1) {
    if (words2.has(word)) intersection++;
  }

  const union = new Set([...words1, ...words2]).size;
  return union > 0 ? intersection / union : 0;
}
