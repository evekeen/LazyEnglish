import {EnglishLevel} from './SettingsPage';

const MAX_WORDS = 50;
const MIN_WORD_LENGTH = 4;
const RU_REGEXP = /^[A-Яа-я]*$/;

function getLimit(level: EnglishLevel): number {
  switch (level) {
    case EnglishLevel.ELEMENTARY:
      return 0.1;
    case EnglishLevel.INTERMEDIATE:
      return 0.3;
    default:
      return 0.5;
  }
}

export function getTokens(text: string, level: EnglishLevel): string[] {
  console.log('getting tokens...');
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
  const wordsToTake = Math.min(total * getLimit(level), MAX_WORDS);
  return filtered.slice(0, wordsToTake);
}
