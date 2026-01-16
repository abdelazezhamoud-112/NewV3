import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, numeric, date, index, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  userType: text("user_type").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const clinics = pgTable("clinics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  nameEn: text("name_en"),
  specializationTag: text("specialization_tag"),
  address: text("address"),
  contact: text("contact"),
  email: text("email"),
});

export const doctors = pgTable("doctors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  specialization: text("specialization").notNull(),
  contact: text("contact"),
  email: text("email"),
  clinicId: varchar("clinic_id").references(() => clinics.id, { onDelete: 'set null' }),
});

export const patients = pgTable("patients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: text("full_name").notNull(),
  age: integer("age").notNull(),
  phone: text("phone").notNull(),
  clinicId: varchar("clinic_id").notNull().references(() => clinics.id, { onDelete: 'restrict' }),
  assignedToUserId: varchar("assigned_to_user_id").references(() => users.id, { onDelete: 'set null' }),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const appointments = pgTable("appointments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").notNull().references(() => patients.id, { onDelete: 'cascade' }),
  doctorId: varchar("doctor_id").notNull().references(() => doctors.id, { onDelete: 'restrict' }),
  date: date("date").notNull(),
  time: text("time").notNull(),
  status: text("status").notNull().default("scheduled"),
  notes: text("notes"),
});

export const treatments = pgTable("treatments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").notNull().references(() => patients.id, { onDelete: 'cascade' }),
  doctorId: varchar("doctor_id").notNull().references(() => doctors.id, { onDelete: 'restrict' }),
  description: text("description").notNull(),
  date: date("date").notNull(),
  cost: numeric("cost"),
});

