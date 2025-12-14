import mongoose, { Schema, Document } from 'mongoose';

export interface IDoctor extends Document {
  name: string;
  specialization: string;
  contact: string;
  email: string;
  clinic: string;
}

const DoctorSchema: Schema = new Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  contact: { type: String },
  email: { type: String },
  clinic: { type: String },
});

export default mongoose.model<IDoctor>('Doctor', DoctorSchema);
