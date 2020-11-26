const cache: {[key: string]: string} = {};

export function translate(tokens: string[]): Promise<string[]> {
  const loaded = Object.keys(cache);
  const toRequest = tokens.filter((t) => loaded.indexOf(t) === -1);
  console.log(`Translating ${toRequest.length} words`);
  console.log(`Translating ${toRequest}`);
  return fetch(
    'https://translate.api.cloud.yandex.net/translate/v2/translate',
    {
      method: 'post',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Api-Key AQVN33qWMU8W76PkxSz3PR_bbtUvjnO89DaOuYm1',
      },
      body: JSON.stringify({
        folder_id: 'b1gqoik8njiusvkof4tm',
        texts: toRequest,
        targetLanguageCode: 'en',
      }),
    },
  )
    .then((response: Response) => response.json())
    .then((response: YandexResponse) => {
      const translations = response.translations?.map((t) => t.text) ?? [];
      console.log(`New translations: ${translations}`);
      for (let i = 0; i < toRequest.length; i++) {
        cache[toRequest[i]] = translations[i];
      }
      const allTranslations = tokens.map((t) => cache[t]);
      console.log(`All translations: ${allTranslations}`);
      return allTranslations;
    })
    .catch((err) => {
      console.log(err);
      return [];
    });
}

interface YandexResponse {
  translations: YandexTranslation[];
}

interface YandexTranslation {
  text: string;
}