export const treatmentPlans = pgTable("treatment_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").notNull().references(() => patients.id, { onDelete: 'cascade' }),
  clinicId: varchar("clinic_id").notNull().references(() => clinics.id, { onDelete: 'restrict' }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reports = pgTable("reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").notNull().references(() => patients.id, { onDelete: 'cascade' }),
  clinicId: varchar("clinic_id").notNull().references(() => clinics.id, { onDelete: 'restrict' }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  reportType: text("report_type").notNull(),
  createdBy: varchar("created_by").notNull().references(() => users.id, { onDelete: 'restrict' }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const visitSessions = pgTable("visit_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  appointmentId: varchar("appointment_id").references(() => appointments.id, { onDelete: 'set null' }),
  patientId: varchar("patient_id").notNull().references(() => patients.id, { onDelete: 'cascade' }),
  doctorId: varchar("doctor_id").notNull().references(() => doctors.id, { onDelete: 'restrict' }),
  clinicId: varchar("clinic_id").notNull().references(() => clinics.id, { onDelete: 'restrict' }),
  sessionDate: date("session_date").notNull(),
  attendanceStatus: text("attendance_status").notNull().default("scheduled"),
  price: numeric("price").notNull().default("500"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").notNull().references(() => patients.id, { onDelete: 'cascade' }),
  amount: numeric("amount").notNull(),
  paymentDate: timestamp("payment_date").defaultNow(),
  paymentMethod: text("payment_method").notNull().default("cash"),
  status: text("status").notNull().default("completed"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const clinicPrices = pgTable("clinic_prices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clinicId: varchar("clinic_id").notNull().references(() => clinics.id, { onDelete: 'cascade' }),
  sessionPrice: numeric("session_price").notNull().default("500"),
  updatedBy: varchar("updated_by").references(() => users.id, { onDelete: 'set null' }),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertClinicSchema = createInsertSchema(clinics).omit({
  id: true,
});

export const insertDoctorSchema = createInsertSchema(doctors).omit({
  id: true,
});

export const insertPatientSchema = createInsertSchema(patients).omit({
  id: true,
  createdAt: true,
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
});

export const insertTreatmentSchema = createInsertSchema(treatments).omit({
  id: true,
});

export const insertTreatmentPlanSchema = createInsertSchema(treatmentPlans).omit({
  id: true,
  createdAt: true,
});

export const insertReportSchema = createInsertSchema(reports).omit({
  id: true,
  createdAt: true,
});

export const insertVisitSessionSchema = createInsertSchema(visitSessions).omit({
  id: true,
  createdAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
  paymentDate: true,
});

export const insertClinicPriceSchema = createInsertSchema(clinicPrices).omit({
  id: true,
  updatedAt: true,
});

export const patientsRelations = relations(patients, ({ one, many }) => ({
  clinic: one(clinics, {
    fields: [patients.clinicId],
    references: [clinics.id],
  }),
  assignedToUser: one(users, {
    fields: [patients.assignedToUserId],
    references: [users.id],
  }),
  appointments: many(appointments),
  treatments: many(treatments),
  treatmentPlans: many(treatmentPlans),
  reports: many(reports),
  visitSessions: many(visitSessions),
  payments: many(payments),
}));

export const doctorsRelations = relations(doctors, ({ one, many }) => ({
  clinic: one(clinics, {
    fields: [doctors.clinicId],
    references: [clinics.id],
  }),
  appointments: many(appointments),
  treatments: many(treatments),
  visitSessions: many(visitSessions),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  patient: one(patients, {
    fields: [appointments.patientId],
    references: [patients.id],
  }),
  doctor: one(doctors, {
    fields: [appointments.doctorId],
    references: [doctors.id],
  }),
}));

export const treatmentsRelations = relations(treatments, ({ one }) => ({
  patient: one(patients, {
    fields: [treatments.patientId],
    references: [patients.id],
  }),
  doctor: one(doctors, {
    fields: [treatments.doctorId],
    references: [doctors.id],
  }),
}));

export const treatmentPlansRelations = relations(treatmentPlans, ({ one }) => ({
  patient: one(patients, {
    fields: [treatmentPlans.patientId],
    references: [patients.id],
  }),
  clinic: one(clinics, {
    fields: [treatmentPlans.clinicId],
    references: [clinics.id],
  }),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  patient: one(patients, {
    fields: [reports.patientId],
    references: [patients.id],
  }),
  clinic: one(clinics, {
    fields: [reports.clinicId],
    references: [clinics.id],
  }),
  createdBy: one(users, {
    fields: [reports.createdBy],
    references: [users.id],
  }),
}));

export const clinicsRelations = relations(clinics, ({ many }) => ({
  patients: many(patients),
  doctors: many(doctors),
  treatmentPlans: many(treatmentPlans),
  reports: many(reports),
  visitSessions: many(visitSessions),
  clinicPrices: many(clinicPrices),
}));

export const usersRelations = relations(users, ({ many }) => ({
  assignedPatients: many(patients),
  createdReports: many(reports),
}));

export const visitSessionsRelations = relations(visitSessions, ({ one }) => ({
  appointment: one(appointments, {
    fields: [visitSessions.appointmentId],
    references: [appointments.id],
  }),
  patient: one(patients, {
    fields: [visitSessions.patientId],
    references: [patients.id],
  }),
  doctor: one(doctors, {
    fields: [visitSessions.doctorId],
    references: [doctors.id],
  }),
  clinic: one(clinics, {
    fields: [visitSessions.clinicId],
    references: [clinics.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  patient: one(patients, {
    fields: [payments.patientId],
    references: [patients.id],
  }),
}));

export const clinicPricesRelations = relations(clinicPrices, ({ one }) => ({
  clinic: one(clinics, {
    fields: [clinicPrices.clinicId],
    references: [clinics.id],
  }),
  updatedByUser: one(users, {
    fields: [clinicPrices.updatedBy],
    references: [users.id],
  }),
}));

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertClinic = z.infer<typeof insertClinicSchema>;
export type Clinic = typeof clinics.$inferSelect;
export type InsertDoctor = z.infer<typeof insertDoctorSchema>;
export type Doctor = typeof doctors.$inferSelect;
export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type Patient = typeof patients.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointments.$inferSelect;
export type InsertTreatment = z.infer<typeof insertTreatmentSchema>;
export type Treatment = typeof treatments.$inferSelect;
export type InsertTreatmentPlan = z.infer<typeof insertTreatmentPlanSchema>;
export type TreatmentPlan = typeof treatmentPlans.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;
export type Report = typeof reports.$inferSelect;
export type InsertVisitSession = z.infer<typeof insertVisitSessionSchema>;
export type VisitSession = typeof visitSessions.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertClinicPrice = z.infer<typeof insertClinicPriceSchema>;
export type ClinicPrice = typeof clinicPrices.$inferSelect;
