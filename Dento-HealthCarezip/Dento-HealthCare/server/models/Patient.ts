import mongoose, { Schema, Document } from 'mongoose';

export interface IPatient extends Document {
  name: string;
  dob: Date;
  gender: string;
  contact: string;
  email: string;
  address: string;
  medicalHistory: string[];
}

const PatientSchema: Schema = new Schema({
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, required: true },
  contact: { type: String },
  email: { type: String },
  address: { type: String },
  medicalHistory: [{ type: String }],
});

export default mongoose.model<IPatient>('Patient', PatientSchema);
