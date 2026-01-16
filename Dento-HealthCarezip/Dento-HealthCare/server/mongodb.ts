import mongoose from 'mongoose';

export const connectMongoDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI must be set');
  }

  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  userType: { type: String, required: true, enum: ['patient', 'doctor', 'student', 'graduate'] },
  createdAt: { type: Date, default: Date.now }
});

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number },
  gender: { type: String },
  phone: { type: String },
  email: { type: String },
  address: { type: String },
  medicalHistory: { type: String },
  clinicId: { type: String },
  assignedToUserId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String },
  phone: { type: String },
  email: { type: String },
  clinicId: { type: String },
  userId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const clinicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameAr: { type: String },
  description: { type: String },
  color: { type: String },
  icon: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const appointmentSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  doctorId: { type: String, required: true },
  clinicId: { type: String },
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, default: 'scheduled' },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const treatmentSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  doctorId: { type: String, required: true },
  clinicId: { type: String },
  description: { type: String, required: true },
  date: { type: String, required: true },
  cost: { type: String },
  status: { type: String, default: 'pending' },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const treatmentPlanSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  doctorId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  steps: { type: [String] },
  status: { type: String, default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

const reportSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  doctorId: { type: String, required: true },
  type: { type: String, required: true },
  content: { type: String },
  date: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const visitSessionSchema = new mongoose.Schema({
  appointmentId: { type: String, required: true },
  patientId: { type: String, required: true },
  doctorId: { type: String, required: true },
  clinicId: { type: String, required: true },
  sessionDate: { type: String, required: true },
  attendanceStatus: { type: String, default: 'pending', enum: ['pending', 'attended', 'missed'] },
  price: { type: String, default: '500' },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const paymentSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  amount: { type: String, required: true },
  paymentMethod: { type: String, default: 'cash' },
  paymentDate: { type: String, required: true },
  notes: { type: String },
  createdBy: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const clinicPriceSchema = new mongoose.Schema({
  clinicId: { type: String, required: true, unique: true },
  sessionPrice: { type: String, default: '500' },
  updatedAt: { type: Date, default: Date.now }
});

export const UserModel = mongoose.model('User', userSchema);
export const PatientModel = mongoose.model('Patient', patientSchema);
export const DoctorModel = mongoose.model('Doctor', doctorSchema);
export const ClinicModel = mongoose.model('Clinic', clinicSchema);
export const AppointmentModel = mongoose.model('Appointment', appointmentSchema);
export const TreatmentModel = mongoose.model('Treatment', treatmentSchema);
export const TreatmentPlanModel = mongoose.model('TreatmentPlan', treatmentPlanSchema);
export const ReportModel = mongoose.model('Report', reportSchema);
export const VisitSessionModel = mongoose.model('VisitSession', visitSessionSchema);
export const PaymentModel = mongoose.model('Payment', paymentSchema);
export const ClinicPriceModel = mongoose.model('ClinicPrice', clinicPriceSchema);
