const WORD_COUNT_THRESHOLD = 0.3;
const MAX_WORDS = 5;
const MIN_WORD_LENGTH = 4;
const RU_REGEXP = /^[A-Яа-я]*$/;

export function getTokens(text: string): string[] {
  const words = text.split(/\s+/);
  const index: {[key: string]: number} = {};
  words
    .filter((w) => w.length >= MIN_WORD_LENGTH && RU_REGEXP.test(w))
    .forEach((w) => {
      const count = index[w] || 0;
      index[w] = count + 1;
    });

  const filtered = Object.keys(index);
  const total = filtered.length;
  filtered.sort((a, b) => index[b] - index[a]);
  const wordsToTake = Math.min(total * WORD_COUNT_THRESHOLD, MAX_WORDS);
  return filtered.slice(0, wordsToTake);
}
