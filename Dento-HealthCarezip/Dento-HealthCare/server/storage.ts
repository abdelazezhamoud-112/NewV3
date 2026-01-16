import {
  UserModel, PatientModel, DoctorModel, ClinicModel, AppointmentModel,
  TreatmentModel, TreatmentPlanModel, ReportModel, VisitSessionModel,
  PaymentModel, ClinicPriceModel
} from "./mongodb";

function toPlainObject(doc: any): any {
  if (!doc) return undefined;
  const obj = doc.toObject ? doc.toObject() : doc;
  obj.id = obj._id?.toString() || obj.id;
  delete obj._id;
  delete obj.__v;
  
  // Fallback: map legacy 'name' field to 'fullName' for backward compatibility
  if (!obj.fullName && obj.name) {
    obj.fullName = obj.name;
  }
  
  return obj;
}

export interface IStorage {
  getUser(id: string): Promise<any>;
  getUserByUsername(username: string): Promise<any>;
  createUser(user: any): Promise<any>;
  getPatients(): Promise<any[]>;
  getPatient(id: string): Promise<any>;
  getPatientByUserId(userId: string): Promise<any>;
  createPatient(patient: any): Promise<any>;
  getDoctors(): Promise<any[]>;
  getDoctor(id: string): Promise<any>;
  getDoctorByUserId(userId: string): Promise<any>;
  createDoctor(doctor: any): Promise<any>;
  getClinics(): Promise<any[]>;
  getClinic(id: string): Promise<any>;
  createClinic(clinic: any): Promise<any>;
  getAppointments(): Promise<any[]>;
  getAppointment(id: string): Promise<any>;
  getAppointmentsByPatient(patientId: string): Promise<any[]>;
  getAppointmentsByDoctor(doctorId: string): Promise<any[]>;
  getAppointmentsByDoctorAndDate(doctorId: string, date: string): Promise<any[]>;
  createAppointment(appointment: any): Promise<any>;
  updateAppointment(id: string, data: any): Promise<any>;
  getVisitSessions(): Promise<any[]>;
  getVisitSession(id: string): Promise<any>;
  getVisitSessionsByPatient(patientId: string): Promise<any[]>;
  createVisitSession(session: any): Promise<any>;
  updateVisitSession(id: string, data: any): Promise<any>;
  getPayments(): Promise<any[]>;
  getPaymentsByPatient(patientId: string): Promise<any[]>;
  createPayment(payment: any): Promise<any>;
  getPatientBalance(patientId: string): Promise<{ totalDue: number; totalPaid: number; balance: number }>;
  getClinicPrices(): Promise<any[]>;
  getClinicPrice(clinicId: string): Promise<any>;
  upsertClinicPrice(price: any): Promise<any>;
}

export class MongoStorage implements IStorage {
  async getUser(id: string): Promise<any> {
    const user = await UserModel.findById(id);
    return toPlainObject(user);
  }

  async getUserByUsername(username: string): Promise<any> {
    const user = await UserModel.findOne({ username });
    return toPlainObject(user);
  }

  async createUser(insertUser: any): Promise<any> {
    const user = await UserModel.create(insertUser);
    return toPlainObject(user);
  }

  async getPatients(): Promise<any[]> {
    const patients = await PatientModel.find();
    return patients.map(toPlainObject);
  }

  async getPatient(id: string): Promise<any> {
    const patient = await PatientModel.findById(id);
    return toPlainObject(patient);
  }

  async getPatientByUserId(userId: string): Promise<any> {
    const patient = await PatientModel.findOne({ assignedToUserId: userId });
    return toPlainObject(patient);
  }

  async createPatient(insertPatient: any): Promise<any> {
    const patient = await PatientModel.create(insertPatient);
    return toPlainObject(patient);
  }

  async getDoctors(): Promise<any[]> {
    const doctors = await DoctorModel.find();
    return doctors.map(toPlainObject);
  }

  async getDoctor(id: string): Promise<any> {
    const doctor = await DoctorModel.findById(id);
    return toPlainObject(doctor);
  }

  async getDoctorByUserId(userId: string): Promise<any> {
    const doctor = await DoctorModel.findOne({ userId });
    return toPlainObject(doctor);
  }

