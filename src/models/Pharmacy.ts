import { Schema, model, Document } from 'mongoose';

export interface IPharmacy extends Document {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  email?: string;
  isVerified: boolean;
  openHours?: Record<string, { open: string; close: string; closed?: boolean }>;
}

const pharmacySchema = new Schema<IPharmacy>(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    phone: String,
    email: String,
    isVerified: { type: Boolean, default: false },
    openHours: { type: Map, of: new Schema({ open: String, close: String, closed: Boolean }) }
  },
  {
    timestamps: true,
    collection: 'pharmacies'
  }
);

pharmacySchema.index({ latitude: 1, longitude: 1 });
pharmacySchema.index({ name: 'text' });

export default model<IPharmacy>('Pharmacy', pharmacySchema);
