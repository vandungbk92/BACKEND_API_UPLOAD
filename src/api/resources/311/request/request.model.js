import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const { Schema } = mongoose;

const requestSchema = new Schema(
  {
    images_req: [],
    files_req: [],
    typePublic: { type: Number, default: 0 },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

requestSchema.plugin(mongoosePaginate);

let Request = mongoose.model('Request', requestSchema);

export default Request;
