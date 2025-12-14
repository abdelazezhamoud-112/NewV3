import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
  patient: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
  reportType: string;
  content: string;
  date: Date;
}

const ReportSchema: Schema = new Schema({
  patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
  reportType: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, required: true },
});

export default mongoose.model<IReport>('Report', ReportSchema);
