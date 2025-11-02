import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  fullName?: string;
  role: 'user' | 'pharmacist';
  avatarUrl?: string;
  pharmacyId?: Schema.Types.ObjectId;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    fullName: String,
    role: { type: String, enum: ['user', 'pharmacist'], default: 'user' },
    avatarUrl: String,
    pharmacyId: { type: Schema.Types.ObjectId, ref: 'Pharmacy' }
  },
  {
    timestamps: true,
    collection: 'users'
  }
);

export default model<IUser>('User', userSchema);
