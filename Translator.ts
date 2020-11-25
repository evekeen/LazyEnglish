const cache: {[key: string]: string} = {};

export function translate(tokens: string[]): Promise<string[]> {
  const loaded = Object.keys(cache);
  const toRequest = tokens.filter((t) => loaded.indexOf(t) === -1);
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
      const translation = response.translations?.map((t) => t.text) ?? [];
      console.log(translation.slice(0, 10));
      for (let i = 0; i < toRequest.length; i++) {
        cache[toRequest[i]] = translation[i];
      }
      return tokens.map((t) => cache[t]);
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
