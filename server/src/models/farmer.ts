import mongoose from 'mongoose';
import { IFarmer } from '../interfaces';

const farmerSchema = new mongoose.Schema<IFarmer>({
  phone_number: {
    type: String,
    required: true,
  },
  farmer_name: {
    type: String,
  },
  state_name: {
    type: String,
  },
  district_name: {
    type: String,
  },
  village_name: {
    type: String,
  },
  translations: {
    type: Map,
    of: {
      farmer_name: String,
      state_name: String,
      district_name: String,
      village_name: String,
    },
    default: {},
  },
});

farmerSchema.index({ phone_number: 1 }, { unique: true });
export default mongoose.model<IFarmer>('Farmer', farmerSchema);

/**

{
  "_id": ObjectId("616f95a94a321f35033576f1"),
  "phone_number": "9876543210",
  "farmer_name": "John Doe",
  "state_name": "California",
  "district_name": "Los Angeles",
  "village_name": "Beverly Hills",
  "translations": {
    "hi": {
      "farmer_name": "जॉन डो",
      "state_name": "कैलिफोर्निया",
      "district_name": "लॉस एंजल्स",
      "village_name": "बेवर्ली हिल्स"
    },
    "mr": {
      "farmer_name": "जॉन डो",
      "state_name": "कॅलिफोर्निया",
      "district_name": "लॉस एंजेलेस",
      "village_name": "बेवर्ली हिल्स"
    },
    "te": {
      "farmer_name": "జాన్ డో",
      "state_name": "కాలిఫోర్నియా",
      "district_name": "లాస్ ఏంజల్స్",
      "village_name": "బెవర్లీ హిల్స్"
    },
    "pa": {
      "farmer_name": "ਜਾਨ ਡੋ",
      "state_name": "ਕੈਲੀਫੋਰਨੀਆ",
      "district_name": "ਲਾਸ ਐਂਜਲਸ",
      "village_name": "ਬੇਵਰਲੀ ਹਿੱਲਸ"
    }
  }
}
 */
