/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { Express } from 'express';

import Farmer from '../models/farmer';
import { IFarmer, IFarmerCSV } from '../interfaces';
import { translateWords } from '../utilities/gapis';
import { parseCSV } from '../utilities/miscellaneous';

const supportedLanguages = ['hi', 'mr', 'te', 'pa'];
const googleTranslateSegmentsLimit = 128;

export default class FarmerController {
  static async getFarmersCount(): Promise<number> {
    return Farmer.countDocuments();
  }

  static async getFarmersByLanguage(
    language: string = 'en',
    offset: number = 0,
    limit: number = 10,
  ): Promise<IFarmer[]> {
    if (!['en', ...supportedLanguages].includes(language)) {
      throw new Error(`Language ${language} not supported`);
    }

    return Farmer.find(
      { [`translations.${language}`]: { $exists: true } },
      { phone_number: 1, [`translations.${language}`]: 1 },
    )
      .sort({ _id: 1 })
      .skip(offset)
      .limit(limit);
  }

  static async upsertFarmersCSV(file: Express.Multer.File): Promise<void> {
    const farmers = (await parseCSV(file)) as IFarmerCSV[];

    // GTranslate API supports limited text segments per request
    const numFieldsToTranslate = 4;
    const chunkSize = googleTranslateSegmentsLimit / numFieldsToTranslate;

    for (let i = 0; i < farmers.length; i += chunkSize) {
      await FarmerController.processUpsertFarmer(farmers.slice(i, i + chunkSize));
    }
  }

  static async processUpsertFarmer(farmers: IFarmerCSV[]) {
    const textToTranslate: string[] = [];

    // Collect all the text segments to translate
    const translatedFarmers: IFarmer[] = farmers.map((farmer: IFarmerCSV) => {
      textToTranslate.push(
        farmer.farmer_name,
        farmer.state_name,
        farmer.district_name,
        farmer.village_name,
      );

      return {
        phone_number: farmer.phone_number,
        farmer_name: farmer.farmer_name,
        state_name: farmer.state_name,
        district_name: farmer.district_name,
        village_name: farmer.village_name,
        translations: new Map([
          // Duplicating english data will help simplify clients
          // We need it outside anyway for filtering, search etc features
          [
            'en',
            {
              farmer_name: farmer.farmer_name,
              state_name: farmer.state_name,
              district_name: farmer.district_name,
              village_name: farmer.village_name,
            },
          ],
        ]),
      };
    });

    // Translate the data in all languages
    for (const language of supportedLanguages) {
      const translatedWords = await translateWords(textToTranslate, language);

      translatedFarmers.forEach((farmer: IFarmer, index: number) => {
        farmer.translations.set(language, {
          farmer_name: translatedWords[index * 4],
          state_name: translatedWords[index * 4 + 1],
          district_name: translatedWords[index * 4 + 2],
          village_name: translatedWords[index * 4 + 3],
        });
      });
    }

    // Bulk upsert farmer data into database
    await Farmer.bulkWrite(
      translatedFarmers.map((farmer: IFarmer) => ({
        updateOne: {
          filter: { phone_number: farmer.phone_number },
          update: farmer,
          upsert: true,
        },
      })),
    );
  }
}
