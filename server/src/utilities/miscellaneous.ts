import fs from 'fs';
import csv from 'csv-parser';

export async function parseCSV(file: Express.Multer.File): Promise<any[]> {
  const records: any[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(file.path)
      .pipe(csv({ strict: true }))
      .on('data', (data: any) => records.push(data))
      .on('end', () => {
        resolve(records);
      })
      .on('error', (err: any) => {
        reject(err);
      });
  });
}
