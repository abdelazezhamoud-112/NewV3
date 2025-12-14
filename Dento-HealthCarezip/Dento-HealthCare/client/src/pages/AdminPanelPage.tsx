import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Calendar, DollarSign, TrendingUp, Edit, Trash2, Settings } from "lucide-react";

interface Doctor {
  id: string;
  name: string;
  clinic: string;
  specialization: string;
  status: "active" | "inactive";
}

interface Statistics {
  totalDoctors: number;
  totalAppointments: number;
  totalRevenue: number;
  totalPatients: number;
}

export default function AdminPanelPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([
    { id: "1", name: "د. محمد أحمد", clinic: "التشخيص والأشعة", specialization: "تشخيص وأشعة", status: "active" },
    { id: "2", name: "د. فاطمة علي", clinic: "العلاج التحفظي", specialization: "علاج تحفظي", status: "active" },
    { id: "3", name: "د. سارة حسن", clinic: "تجميل الأسنان", specialization: "تجميل وتبييض", status: "active" },
    { id: "4", name: "د. علي محمود", clinic: "جراحة الفم والفكين", specialization: "جراحة", status: "inactive" },
  ]);

  const [stats] = useState<Statistics>({
    totalDoctors: 4,
    totalAppointments: 156,
    totalRevenue: 45000,
    totalPatients: 892,
  });

  const handleToggleDoctorStatus = (id: string) => {
    setDoctors(doctors.map(doc =>
      doc.id === id ? { ...doc, status: doc.status === "active" ? "inactive" : "active" } : doc
    ));
  };

  const handleDeleteDoctor = (id: string) => {
    setDoctors(doctors.filter(doc => doc.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">لوحة تحكم المسؤول</h1>
        <p className="text-muted-foreground text-lg">إدارة النظام والأطباء والإحصائيات</p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">الأطباء</p>
                <p className="text-3xl font-bold">{stats.totalDoctors}</p>
              </div>
              <Users className="h-8 w-8 text-primary opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">المواعيد</p>
                <p className="text-3xl font-bold">{stats.totalAppointments}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">الإيرادات</p>
                <p className="text-3xl font-bold">{stats.totalRevenue.toLocaleString()} ج.م</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">المرضى</p>
                <p className="text-3xl font-bold">{stats.totalPatients}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="doctors" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="doctors">الأطباء</TabsTrigger>
          <TabsTrigger value="appointments">المواعيد</TabsTrigger>
          <TabsTrigger value="settings">الإعدادات</TabsTrigger>
        </TabsList>

        {/* Doctors Tab */}
        <TabsContent value="doctors" className="mt-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">قائمة الأطباء</h3>
            <Button
              size="sm"
              variant="default"
              data-testid="button-add-doctor"
            >
              إضافة طبيب
            </Button>
          </div>

          {doctors.map(doc => (
            <Card key={doc.id}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-semibold">{doc.name}</p>
                      <p className="text-sm text-muted-foreground">{doc.specialization}</p>
                      <p className="text-sm text-muted-foreground">{doc.clinic}</p>
                    </div>
                    <Badge
                      className={doc.status === "active" ?
                        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" :
                        "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
                      }
                    >
                      {doc.status === "active" ? "نشط" : "غير نشط"}
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={doc.status === "active" ? "destructive" : "default"}
                      onClick={() => handleToggleDoctorStatus(doc.id)}
                      data-testid={`button-toggle-doctor-${doc.id}`}
                    >
                      {doc.status === "active" ? "تعطيل" : "تفعيل"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      data-testid={`button-edit-doctor-${doc.id}`}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      تعديل
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteDoctor(doc.id)}
                      data-testid={`button-delete-doctor-${doc.id}`}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      حذف
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Appointments Tab */}
        <TabsContent value="appointments" className="mt-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">إدارة جميع المواعيد في النظام</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات النظام</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">اسم المستشفى</label>
                <input
                  type="text"
                  placeholder="Dento Health Care"
                  className="w-full p-2 border rounded-lg bg-background"
                  data-testid="input-hospital-name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">البريد الإلكتروني للتواصل</label>
                <input
                  type="email"
                  placeholder="admin@dentohealthcare.com"
                  className="w-full p-2 border rounded-lg bg-background"
                  data-testid="input-hospital-email"
                />
              </div>
              <Button
                className="w-full"
                data-testid="button-save-settings"
              >
                حفظ الإعدادات
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
