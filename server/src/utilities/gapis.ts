import { v2 } from '@google-cloud/translate';

const translate = new v2.Translate({ key: process.env.GOOGLE_TRANSLATE_API_KEY });

export async function translateWords(words: string[], targetLanguage: string): Promise<string[]> {
  try {
    const [translations] = await translate.translate(words, targetLanguage);
    return translations;
  } catch (error: any) {
    throw new Error(`Error translating words: ${error.message}`);
  }
}
