import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const { Schema } = mongoose;

const userManualSchema = new Schema({
  type: { type: String, required: true },
  file: [{ type: String, required: true }],
  is_deleted: { type: Boolean, default: false },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});
userManualSchema.plugin(mongoosePaginate);
export default mongoose.model('UserManual', userManualSchema);
