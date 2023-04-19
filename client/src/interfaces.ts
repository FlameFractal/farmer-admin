interface IFarmer {
  phone_number: string;
  farmer_name: string;
  state_name: string;
  district_name: string;
  village_name: string;
  translations: { [key: string]: IFarmer };
}

interface IFarmerCSV {
  phone_number: string;
  farmer_name: string;
  state_name: string;
  district_name: string;
  village_name: string;
}

export type { IFarmer, IFarmerCSV };

export const LanguageCodesToNames = {
  en: 'English',
  hi: 'Hindi',
  mr: 'Marathi',
  te: 'Telugu',
  pa: 'Punjabi',
};