  async createDoctor(insertDoctor: any): Promise<any> {
    const doctor = await DoctorModel.create(insertDoctor);
    return toPlainObject(doctor);
  }

  async getClinics(): Promise<any[]> {
    const clinics = await ClinicModel.find();
    return clinics.map(toPlainObject);
  }

  async getClinic(id: string): Promise<any> {
    const clinic = await ClinicModel.findById(id);
    return toPlainObject(clinic);
  }

  async createClinic(insertClinic: any): Promise<any> {
    const clinic = await ClinicModel.create(insertClinic);
    return toPlainObject(clinic);
  }

  async getAppointments(): Promise<any[]> {
    const appointments = await AppointmentModel.find();
    return appointments.map(toPlainObject);
  }

  async getAppointment(id: string): Promise<any> {
    const appointment = await AppointmentModel.findById(id);
    return toPlainObject(appointment);
  }

  async getAppointmentsByPatient(patientId: string): Promise<any[]> {
    const appointments = await AppointmentModel.find({ patientId });
    return appointments.map(toPlainObject);
  }

  async getAppointmentsByDoctor(doctorId: string): Promise<any[]> {
    const appointments = await AppointmentModel.find({ doctorId });
    return appointments.map(toPlainObject);
  }

  async getAppointmentsByDoctorAndDate(doctorId: string, date: string): Promise<any[]> {
    const appointments = await AppointmentModel.find({ doctorId, date });
    return appointments.map(toPlainObject);
  }

  async createAppointment(insertAppointment: any): Promise<any> {
    const appointment = await AppointmentModel.create(insertAppointment);
    return toPlainObject(appointment);
  }

  async updateAppointment(id: string, data: any): Promise<any> {
    const appointment = await AppointmentModel.findByIdAndUpdate(id, data, { new: true });
    return toPlainObject(appointment);
  }

  async getVisitSessions(): Promise<any[]> {
    const sessions = await VisitSessionModel.find();
    return sessions.map(toPlainObject);
  }

  async getVisitSession(id: string): Promise<any> {
    const session = await VisitSessionModel.findById(id);
    return toPlainObject(session);
  }

  async getVisitSessionsByPatient(patientId: string): Promise<any[]> {
    const sessions = await VisitSessionModel.find({ patientId });
    return sessions.map(toPlainObject);
  }

  async createVisitSession(insertSession: any): Promise<any> {
    const session = await VisitSessionModel.create(insertSession);
    return toPlainObject(session);
  }

  async updateVisitSession(id: string, data: any): Promise<any> {
    const session = await VisitSessionModel.findByIdAndUpdate(id, data, { new: true });
    return toPlainObject(session);
  }

  async getPayments(): Promise<any[]> {
    const payments = await PaymentModel.find();
    return payments.map(toPlainObject);
  }

  async getPaymentsByPatient(patientId: string): Promise<any[]> {
    const payments = await PaymentModel.find({ patientId });
    return payments.map(toPlainObject);
  }

  async createPayment(insertPayment: any): Promise<any> {
    const payment = await PaymentModel.create(insertPayment);
    return toPlainObject(payment);
  }

  async getPatientBalance(patientId: string): Promise<{ totalDue: number; totalPaid: number; balance: number }> {
    const attendedSessions = await VisitSessionModel.find({ 
      patientId, 
      attendanceStatus: "attended" 
    });
    
    const totalDue = attendedSessions.reduce((sum, session) => sum + parseFloat(session.price || "0"), 0);
    
    const patientPayments = await PaymentModel.find({ patientId });
    const totalPaid = patientPayments.reduce((sum, payment) => sum + parseFloat(payment.amount || "0"), 0);
    
    return { totalDue, totalPaid, balance: totalDue - totalPaid };
  }

  async getClinicPrices(): Promise<any[]> {
    const prices = await ClinicPriceModel.find();
    return prices.map(toPlainObject);
  }

  async getClinicPrice(clinicId: string): Promise<any> {
    const price = await ClinicPriceModel.findOne({ clinicId });
    return toPlainObject(price);
  }

  async upsertClinicPrice(insertPrice: any): Promise<any> {
    const price = await ClinicPriceModel.findOneAndUpdate(
      { clinicId: insertPrice.clinicId },
      { ...insertPrice, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    return toPlainObject(price);
  }
}

export const storage = new MongoStorage();
