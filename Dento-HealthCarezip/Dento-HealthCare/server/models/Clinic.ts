import mongoose, { Schema, Document } from 'mongoose';

export interface IClinic extends Document {
  name: string;
  address: string;
  contact: string;
  email: string;
}

const ClinicSchema: Schema = new Schema({
  name: { type: String, required: true },
  address: { type: String },
  contact: { type: String },
  email: { type: String },
});

export default mongoose.model<IClinic>('Clinic', ClinicSchema);
