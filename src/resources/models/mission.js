import mongoose from 'mongoose';

const MissionSchema = new mongoose.Schema({
  urls: [{
    catalog_fits: String,
    sources: String,
    sources_info: String,
    sources_light_curves: String,
    sources_list: String,
  }],
});

export default mongoose.model('parameters', MissionSchema);
