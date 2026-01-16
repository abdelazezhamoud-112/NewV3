import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import bcrypt from "bcrypt";
import OpenAI from "openai";
import { storage } from "./storage";

const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

declare module 'express-session' {
  interface SessionData {
    userId?: string;
    userType?: string;
  }
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.userId) {
    return res.status(401).json({ message: 'غير مسموح - يرجى تسجيل الدخول' });
  }
  next();
}

function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: 'غير مسموح - يرجى تسجيل الدخول' });
    }
    if (!roles.includes(req.session.userType || '')) {
      return res.status(403).json({ message: 'لا تملك صلاحية للوصول لهذه الصفحة' });
    }
    next();
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { username, password, fullName, email, phone, userType } = req.body;
      
      const existingUser = await storage.getUserByUsername(username);
      
      if (existingUser) {
        return res.status(400).json({ message: 'اسم المستخدم موجود بالفعل' });
      }
      
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      const newUser = await storage.createUser({
        username,
        password: hashedPassword,
        fullName,
        email: email || null,
        phone: phone || null,
        userType: userType || 'patient',
      });
      
      req.session.userId = newUser.id;
      req.session.userType = newUser.userType;
      
      const { password: _, ...userWithoutPassword } = newUser;
      res.status(201).json(userWithoutPassword);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return res.status(401).json({ message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
      }
      
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        return res.status(401).json({ message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
      }
      
      req.session.userId = user.id;
      req.session.userType = user.userType;
      
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'خطأ في تسجيل الخروج' });
      }
      res.json({ message: 'تم تسجيل الخروج بنجاح' });
    });
  });

  app.get('/api/auth/me', async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: 'غير مسجل الدخول' });
    }
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  app.get('/api/clinics', async (_req, res) => {
    try {
      const allClinics = await storage.getClinics();
      res.json(allClinics);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/api/clinics/:id', async (req, res) => {
    try {
      const clinic = await storage.getClinic(req.params.id);
      if (!clinic) {
        return res.status(404).json({ message: 'العيادة غير موجودة' });
      }
      res.json(clinic);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post('/api/clinics', requireRole('doctor', 'graduate'), async (req, res) => {
    try {
      const clinic = await storage.createClinic(req.body);
      res.status(201).json(clinic);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.get('/api/doctors', async (_req, res) => {
    try {
      const allDoctors = await storage.getDoctors();
      res.json(allDoctors);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/api/doctors/:id', async (req, res) => {
    try {
      const doctor = await storage.getDoctor(req.params.id);
      if (!doctor) {
        return res.status(404).json({ message: 'الطبيب غير موجود' });
      }
      res.json(doctor);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post('/api/doctors', requireRole('doctor', 'graduate'), async (req, res) => {
    try {
      const doctor = await storage.createDoctor(req.body);
      res.status(201).json(doctor);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.get('/api/patients', requireAuth, async (req, res) => {
    try {
      const allPatients = await storage.getPatients();
      res.json(allPatients);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/api/patients/:id', requireAuth, async (req, res) => {
    try {
      const patient = await storage.getPatient(req.params.id);
      if (!patient) {
        return res.status(404).json({ message: 'المريض غير موجود' });
      }
      res.json(patient);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/api/patients/user/:userId', requireAuth, async (req, res) => {
    try {
      const patient = await storage.getPatientByUserId(req.params.userId);
      if (!patient) {
        return res.status(404).json({ message: 'المريض غير موجود' });
      }
      res.json(patient);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post('/api/patients', requireAuth, async (req, res) => {
    try {
      const patient = await storage.createPatient(req.body);
      res.status(201).json(patient);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.get('/api/appointments', requireAuth, async (req, res) => {
    try {
      if (req.session.userType === 'patient') {
        const appointments = await storage.getAppointmentsByPatient(req.session.userId!);
        return res.json(appointments);
      }
      if (['doctor', 'student', 'graduate'].includes(req.session.userType || '')) {
        const appointments = await storage.getAppointmentsByDoctor(req.session.userId!);
        return res.json(appointments);
      }
      const allAppointments = await storage.getAppointments();
      res.json(allAppointments);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/api/appointments/:id', requireAuth, async (req, res) => {
    try {
      const appointment = await storage.getAppointment(req.params.id);
      if (!appointment) {
        return res.status(404).json({ message: 'الموعد غير موجود' });
      }
      if (req.session.userType === 'patient' && appointment.patientId !== req.session.userId) {
        return res.status(403).json({ message: 'غير مصرح لك بعرض هذا الموعد' });
      }
      if (['doctor', 'student', 'graduate'].includes(req.session.userType || '') && 
          appointment.doctorId !== req.session.userId) {
        return res.status(403).json({ message: 'غير مصرح لك بعرض هذا الموعد' });
      }
      res.json(appointment);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/api/appointments/patient/:patientId', requireAuth, async (req, res) => {
    try {
      if (req.session.userType === 'patient' && req.params.patientId !== req.session.userId) {
        return res.status(403).json({ message: 'غير مصرح لك بعرض مواعيد مريض آخر' });
      }
      const appointments = await storage.getAppointmentsByPatient(req.params.patientId);
      res.json(appointments);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/api/appointments/doctor/:doctorId', requireRole('doctor', 'student', 'graduate'), async (req, res) => {
    try {
      if (req.params.doctorId !== req.session.userId) {
        return res.status(403).json({ message: 'غير مصرح لك بعرض مواعيد طبيب آخر' });
      }
      const appointments = await storage.getAppointmentsByDoctor(req.params.doctorId);
      res.json(appointments);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/api/doctor/today-appointments', requireRole('doctor', 'student', 'graduate'), async (req, res) => {
    try {
      const doctorId = req.session.userId!;
      const today = new Date().toISOString().split('T')[0];
      const appointments = await storage.getAppointmentsByDoctorAndDate(doctorId, today);
      res.json(appointments);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post('/api/appointments', requireAuth, async (req, res) => {
    try {
      const appointment = await storage.createAppointment(req.body);
      res.status(201).json(appointment);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.put('/api/appointments/:id', requireAuth, async (req, res) => {
    try {
      const existingAppointment = await storage.getAppointment(req.params.id);
      if (!existingAppointment) {
        return res.status(404).json({ message: 'الموعد غير موجود' });
      }
      if (req.session.userType === 'patient' && existingAppointment.patientId !== req.session.userId) {
        return res.status(403).json({ message: 'غير مصرح لك بتعديل هذا الموعد' });
      }
      if (['doctor', 'student', 'graduate'].includes(req.session.userType || '') && 
          existingAppointment.doctorId !== req.session.userId) {
        return res.status(403).json({ message: 'غير مصرح لك بتعديل هذا الموعد' });
      }
      const appointment = await storage.updateAppointment(req.params.id, req.body);
      res.json(appointment);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.get('/api/visit-sessions', requireRole('doctor', 'student', 'graduate'), async (_req, res) => {
    try {
      const sessions = await storage.getVisitSessions();
      res.json(sessions);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/api/visit-sessions/patient/:patientId', requireAuth, async (req, res) => {
    try {
      if (req.session.userType === 'patient' && req.params.patientId !== req.session.userId) {
        return res.status(403).json({ message: 'غير مصرح لك بعرض جلسات مريض آخر' });
      }
      const sessions = await storage.getVisitSessionsByPatient(req.params.patientId);
      res.json(sessions);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post('/api/visit-sessions', requireRole('doctor', 'graduate'), async (req, res) => {
    try {
      const session = await storage.createVisitSession(req.body);
      res.status(201).json(session);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.post('/api/visit-sessions/:id/attend', requireRole('doctor', 'graduate', 'student'), async (req, res) => {
    try {
      const existingSession = await storage.getVisitSession(req.params.id);
      if (!existingSession) {
        return res.status(404).json({ message: 'الجلسة غير موجودة' });
      }
      if (existingSession.doctorId !== req.session.userId) {
        return res.status(403).json({ message: 'غير مصرح لك بتعديل هذه الجلسة' });
      }
      const session = await storage.updateVisitSession(req.params.id, { 
        attendanceStatus: 'attended' 
      });
      res.json(session);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.post('/api/appointments/:id/mark-attended', requireRole('doctor', 'graduate', 'student'), async (req, res) => {
    try {
      const appointment = await storage.getAppointment(req.params.id);
      if (!appointment) {
        return res.status(404).json({ message: 'الموعد غير موجود' });
      }
      
      if (appointment.doctorId !== req.session.userId) {
        return res.status(403).json({ message: 'غير مصرح لك بتأكيد حضور هذا الموعد' });
      }
      
      if (appointment.status === 'completed') {
        return res.status(400).json({ message: 'تم تأكيد حضور هذا الموعد مسبقاً' });
      }
      
      const clinicId = req.body.clinicId;
      if (!clinicId) {
        return res.status(400).json({ message: 'يرجى تحديد العيادة' });
      }
      
      const clinic = await storage.getClinic(clinicId);
      if (!clinic) {
        return res.status(400).json({ message: 'العيادة المحددة غير موجودة' });
      }
      
      const clinicPrice = await storage.getClinicPrice(clinicId);
      const sessionPrice = clinicPrice?.sessionPrice || "500";
      
      const session = await storage.createVisitSession({
        appointmentId: appointment.id,
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        clinicId: clinicId,
        sessionDate: appointment.date,
        attendanceStatus: 'attended',
        price: sessionPrice,
        notes: req.body.notes || null,
      });
      
      await storage.updateAppointment(req.params.id, { status: 'completed' });
      
      res.json({ appointment, session });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.get('/api/payments', requireRole('doctor', 'student', 'graduate'), async (_req, res) => {
    try {
      const allPayments = await storage.getPayments();
      res.json(allPayments);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/api/payments/patient/:patientId', requireAuth, async (req, res) => {
    try {
      if (req.session.userType === 'patient' && req.params.patientId !== req.session.userId) {
        return res.status(403).json({ message: 'غير مصرح لك بعرض مدفوعات مريض آخر' });
      }
      const payments = await storage.getPaymentsByPatient(req.params.patientId);
      res.json(payments);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post('/api/payments', requireRole('doctor', 'student', 'graduate'), async (req, res) => {
    try {
      const payment = await storage.createPayment(req.body);
      res.status(201).json(payment);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.get('/api/patient/:patientId/balance', requireAuth, async (req, res) => {
    try {
      if (req.session.userType === 'patient' && req.params.patientId !== req.session.userId) {
        return res.status(403).json({ message: 'غير مصرح لك بعرض رصيد مريض آخر' });
      }
      const balance = await storage.getPatientBalance(req.params.patientId);
      res.json(balance);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/api/clinic-prices', requireAuth, async (_req, res) => {
    try {
      const prices = await storage.getClinicPrices();
      res.json(prices);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/api/clinic-prices/:clinicId', requireAuth, async (req, res) => {
    try {
      const price = await storage.getClinicPrice(req.params.clinicId);
      res.json(price || { sessionPrice: "500" });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.put('/api/clinic-prices/:clinicId', requireRole('doctor'), async (req, res) => {
    try {
      const price = await storage.upsertClinicPrice({
        clinicId: req.params.clinicId,
        sessionPrice: req.body.sessionPrice,
        updatedBy: req.session?.userId || null,
      });
      res.json(price);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

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

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error('No response from AI');
      }

      const diagnosis = JSON.parse(content);
      res.json(diagnosis);
    } catch (err: any) {
      console.error('AI Diagnosis error:', err);
      res.status(500).json({ message: err.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
