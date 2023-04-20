/* eslint-disable import/prefer-default-export */
import { v2 } from '@google-cloud/translate';

const translate = new v2.Translate({ key: process.env.GOOGLE_TRANSLATE_API_KEY });

export async function translateWords(words: string[], targetLanguage: string): Promise<string[]> {
  try {
    // Forcing from:english allows it to transliterate, preventing wrong translation of proper nouns
    const [translations] = await translate.translate(words, { from: 'en', to: targetLanguage });
    return translations;
  } catch (error: any) {
    throw new Error(`Error translating words: ${error.message}`);
  }
}
