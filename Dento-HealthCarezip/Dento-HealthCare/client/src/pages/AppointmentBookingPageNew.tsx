import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, User, MapPin, DollarSign, Check, AlertCircle, Smartphone } from "lucide-react";

interface Appointment {
  id: string;
  doctorName: string;
  clinic: string;
  date: string;
  time: string;
  duration: number;
  status: "confirmed" | "pending" | "cancelled";
  consultationFee: number;
  reminderEnabled: boolean;
}

interface Doctor {
  id: string;
  name: string;
  clinic: string;
  specialization: string;
  rating: number;
  availability: string;
  consultationFee: number;
}

export default function AppointmentBookingPageNew() {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      doctorName: "د. محمد أحمد",
      clinic: "التشخيص والأشعة",
      date: "2025-11-25",
      time: "10:00 AM",
      duration: 30,
      status: "confirmed",
      consultationFee: 250,
      reminderEnabled: true,
    },
    {
      id: "2",
      doctorName: "د. فاطمة علي",
      clinic: "العلاج التحفظي",
      date: "2025-11-28",
      time: "2:00 PM",
      duration: 45,
      status: "pending",
      consultationFee: 300,
      reminderEnabled: true,
    },
  ]);

  const doctors: Doctor[] = [
    {
      id: "1",
      name: "د. محمد أحمد",
      clinic: "التشخيص والأشعة",
      specialization: "تشخيص وأشعة",
      rating: 4.8,
      availability: "09:00-17:00",
      consultationFee: 250,
    },
    {
      id: "2",
      name: "د. فاطمة علي",
      clinic: "العلاج التحفظي",
      specialization: "علاج تحفظي",
      rating: 4.6,
      availability: "10:00-18:00",
      consultationFee: 300,
    },
    {
      id: "3",
      name: "د. سارة حسن",
      clinic: "تجميل الأسنان",
      specialization: "تجميل وتبييض",
      rating: 4.9,
      availability: "09:00-17:00",
      consultationFee: 400,
    },
    {
      id: "4",
      name: "د. علي محمود",
      clinic: "جراحة الفم والفكين",
      specialization: "جراحة",
      rating: 4.7,
      availability: "11:00-19:00",
      consultationFee: 500,
    },
  ];

  const timeSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
  ];

  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [duration, setDuration] = useState("30");
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [showBookingForm, setShowBookingForm] = useState(false);

  const handleBookAppointment = () => {
    if (!selectedDoctor || !appointmentDate || !appointmentTime) {
      alert("الرجاء ملء جميع الحقول المطلوبة");
      return;
    }

    const doctor = doctors.find((d) => d.id === selectedDoctor);
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      doctorName: doctor?.name || "",
      clinic: doctor?.clinic || "",
      date: appointmentDate,
      time: appointmentTime,
      duration: parseInt(duration),
      status: "pending",
      consultationFee: doctor?.consultationFee || 250,
      reminderEnabled,
    };

    setAppointments([...appointments, newAppointment]);
    setSelectedDoctor("");
    setAppointmentDate("");
    setAppointmentTime("");
    setDuration("30");
    setReminderEnabled(true);
    setShowBookingForm(false);

    alert("تم حجز الموعد بنجاح! سيتم تأكيده قريباً.");
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments(
      appointments.map((apt) =>
        apt.id === id ? { ...apt, status: "cancelled" as const } : apt
      )
    );
  };

  const filteredAppointments = appointments.filter((apt) =>
    filterStatus === "all" ? true : apt.status === filterStatus
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200";
      case "cancelled":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200";
      default:
        return "bg-gray-100 dark:bg-gray-900/30";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed":
        return "✓ مؤكد";
      case "pending":
        return "⏳ قيد الانتظار";
      case "cancelled":
        return "✕ ملغي";
      default:
        return status;
    }
  };

  const selectedDoctorData = doctors.find((d) => d.id === selectedDoctor);
  const estimatedFee = selectedDoctorData?.consultationFee || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">حجز المواعيد</h1>
        <p className="text-muted-foreground text-lg">
          احجز موعداً مع أفضل الأطباء المتخصصين
        </p>
      </div>

      <Tabs defaultValue="booking" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="booking">الحجز الجديد</TabsTrigger>
          <TabsTrigger value="appointments">مواعيدي ({filteredAppointments.length})</TabsTrigger>
        </TabsList>

        {/* Booking Tab */}
        <TabsContent value="booking" className="mt-6 space-y-6">
          {!showBookingForm ? (
            <div className="grid gap-4">
              <Button
                size="lg"
                className="w-full h-auto py-6 text-lg gap-3"
                onClick={() => setShowBookingForm(true)}
                data-testid="button-new-booking"
              >
                <Calendar className="h-6 w-6" />
                حجز موعد جديد
              </Button>
            </div>
          ) : (
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle>خطوات حجز الموعد</CardTitle>
                <CardDescription>
                  اختر الطبيب والتاريخ والوقت المناسب لك
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1: Select Doctor */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold">
                    1️⃣ اختر الطبيب
                  </label>
                  <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                    <SelectTrigger data-testid="select-doctor">
                      <SelectValue placeholder="اختر الطبيب المتخصص" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          <div className="flex items-center gap-2">
                            <span>{doctor.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {doctor.rating}⭐
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Doctor Info Card */}
                {selectedDoctorData && (
                  <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{selectedDoctorData.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedDoctorData.specialization}
                          </p>
                        </div>
                        <Badge>{selectedDoctorData.rating}⭐</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm pt-2 border-t">
                        <div>
                          <p className="text-xs text-muted-foreground">العيادة</p>
                          <p className="font-semibold">{selectedDoctorData.clinic}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">الأوقات</p>
                          <p className="font-semibold">
                            {selectedDoctorData.availability}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">الرسم</p>
                          <p className="font-semibold text-primary">
                            {selectedDoctorData.consultationFee} ج.م
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Step 2: Select Date */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold">
                    2️⃣ اختر التاريخ
                  </label>
                  <Input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    data-testid="input-appointment-date"
                  />
                </div>

                {/* Step 3: Select Time */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold">
                    3️⃣ اختر الوقت
                  </label>
                  <Select value={appointmentTime} onValueChange={setAppointmentTime}>
                    <SelectTrigger data-testid="select-time">
                      <SelectValue placeholder="اختر وقت الموعد" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Step 4: Select Duration */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold">
                    4️⃣ مدة الجلسة
                  </label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger data-testid="select-duration">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 دقيقة</SelectItem>
                      <SelectItem value="45">45 دقيقة</SelectItem>
                      <SelectItem value="60">60 دقيقة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Reminder & Price Summary */}
                <div className="space-y-3 pt-3 border-t">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="reminder"
                      checked={reminderEnabled}
                      onChange={(e) => setReminderEnabled(e.target.checked)}
                      className="w-4 h-4"
                      data-testid="checkbox-reminder"
                    />
                    <label htmlFor="reminder" className="text-sm font-medium">
                      تفعيل التنبيهات قبل الموعد
                    </label>
                  </div>

                  {/* Price Summary */}
                  <Card className="bg-primary/5 dark:bg-primary/10">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold">ملخص الرسم:</span>
                        <div className="flex items-center gap-2 text-lg font-bold text-primary">
                          <DollarSign className="h-5 w-5" />
                          {estimatedFee} ج.م
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>• الرسم الطبي الأساسي: {estimatedFee} ج.م</p>
                        <p>• لا توجد رسوم إضافية</p>
                        <p>• يمكن تطبيق كود خصم من صفحة الدفع</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                  <Button
                    className="flex-1"
                    onClick={handleBookAppointment}
                    disabled={!selectedDoctor || !appointmentDate || !appointmentTime}
                    data-testid="button-confirm-booking"
                  >
                    <Check className="h-4 w-4 ml-2" />
                    تأكيد الحجز
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowBookingForm(false)}
                    data-testid="button-cancel-form"
                  >
                    إلغاء
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Appointments Tab */}
        <TabsContent value="appointments" className="mt-6 space-y-4">
          {/* Filter Buttons */}
          <div className="flex gap-2 flex-wrap">
            {["all", "confirmed", "pending", "cancelled"].map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus(status)}
                data-testid={`button-filter-${status}`}
              >
                {status === "all"
                  ? "جميع المواعيد"
                  : status === "confirmed"
                  ? "مؤكدة"
                  : status === "pending"
                  ? "قيد الانتظار"
                  : "ملغاة"}
              </Button>
            ))}
          </div>

          {/* Appointments List */}
          {filteredAppointments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-muted-foreground">لا توجد مواعيد</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <Card key={appointment.id} data-testid={`card-appointment-${appointment.id}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg">{appointment.doctorName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {appointment.clinic}
                        </p>
                      </div>
                      <Badge className={getStatusColor(appointment.status)}>
                        {getStatusLabel(appointment.status)}
                      </Badge>
                    </div>

                    <div className="grid gap-3 md:grid-cols-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">التاريخ</p>
                          <p className="font-semibold text-sm">{appointment.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">الوقت</p>
                          <p className="font-semibold text-sm">{appointment.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">المدة</p>
                          <p className="font-semibold text-sm">
                            {appointment.duration} دقيقة
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">الرسم</p>
                          <p className="font-semibold text-sm">
                            {appointment.consultationFee} ج.م
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Reminder Status */}
                    <div className="flex items-center gap-2 text-sm mb-4 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                      <Smartphone className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-600 dark:text-blue-400">
                        {appointment.reminderEnabled
                          ? "✓ التنبيهات مفعلة"
                          : "✕ التنبيهات معطلة"}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    {appointment.status !== "cancelled" && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          data-testid={`button-reschedule-${appointment.id}`}
                        >
                          إعادة جدولة
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleCancelAppointment(appointment.id)}
                          data-testid={`button-cancel-appointment-${appointment.id}`}
                        >
                          إلغاء
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
