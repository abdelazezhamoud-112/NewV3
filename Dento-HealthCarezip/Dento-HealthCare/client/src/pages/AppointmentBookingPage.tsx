import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, User, MapPin, Phone, Check, X } from "lucide-react";

interface Appointment {
  id: string;
  doctorName: string;
  clinic: string;
  date: string;
  time: string;
  duration: number;
  status: "confirmed" | "pending" | "cancelled";
  notes?: string;
  consultationFee: number;
  reminderEnabled: boolean;
}

export default function AppointmentBookingPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      doctorName: "د. محمد أحمد",
      clinic: "التشخيص والأشعة",
      date: "2025-11-25",
      time: "10:00 AM",
      duration: 30,
      status: "confirmed",
      notes: "فحص شامل",
      consultationFee: 250,
      reminderEnabled: true
    },
    {
      id: "2",
      doctorName: "د. فاطمة علي",
      clinic: "العلاج التحفظي",
      date: "2025-11-28",
      time: "2:00 PM",
      duration: 45,
      status: "pending",
      notes: "حشو الضرس",
      consultationFee: 300,
      reminderEnabled: true
    },
    {
      id: "3",
      doctorName: "د. سارة حسن",
      clinic: "تجميل الأسنان",
      date: "2025-12-02",
      time: "11:00 AM",
      duration: 60,
      status: "confirmed",
      notes: "جلسة تبييض",
      consultationFee: 400,
      reminderEnabled: false
    }
  ]);

  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedClinic, setSelectedClinic] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [duration, setDuration] = useState(30);
  const [notes, setNotes] = useState("");
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  const doctors = [
    { id: "1", name: "د. محمد أحمد", clinic: "التشخيص والأشعة", specialization: "تشخيص وأشعة", availability: "09:00-17:00" },
    { id: "2", name: "د. فاطمة علي", clinic: "العلاج التحفظي", specialization: "علاج تحفظي", availability: "10:00-18:00" },
    { id: "3", name: "د. سارة حسن", clinic: "تجميل الأسنان", specialization: "تجميل وتبييض", availability: "09:00-17:00" },
    { id: "4", name: "د. علي محمود", clinic: "جراحة الفم والفكين", specialization: "جراحة", availability: "11:00-19:00" },
  ];

  const getDoctorAvailability = (doctorId: string) => {
    const doctor = doctors.find(d => d.id === doctorId);
    return doctor ? doctor.availability : "غير متاح";
  };

  const handleBookAppointment = () => {
    if (!selectedDoctor || !appointmentDate || !appointmentTime) {
      alert("الرجاء ملء جميع الحقول المطلوبة");
      return;
    }

    const doctor = doctors.find(d => d.id === selectedDoctor);
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      doctorName: doctor?.name || "",
      clinic: doctor?.clinic || "",
      date: appointmentDate,
      time: appointmentTime,
      duration,
      status: "pending",
      notes,
      consultationFee: 250,
      reminderEnabled
    };

    setAppointments([...appointments, newAppointment]);
    setSelectedDoctor("");
    setAppointmentDate("");
    setAppointmentTime("");
    setDuration(30);
    setNotes("");
    setReminderEnabled(true);
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments(appointments.map(apt =>
      apt.id === id ? { ...apt, status: "cancelled" as const } : apt
    ));
  };

  const filteredAppointments = appointments.filter(apt =>
    filterStatus === "all" ? true : apt.status === filterStatus
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return { variant: "default" as const, label: "✓ مؤكد" };
      case "pending":
        return { variant: "secondary" as const, label: "⏳ قيد الانتظار" };
      case "cancelled":
        return { variant: "destructive" as const, label: "✕ ملغي" };
      default:
        return { variant: "outline" as const, label: "معروف" };
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">📅 حجز المواعيد</h1>
        <p className="text-muted-foreground text-lg">احجز موعدك مع أفضل الأطباء في المستشفى</p>
      </div>

      <Tabs defaultValue="book" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="book">حجز موعد جديد</TabsTrigger>
          <TabsTrigger value="appointments">مواعيدي</TabsTrigger>
        </TabsList>

        {/* Book Appointment */}
        <TabsContent value="book" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>احجز موعدك الآن</CardTitle>
              <CardDescription>اختر الطبيب والتاريخ والوقت</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-semibold mb-2 block">اختر الطبيب</label>
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-full p-3 border rounded-lg bg-background"
                  data-testid="select-doctor"
                >
                  <option value="">-- اختر طبيب --</option>
                  {doctors.map(doctor => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialization}
                    </option>
                  ))}
                </select>
              </div>

              {selectedDoctor && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm">
                    <strong>العيادة:</strong> {doctors.find(d => d.id === selectedDoctor)?.clinic}
                  </p>
                </div>
              )}

              {selectedDoctor && (
                <>
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg text-sm">
                    <p className="font-semibold mb-1">ساعات العمل المتاحة:</p>
                    <p className="text-primary font-medium">{getDoctorAvailability(selectedDoctor)}</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg text-sm border border-green-200 dark:border-green-800">
                    <p className="font-semibold mb-1">الرسوم المستحقة:</p>
                    <p className="text-lg font-bold text-green-700 dark:text-green-400">250 ج.م</p>
                    <p className="text-xs text-muted-foreground mt-1">يمكنك الدفع عند الوصول أو قبل الموعد</p>
                  </div>
                </>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold mb-2 block">📅 التاريخ</label>
                  <Input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full"
                    data-testid="input-appointment-date"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">⏰ الوقت</label>
                  <Input
                    type="time"
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    className="w-full"
                    data-testid="input-appointment-time"
                  />
                  {selectedDoctor && appointmentTime && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">✓ الموعد متاح</p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block">🏥 نوع الحجز</label>
                <div className="grid gap-2 grid-cols-2">
                  <button className="p-3 border rounded-lg hover-elevate bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700">
                    <p className="font-semibold text-sm">موعد محدد</p>
                    <p className="text-xs text-muted-foreground">احجز موعد محدد</p>
                  </button>
                  <button className="p-3 border rounded-lg hover-elevate border-gray-200">
                    <p className="font-semibold text-sm">بدون موعد</p>
                    <p className="text-xs text-muted-foreground">حضور مباشر</p>
                  </button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold mb-2 block">⏱️ المدة المتوقعة (دقيقة)</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full p-2 border rounded-lg bg-background"
                    data-testid="select-duration"
                  >
                    <option value="15">15 دقيقة</option>
                    <option value="30">30 دقيقة</option>
                    <option value="45">45 دقيقة</option>
                    <option value="60">60 دقيقة</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={reminderEnabled}
                      onChange={(e) => setReminderEnabled(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-semibold">تفعيل التذكير</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block">📝 ملاحظات</label>
                <Textarea
                  placeholder="أضف أي ملاحظات أو أعراض..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full"
                  data-testid="textarea-appointment-notes"
                />
              </div>

              <Button
                onClick={handleBookAppointment}
                className="w-full gap-2"
                data-testid="button-book-appointment"
              >
                <Check className="h-4 w-4" />
                تأكيد الحجز
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Appointments */}
        <TabsContent value="appointments" className="mt-6 space-y-4">
          {/* Filter Buttons */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("all")}
              data-testid="button-filter-all"
            >
              الكل ({appointments.length})
            </Button>
            <Button
              variant={filterStatus === "confirmed" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("confirmed")}
              data-testid="button-filter-confirmed"
            >
              مؤكد ({appointments.filter(a => a.status === "confirmed").length})
            </Button>
            <Button
              variant={filterStatus === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("pending")}
              data-testid="button-filter-pending"
            >
              قيد الانتظار ({appointments.filter(a => a.status === "pending").length})
            </Button>
          </div>

          {filteredAppointments.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">لا توجد مواعيد في هذه الحالة</p>
              </CardContent>
            </Card>
          ) : (
            filteredAppointments.map(apt => (
              <Card 
                key={apt.id} 
                className={`${apt.status === "cancelled" ? "opacity-60" : ""}`}
                role="article"
                aria-label={`موعد مع ${apt.doctorName} في ${apt.clinic}`}
              >
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-primary" />
                          <span className="font-semibold">{apt.doctorName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {apt.clinic}
                        </div>
                        <div className="grid gap-3 text-sm">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {apt.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {apt.time}
                            </div>
                            <div className="text-xs bg-muted px-2 py-1 rounded">
                              {apt.duration} دقيقة | انتظار: ~10 دقائق
                            </div>
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-primary">
                          الرسوم: {apt.consultationFee} ج.م
                        </div>
                        {apt.notes && (
                          <div className="text-sm text-muted-foreground">
                            <strong>ملاحظات:</strong> {apt.notes}
                          </div>
                        )}
                        {apt.reminderEnabled && (
                          <div className="text-xs text-blue-600 dark:text-blue-400">✓ التذكير مفعل</div>
                        )}
                      </div>
                      <Badge 
                        variant={getStatusColor(apt.status).variant} 
                        className={`status-badge px-3 py-1 text-xs font-medium ${apt.status === "pending" ? "status-pending" : ""}`}
                        aria-label={`حالة الموعد: ${getStatusColor(apt.status).label}`}
                      >
                        {getStatusColor(apt.status).label}
                      </Badge>
                    </div>

                    {apt.status !== "cancelled" && (
                      <div className="flex gap-2 pt-2 border-t">
                        <Button variant="outline" size="sm" data-testid={`button-reschedule-${apt.id}`}>
                          إعادة جدولة
                        </Button>
                        {apt.status === "pending" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelAppointment(apt.id)}
                            className="text-red-600"
                            data-testid={`button-cancel-${apt.id}`}
                          >
                            إلغاء الموعد
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
