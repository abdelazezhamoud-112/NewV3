import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Phone, Mail, Award, Calendar, Users } from "lucide-react";

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  clinic: string;
  phone: string;
  email: string;
  experience: number;
  rating: number;
  totalPatients: number;
  availability: string;
}

export default function DoctorManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [doctors] = useState<Doctor[]>([
    {
      id: "1",
      name: "د. محمد أحمد",
      specialization: "تشخيص وأشعة",
      clinic: "التشخيص والأشعة",
      phone: "+20 100 123 4567",
      email: "dr.ahmed@hospital.com",
      experience: 12,
      rating: 4.8,
      totalPatients: 1250,
      availability: "السبت - الخميس"
    },
    {
      id: "2",
      name: "د. فاطمة علي",
      specialization: "علاج تحفظي",
      clinic: "العلاج التحفظي",
      phone: "+20 100 234 5678",
      email: "dr.fatima@hospital.com",
      experience: 8,
      rating: 4.9,
      totalPatients: 890,
      availability: "السبت - الخميس"
    },
    {
      id: "3",
      name: "د. سارة حسن",
      specialization: "تجميل وتبييض",
      clinic: "تجميل الأسنان",
      phone: "+20 100 345 6789",
      email: "dr.sarah@hospital.com",
      experience: 10,
      rating: 4.7,
      totalPatients: 756,
      availability: "السبت - الخميس"
    },
    {
      id: "4",
      name: "د. علي محمود",
      specialization: "جراحة",
      clinic: "جراحة الفم والفكين",
      phone: "+20 100 456 7890",
      email: "dr.ali@hospital.com",
      experience: 15,
      rating: 4.9,
      totalPatients: 1450,
      availability: "الأحد - الخميس"
    },
  ]);

  const filteredDoctors = doctors.filter(doc =>
    (doc.name.includes(searchTerm) ||
      doc.specialization.includes(searchTerm) ||
      doc.clinic.includes(searchTerm)) &&
    (specializationFilter === "all" || doc.specialization === specializationFilter) &&
    doc.rating >= ratingFilter
  );

  const toggleFavorite = (doctorId: string) => {
    setFavorites(fav =>
      fav.includes(doctorId)
        ? fav.filter(id => id !== doctorId)
        : [...fav, doctorId]
    );
  };

  const uniqueSpecializations = [...new Set(doctors.map(d => d.specialization))];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">👨‍⚕️ إدارة الأطباء</h1>
        <p className="text-muted-foreground text-lg">تصفح وابحث عن أفضل الأطباء المتخصصين</p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <Input
          placeholder="ابحث عن طبيب أو تخصص أو عيادة..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          data-testid="input-search-doctor"
        />
        
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-semibold mb-2 block">التخصص</label>
            <select
              value={specializationFilter}
              onChange={(e) => setSpecializationFilter(e.target.value)}
              className="w-full p-2 border rounded-lg bg-background"
              data-testid="select-specialization"
            >
              <option value="all">جميع التخصصات</option>
              {uniqueSpecializations.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block">أقل تقييم</label>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(Number(e.target.value))}
              className="w-full p-2 border rounded-lg bg-background"
              data-testid="select-rating-filter"
            >
              <option value="0">جميع التقييمات</option>
              <option value="4">⭐ 4+ فما فوق</option>
              <option value="4.5">⭐ 4.5+ فما فوق</option>
              <option value="4.8">⭐ 4.8+ فما فوق</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">إجمالي الأطباء</p>
            <p className="text-3xl font-bold text-primary">{doctors.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">أعلى تقييم</p>
            <p className="text-3xl font-bold text-yellow-600">4.9 ⭐</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">متوسط الخبرة</p>
            <p className="text-3xl font-bold text-blue-600">11 سنة</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">إجمالي المرضى</p>
            <p className="text-3xl font-bold text-green-600">4,346</p>
          </CardContent>
        </Card>
      </div>

      {/* Doctors List */}
      <div className="space-y-4">
        {filteredDoctors.map(doctor => (
          <Card key={doctor.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row md:items-center gap-4 p-6">
                {/* Avatar */}
                <Avatar className="h-16 w-16 flex-shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
                    {doctor.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>

                {/* Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold">{doctor.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{doctor.rating}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{doctor.specialization}</Badge>
                    <Badge variant="outline">{doctor.clinic}</Badge>
                  </div>

                  <div className="grid gap-2 md:grid-cols-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      خبرة: {doctor.experience} سنة
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      مرضى: {doctor.totalPatients}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {doctor.availability}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" />
                      {doctor.phone}
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      {doctor.email}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant={favorites.includes(doctor.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleFavorite(doctor.id)}
                    className="gap-2"
                    data-testid={`button-favorite-doctor-${doctor.id}`}
                  >
                    {favorites.includes(doctor.id) ? "★" : "☆"}
                  </Button>
                  <Button className="gap-2" data-testid={`button-book-doctor-${doctor.id}`}>
                    احجز موعد
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
