/**
 * Client-side or Server-side local semantic similarity calculations (Jaro-Winkler string similarity heuristic)
 */
export function calculateCosineSimilarityHeuristic(str1: string, str2: string): number {
  const s1 = (str1 || "").toLowerCase().trim();
  const s2 = (str2 || "").toLowerCase().trim();

  if (s1 === s2) return 1.0;
  if (s1.length === 0 || s2.length === 0) return 0.0;

  // Let's compute word matches
  const words1 = s1.split(/\s+/);
  const words2 = s2.split(/\s+/);

  const set1 = new Set(words1);
  const set2 = new Set(words2);

  // Intersection / Union
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  return intersection.size / union.size;
}

export class EmbeddingService {
  /**
   * Generates a pseudo-embedding vector for a text string
   */
  generateVector(text: string): number[] {
    const vector = Array.from({ length: 32 }, () => 0);
    const cleaned = text.toLowerCase().replace(/[^a-z0-9]/g, "");
    
    for (let i = 0; i < cleaned.length; i++) {
      const charCode = cleaned.charCodeAt(i);
      const index = charCode % 32;
      vector[index] += 1;
    }

    // Normalise
    const mag = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    if (mag === 0) return vector;
    return vector.map((v) => v / mag);
  }

  /**
   * Compares two 32-dim pseudo embedding vectors
   */
  cosineSimilarity(vec1: number[], vec2: number[]): number {
    let dotProduct = 0;
    for (let i = 0; i < 32; i++) {
      dotProduct += vec1[i] * vec2[i];
    }
    return dotProduct;
  }
}
