import mongoose, { Schema, Document } from 'mongoose';

export interface ITreatment extends Document {
  patient: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
  description: string;
  date: Date;
  cost: number;
}

const TreatmentSchema: Schema = new Schema({
  patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  cost: { type: Number },
});

export default mongoose.model<ITreatment>('Treatment', TreatmentSchema);
