interface IFarmer {
  phone_number: string;
  farmer_name: string;
  state_name: string;
  district_name: string;
  village_name: string;
  translations: Map<
    string,
    {
      farmer_name: string;
      state_name: string;
      district_name: string;
      village_name: string;
    }
  >;
}

interface IFarmerCSV {
  phone_number: string;
  farmer_name: string;
  state_name: string;
  district_name: string;
  village_name: string;
}

interface IUser {
  id: string;
  username: string;
  password: string;
  createdAt: string;
}

export type { IFarmer, IFarmerCSV, IUser };
