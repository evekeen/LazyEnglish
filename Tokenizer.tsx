import {EnglishLevel} from './SettingsPage';

const MAX_WORDS = 50;
const MIN_WORD_LENGTH = 5;
const RU_REGEXP = /^[аАбБвВгГдДеЕёЁжЖзЗиИйЙкКлЛмМнНоОпПрРсСтТуУфФхХцЦчЧшШщЩъЪыЫьЬэЭюЮяЯ]+$/;

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
  console.log('Splitting...');
  const tokens = text.toLocaleLowerCase('ru').split(/[.,\-+=;:"!?\n\/\\ ']+/);
  console.log(`Found ${tokens.length} tokens`);
  const words = new Set(tokens);
  console.log(`Found ${words.size} words`);

  const index: {[key: string]: number} = {};
  words.forEach((w) => {
    if (w.length >= MIN_WORD_LENGTH && RU_REGEXP.test(w)) {
      const count = index[w] || 0;
      index[w] = count + 1;
    }
  });

  const filtered = Object.keys(index);
  console.log(`filtered ${filtered}`);
  const total = filtered.length;
  filtered.sort((a, b) => index[b] - index[a]);
  const wordsToTake = Math.min(total * getLimit(level), MAX_WORDS);
  return filtered.slice(0, wordsToTake);
}
