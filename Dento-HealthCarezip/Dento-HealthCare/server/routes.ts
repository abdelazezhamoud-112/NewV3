import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
import { 
  users, 
  patients, 
  doctors, 
  appointments, 
  clinics, 
  treatments, 
  reports,
  treatmentPlans,
  insertUserSchema,
  insertPatientSchema,
  insertDoctorSchema,
  insertAppointmentSchema,
  insertClinicSchema,
  insertTreatmentSchema,
  insertReportSchema,
  insertTreatmentPlanSchema
} from "../shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import OpenAI from "openai";

const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get('/api/users', async (_req, res) => {
    try {
      const allUsers = await db.query.users.findMany();
      res.json(allUsers);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/api/users/:id', async (req, res) => {
    try {
      const user = await db.query.users.findFirst({
        where: eq(users.id, req.params.id),
      });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post('/api/users', async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const [user] = await db.insert(users).values(validatedData).returning();
      res.status(201).json(user);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.put('/api/users/:id', async (req, res) => {
    try {
      const validatedData = insertUserSchema.partial().parse(req.body);
      const [user] = await db.update(users)
        .set(validatedData)
        .where(eq(users.id, req.params.id))
        .returning();
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.delete('/api/users/:id', async (req, res) => {
    try {
      const [user] = await db.delete(users)
        .where(eq(users.id, req.params.id))
        .returning();
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // Authentication routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { username, password, fullName, email, phone, userType } = req.body;
      
      // Check if username already exists
      const existingUsers = await db.select().from(users).where(eq(users.username, username)).limit(1);
      
      if (existingUsers.length > 0) {
        return res.status(400).json({ message: 'اسم المستخدم موجود بالفعل' });
      }
      
      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      // Create user
      const [newUser] = await db.insert(users).values({
        username,
        password: hashedPassword,
        fullName,
        email: email || null,
        phone: phone || null,
        userType: userType || 'patient',
      }).returning();
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = newUser;
      res.status(201).json(userWithoutPassword);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Find user by username using select instead of query
      const foundUsers = await db.select().from(users).where(eq(users.username, username)).limit(1);
      
      if (foundUsers.length === 0) {
        return res.status(401).json({ message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
      }
      
      const user = foundUsers[0];
      
      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        return res.status(401).json({ message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
      }
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // Clinic routes
  app.get('/api/clinics', async (_req, res) => {
    try {
      const allClinics = await db.query.clinics.findMany();
      res.json(allClinics);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/api/clinics/:id', async (req, res) => {
    try {
      const clinic = await db.query.clinics.findFirst({
        where: eq(clinics.id, req.params.id),
      });
      if (!clinic) {
        return res.status(404).json({ message: 'Clinic not found' });
      }
      res.json(clinic);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post('/api/clinics', async (req, res) => {
    try {
      const validatedData = insertClinicSchema.parse(req.body);
      const [clinic] = await db.insert(clinics).values(validatedData).returning();
      res.status(201).json(clinic);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.put('/api/clinics/:id', async (req, res) => {
    try {
      const validatedData = insertClinicSchema.partial().parse(req.body);
      const [clinic] = await db.update(clinics)
        .set(validatedData)
        .where(eq(clinics.id, req.params.id))
        .returning();
      if (!clinic) {
        return res.status(404).json({ message: 'Clinic not found' });
      }
      res.json(clinic);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.delete('/api/clinics/:id', async (req, res) => {
    try {
      const [clinic] = await db.delete(clinics)
        .where(eq(clinics.id, req.params.id))
        .returning();
      if (!clinic) {
        return res.status(404).json({ message: 'Clinic not found' });
      }
      res.json(clinic);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // Patient routes
  app.get('/api/patients', async (_req, res) => {
    try {
      const allPatients = await db.query.patients.findMany();
      res.json(allPatients);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/api/patients/:id', async (req, res) => {
    try {
      const patient = await db.query.patients.findFirst({
        where: eq(patients.id, req.params.id),
      });
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
      res.json(patient);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post('/api/patients', async (req, res) => {
    try {
      const validatedData = insertPatientSchema.parse(req.body);
      const [patient] = await db.insert(patients).values(validatedData).returning();
      res.status(201).json(patient);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.put('/api/patients/:id', async (req, res) => {
    try {
      const validatedData = insertPatientSchema.partial().parse(req.body);
      const [patient] = await db.update(patients)
        .set(validatedData)
        .where(eq(patients.id, req.params.id))
        .returning();
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
      res.json(patient);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.delete('/api/patients/:id', async (req, res) => {
    try {
      const [patient] = await db.delete(patients)
        .where(eq(patients.id, req.params.id))
        .returning();
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
      res.json(patient);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // Doctor routes
  app.get('/api/doctors', async (_req, res) => {
    try {
      const allDoctors = await db.query.doctors.findMany();
      res.json(allDoctors);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/api/doctors/:id', async (req, res) => {
    try {
      const doctor = await db.query.doctors.findFirst({
        where: eq(doctors.id, req.params.id),
      });
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
      res.json(doctor);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post('/api/doctors', async (req, res) => {
    try {
      const validatedData = insertDoctorSchema.parse(req.body);
      const [doctor] = await db.insert(doctors).values(validatedData).returning();
      res.status(201).json(doctor);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.put('/api/doctors/:id', async (req, res) => {
    try {
      const validatedData = insertDoctorSchema.partial().parse(req.body);
      const [doctor] = await db.update(doctors)
        .set(validatedData)
        .where(eq(doctors.id, req.params.id))
        .returning();
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
      res.json(doctor);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.delete('/api/doctors/:id', async (req, res) => {
    try {
      const [doctor] = await db.delete(doctors)
        .where(eq(doctors.id, req.params.id))
        .returning();
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
      res.json(doctor);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // Appointment routes with populated patient and doctor data
  app.get('/api/appointments', async (_req, res) => {
    try {
      const allAppointments = await db.query.appointments.findMany({
        with: {
          patient: true,
          doctor: true,
        },
      });
      res.json(allAppointments);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/api/appointments/:id', async (req, res) => {
    try {
      const appointment = await db.query.appointments.findFirst({
        where: eq(appointments.id, req.params.id),
        with: {
          patient: true,
          doctor: true,
        },
      });
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
      res.json(appointment);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post('/api/appointments', async (req, res) => {
    try {
      const validatedData = insertAppointmentSchema.parse(req.body);
      const [appointment] = await db.insert(appointments).values(validatedData).returning();
      res.status(201).json(appointment);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.put('/api/appointments/:id', async (req, res) => {
    try {
      const validatedData = insertAppointmentSchema.partial().parse(req.body);
      await db.update(appointments)
        .set(validatedData)
        .where(eq(appointments.id, req.params.id));
      
      const appointment = await db.query.appointments.findFirst({
        where: eq(appointments.id, req.params.id),
        with: {
          patient: true,
          doctor: true,
        },
      });
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
      res.json(appointment);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.delete('/api/appointments/:id', async (req, res) => {
    try {
      const [appointment] = await db.delete(appointments)
        .where(eq(appointments.id, req.params.id))
        .returning();
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
      res.json(appointment);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // Treatment routes with populated patient and doctor data
  app.get('/api/treatments', async (_req, res) => {
    try {
      const allTreatments = await db.query.treatments.findMany({
        with: {
          patient: true,
          doctor: true,
        },
      });
      res.json(allTreatments);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/api/treatments/:id', async (req, res) => {
    try {
      const treatment = await db.query.treatments.findFirst({
        where: eq(treatments.id, req.params.id),
        with: {
          patient: true,
          doctor: true,
        },
      });
      if (!treatment) {
        return res.status(404).json({ message: 'Treatment not found' });
      }
      res.json(treatment);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post('/api/treatments', async (req, res) => {
    try {
      const validatedData = insertTreatmentSchema.parse(req.body);
      const [treatment] = await db.insert(treatments).values(validatedData).returning();
      res.status(201).json(treatment);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.put('/api/treatments/:id', async (req, res) => {
    try {
      const validatedData = insertTreatmentSchema.partial().parse(req.body);
      await db.update(treatments)
        .set(validatedData)
        .where(eq(treatments.id, req.params.id));
      
      const treatment = await db.query.treatments.findFirst({
        where: eq(treatments.id, req.params.id),
        with: {
          patient: true,
          doctor: true,
        },
      });
      if (!treatment) {
        return res.status(404).json({ message: 'Treatment not found' });
      }
      res.json(treatment);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.delete('/api/treatments/:id', async (req, res) => {
    try {
      const [treatment] = await db.delete(treatments)
        .where(eq(treatments.id, req.params.id))
        .returning();
      if (!treatment) {
        return res.status(404).json({ message: 'Treatment not found' });
      }
      res.json(treatment);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // Treatment Plan routes with populated patient and clinic data
  app.get('/api/treatment-plans', async (_req, res) => {
    try {
      const allTreatmentPlans = await db.query.treatmentPlans.findMany({
        with: {
          patient: true,
          clinic: true,
        },
      });
      res.json(allTreatmentPlans);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/api/treatment-plans/:id', async (req, res) => {
    try {
      const treatmentPlan = await db.query.treatmentPlans.findFirst({
        where: eq(treatmentPlans.id, req.params.id),
        with: {
          patient: true,
          clinic: true,
        },
      });
      if (!treatmentPlan) {
        return res.status(404).json({ message: 'Treatment plan not found' });
      }
      res.json(treatmentPlan);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post('/api/treatment-plans', async (req, res) => {
    try {
      const validatedData = insertTreatmentPlanSchema.parse(req.body);
      const [treatmentPlan] = await db.insert(treatmentPlans).values(validatedData).returning();
      res.status(201).json(treatmentPlan);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.put('/api/treatment-plans/:id', async (req, res) => {
    try {
      const validatedData = insertTreatmentPlanSchema.partial().parse(req.body);
      await db.update(treatmentPlans)
        .set(validatedData)
        .where(eq(treatmentPlans.id, req.params.id));
      
      const treatmentPlan = await db.query.treatmentPlans.findFirst({
        where: eq(treatmentPlans.id, req.params.id),
        with: {
          patient: true,
          clinic: true,
        },
      });
      if (!treatmentPlan) {
        return res.status(404).json({ message: 'Treatment plan not found' });
      }
      res.json(treatmentPlan);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.delete('/api/treatment-plans/:id', async (req, res) => {
    try {
      const [treatmentPlan] = await db.delete(treatmentPlans)
        .where(eq(treatmentPlans.id, req.params.id))
        .returning();
      if (!treatmentPlan) {
        return res.status(404).json({ message: 'Treatment plan not found' });
      }
      res.json(treatmentPlan);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // Report routes with populated patient, clinic and createdBy user data
  app.get('/api/reports', async (_req, res) => {
    try {
      const allReports = await db.query.reports.findMany({
        with: {
          patient: true,
          clinic: true,
          createdBy: true,
        },
      });
      res.json(allReports);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/api/reports/:id', async (req, res) => {
    try {
      const report = await db.query.reports.findFirst({
        where: eq(reports.id, req.params.id),
        with: {
          patient: true,
          clinic: true,
          createdBy: true,
        },
      });
      if (!report) {
        return res.status(404).json({ message: 'Report not found' });
      }
      res.json(report);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post('/api/reports', async (req, res) => {
    try {
      const validatedData = insertReportSchema.parse(req.body);
      const [report] = await db.insert(reports).values(validatedData).returning();
      res.status(201).json(report);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.put('/api/reports/:id', async (req, res) => {
    try {
      const validatedData = insertReportSchema.partial().parse(req.body);
      await db.update(reports)
        .set(validatedData)
        .where(eq(reports.id, req.params.id));
      
      const report = await db.query.reports.findFirst({
        where: eq(reports.id, req.params.id),
        with: {
          patient: true,
          clinic: true,
          createdBy: true,
        },
      });
      if (!report) {
        return res.status(404).json({ message: 'Report not found' });
      }
      res.json(report);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.delete('/api/reports/:id', async (req, res) => {
    try {
      const [report] = await db.delete(reports)
        .where(eq(reports.id, req.params.id))
        .returning();
      if (!report) {
        return res.status(404).json({ message: 'Report not found' });
      }
      res.json(report);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // AI Diagnosis endpoint
  app.post('/api/ai/diagnosis', async (req, res) => {
    try {
      const { answers, xrayImage, language } = req.body;
      
      if (!openai) {
        return res.status(503).json({ 
          message: 'AI service not available. Please configure OPENAI_API_KEY.',
          fallback: true
        });
      }
      
      const symptomDescription = Object.entries(answers)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');
      
      const messages: any[] = [
        {
          role: "system",
          content: `You are a dental diagnosis AI assistant. Analyze the patient's symptoms and provide a preliminary diagnosis. 
          Response must be JSON with this structure:
          {
            "conditions": [{"name": string, "nameEn": string, "conditionKey": string, "probability": number, "description": string}],
            "recommendations": [string],
            "urgency": "high" | "medium" | "low",
            "confidence": number,
            "suggestedClinic": {"id": string, "name": string, "nameAr": string, "nameEn": string},
            "estimatedTreatmentTime": string
          }
          Use Arabic for name and description if language is 'ar', English if 'en'.
          conditionKey must be one of: dental_caries, gingivitis, tooth_sensitivity, root_canal, extraction, orthodontic, cosmetic, implant, pediatric, periodontitis, dentures, crowns`
        },
        {
          role: "user",
          content: `Patient symptoms:\n${symptomDescription}\nLanguage: ${language || 'ar'}`
        }
      ];

      if (xrayImage) {
        messages[1].content = [
          { type: "text", text: `Patient symptoms:\n${symptomDescription}\nLanguage: ${language || 'ar'}\nPlease also analyze the attached dental X-ray image.` },
          { type: "image_url", image_url: { url: xrayImage } }
        ];
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages,
        response_format: { type: "json_object" },
        max_tokens: 2048
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      res.json(result);
    } catch (err: any) {
      console.error('AI Diagnosis error:', err);
      res.status(500).json({ message: err.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
