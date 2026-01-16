import { 
  users, patients, doctors, clinics, appointments, treatments, 
  treatmentPlans, reports, visitSessions, payments, clinicPrices,
  type User, type InsertUser, type Patient, type InsertPatient,
  type Doctor, type InsertDoctor, type Clinic, type InsertClinic,
  type Appointment, type InsertAppointment, type Treatment, type InsertTreatment,
  type TreatmentPlan, type InsertTreatmentPlan, type Report, type InsertReport,
  type VisitSession, type InsertVisitSession, type Payment, type InsertPayment,
  type ClinicPrice, type InsertClinicPrice
} from "@shared/schema";
import { db } from "./db";
import { eq, and, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getPatients(): Promise<Patient[]>;
  getPatient(id: string): Promise<Patient | undefined>;
  getPatientByUserId(userId: string): Promise<Patient | undefined>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  getDoctors(): Promise<Doctor[]>;
  getDoctor(id: string): Promise<Doctor | undefined>;
  createDoctor(doctor: InsertDoctor): Promise<Doctor>;
  getClinics(): Promise<Clinic[]>;
  getClinic(id: string): Promise<Clinic | undefined>;
  createClinic(clinic: InsertClinic): Promise<Clinic>;
  getAppointments(): Promise<Appointment[]>;
  getAppointment(id: string): Promise<Appointment | undefined>;
  getAppointmentsByPatient(patientId: string): Promise<Appointment[]>;
  getAppointmentsByDoctor(doctorId: string): Promise<Appointment[]>;
  getAppointmentsByDoctorAndDate(doctorId: string, date: string): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: string, data: Partial<Appointment>): Promise<Appointment | undefined>;
  getVisitSessions(): Promise<VisitSession[]>;
  getVisitSession(id: string): Promise<VisitSession | undefined>;
  getVisitSessionsByPatient(patientId: string): Promise<VisitSession[]>;
  createVisitSession(session: InsertVisitSession): Promise<VisitSession>;
  updateVisitSession(id: string, data: Partial<VisitSession>): Promise<VisitSession | undefined>;
  getPayments(): Promise<Payment[]>;
  getPaymentsByPatient(patientId: string): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPatientBalance(patientId: string): Promise<{ totalDue: number; totalPaid: number; balance: number }>;
  getClinicPrices(): Promise<ClinicPrice[]>;
  getClinicPrice(clinicId: string): Promise<ClinicPrice | undefined>;
  upsertClinicPrice(price: InsertClinicPrice): Promise<ClinicPrice>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getPatients(): Promise<Patient[]> {
    return await db.select().from(patients);
  }

  async getPatient(id: string): Promise<Patient | undefined> {
    const [patient] = await db.select().from(patients).where(eq(patients.id, id));
    return patient || undefined;
  }

  async getPatientByUserId(userId: string): Promise<Patient | undefined> {
    const [patient] = await db.select().from(patients).where(eq(patients.assignedToUserId, userId));
    return patient || undefined;
  }

  async createPatient(insertPatient: InsertPatient): Promise<Patient> {
    const [patient] = await db.insert(patients).values(insertPatient).returning();
    return patient;
  }

  async getDoctors(): Promise<Doctor[]> {
    return await db.select().from(doctors);
  }

  async getDoctor(id: string): Promise<Doctor | undefined> {
    const [doctor] = await db.select().from(doctors).where(eq(doctors.id, id));
    return doctor || undefined;
  }

  async createDoctor(insertDoctor: InsertDoctor): Promise<Doctor> {
    const [doctor] = await db.insert(doctors).values(insertDoctor).returning();
    return doctor;
  }

  async getClinics(): Promise<Clinic[]> {
    return await db.select().from(clinics);
  }

  async getClinic(id: string): Promise<Clinic | undefined> {
    const [clinic] = await db.select().from(clinics).where(eq(clinics.id, id));
    return clinic || undefined;
  }

  async createClinic(insertClinic: InsertClinic): Promise<Clinic> {
    const [clinic] = await db.insert(clinics).values(insertClinic).returning();
    return clinic;
  }

  async getAppointments(): Promise<Appointment[]> {
    return await db.select().from(appointments);
  }

  async getAppointment(id: string): Promise<Appointment | undefined> {
    const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));
    return appointment || undefined;
  }

  async getAppointmentsByPatient(patientId: string): Promise<Appointment[]> {
    return await db.select().from(appointments).where(eq(appointments.patientId, patientId));
  }

  async getAppointmentsByDoctor(doctorId: string): Promise<Appointment[]> {
    return await db.select().from(appointments).where(eq(appointments.doctorId, doctorId));
  }

  async getAppointmentsByDoctorAndDate(doctorId: string, date: string): Promise<Appointment[]> {
    return await db.select().from(appointments).where(
      and(eq(appointments.doctorId, doctorId), eq(appointments.date, date))
    );
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const [appointment] = await db.insert(appointments).values(insertAppointment).returning();
    return appointment;
  }

  async updateAppointment(id: string, data: Partial<Appointment>): Promise<Appointment | undefined> {
    const [appointment] = await db.update(appointments).set(data).where(eq(appointments.id, id)).returning();
    return appointment || undefined;
  }

  async getVisitSessions(): Promise<VisitSession[]> {
    return await db.select().from(visitSessions);
  }

  async getVisitSession(id: string): Promise<VisitSession | undefined> {
    const [session] = await db.select().from(visitSessions).where(eq(visitSessions.id, id));
    return session || undefined;
  }

  async getVisitSessionsByPatient(patientId: string): Promise<VisitSession[]> {
    return await db.select().from(visitSessions).where(eq(visitSessions.patientId, patientId));
  }

  async createVisitSession(insertSession: InsertVisitSession): Promise<VisitSession> {
    const [session] = await db.insert(visitSessions).values(insertSession).returning();
    return session;
  }

  async updateVisitSession(id: string, data: Partial<VisitSession>): Promise<VisitSession | undefined> {
    const [session] = await db.update(visitSessions).set(data).where(eq(visitSessions.id, id)).returning();
    return session || undefined;
  }

  async getPayments(): Promise<Payment[]> {
    return await db.select().from(payments);
  }

  async getPaymentsByPatient(patientId: string): Promise<Payment[]> {
    return await db.select().from(payments).where(eq(payments.patientId, patientId));
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const [payment] = await db.insert(payments).values(insertPayment).returning();
    return payment;
  }

  async getPatientBalance(patientId: string): Promise<{ totalDue: number; totalPaid: number; balance: number }> {
    const attendedSessions = await db.select().from(visitSessions)
      .where(and(eq(visitSessions.patientId, patientId), eq(visitSessions.attendanceStatus, "attended")));
    
    const totalDue = attendedSessions.reduce((sum, session) => sum + parseFloat(session.price || "0"), 0);
    
    const patientPayments = await db.select().from(payments)
      .where(and(eq(payments.patientId, patientId), eq(payments.status, "completed")));
    
    const totalPaid = patientPayments.reduce((sum, payment) => sum + parseFloat(payment.amount || "0"), 0);
    
    return { totalDue, totalPaid, balance: totalDue - totalPaid };
  }

  async getClinicPrices(): Promise<ClinicPrice[]> {
    return await db.select().from(clinicPrices);
  }

  async getClinicPrice(clinicId: string): Promise<ClinicPrice | undefined> {
    const [price] = await db.select().from(clinicPrices).where(eq(clinicPrices.clinicId, clinicId));
    return price || undefined;
  }

  async upsertClinicPrice(insertPrice: InsertClinicPrice): Promise<ClinicPrice> {
    const existing = await this.getClinicPrice(insertPrice.clinicId);
    if (existing) {
      const [updated] = await db.update(clinicPrices)
        .set({ ...insertPrice, updatedAt: new Date() })
        .where(eq(clinicPrices.clinicId, insertPrice.clinicId))
        .returning();
      return updated;
    }
    const [price] = await db.insert(clinicPrices).values(insertPrice).returning();
    return price;
  }
}

export const storage = new DatabaseStorage();
