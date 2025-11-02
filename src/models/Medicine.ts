import { Schema, model, Document } from 'mongoose';

export interface IMedicine extends Document {
  name: string;
  quantity?: number;
  pharmacyId?: Schema.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const medicineSchema = new Schema<IMedicine>(
  {
    name: { type: String, required: true },
    quantity: { type: Number, default: 0 },
    pharmacyId: { type: Schema.Types.ObjectId, ref: 'Pharmacy' }
  },
  {
    timestamps: true,
    collection: 'medicines'
  }
);

export default model<IMedicine>('Medicine', medicineSchema);
