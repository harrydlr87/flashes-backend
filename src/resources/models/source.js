import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const SourceSchema = new mongoose.Schema({
  source: String,
  LII: Number,
  BII: Number,
  period: Number,
  url_swift: String,
  url_maxi: String,
  url_simbad: String,
  simbad_id: String,
  src_type: String,
  mission: String,
  light_curves: [String],
});

SourceSchema.plugin(mongoosePaginate);

export default mongoose.model('source', SourceSchema);
