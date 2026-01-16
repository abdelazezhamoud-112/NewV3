import { Home, Hospital, Calendar, ChevronDown, SquareCode, Clock, Users, FileTextIcon, Star, Search, CreditCard, Wand2, Brain, ClipboardList, DollarSign, CalendarCheck } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface AppSidebarProps {
  activePage?: string;
  onNavigate?: (page: string) => void;
  customPages?: Array<{ id: string; name: string; content: string; icon: string }>;
  userType?: string;
  language?: "ar" | "en";
}

export default function AppSidebar({ activePage = "home", onNavigate, customPages = [], userType = "patient", language = "ar" }: AppSidebarProps) {
  const clinics = [
    { id: "diagnosis", name: "التشخيص والأشعة", nameEn: "Diagnosis & Radiology" },
    { id: "conservative", name: "العلاج التحفظي وطب وجراحة الجذور", nameEn: "Conservative & Endodontics" },
    { id: "surgery", name: "جراحة الفم والفكين", nameEn: "Oral & Maxillofacial Surgery" },
    { id: "removable", name: "التركيبات المتحركة", nameEn: "Removable Prosthodontics" },
    { id: "fixed", name: "التركيبات الثابتة", nameEn: "Fixed Prosthodontics" },
    { id: "gums", name: "اللثة", nameEn: "Periodontics" },
    { id: "oral-surgery", name: "الجراحة", nameEn: "Surgery" },
    { id: "cosmetic", name: "تجميل الأسنان", nameEn: "Cosmetic Dentistry" },
    { id: "implants", name: "زراعة الأسنان", nameEn: "Dental Implants" },
    { id: "orthodontics", name: "تقويم الأسنان", nameEn: "Orthodontics" },
    { id: "pediatric", name: "أسنان الأطفال", nameEn: "Pediatric Dentistry" },
  ];

  const handleClick = (page: string) => {
    console.log("التنقل إلى:", page);
    onNavigate?.(page);
  };

  const isPatient = userType === "patient";
  const isDoctor = userType === "doctor";
  const isStudent = userType === "student";
  const isGraduate = userType === "graduate";
  const isStaff = isDoctor || isStudent || isGraduate;

  const translations = {
    ar: {
      mainMenu: "القائمة الرئيسية",
      home: "الرئيسية",
      aiDiagnosis: "التشخيص الذكي",
      clinicDetails: "تفاصيل العيادات",
      treatmentPlans: "الخطة العلاجية للمريض",
      dentocad: "Dentocad",
      bookAppointment: "حجز المواعيد",
      doctors: "الأطباء",
      medicalRecords: "السجل الطبي",
      ratings: "التقييمات",
      search: "البحث",
      payment: "الفواتير والدفع",
      chat: "Dento الذكي",
      todayAppointments: "مواعيد اليوم",
      priceManagement: "إدارة الأسعار",
      patients: "المرضى",
      university: "جامعة الدلتا للعلوم والتكنولوجيا",
    },
    en: {
      mainMenu: "Main Menu",
      home: "Home",
      aiDiagnosis: "AI Diagnosis",
      clinicDetails: "Clinic Details",
      treatmentPlans: "Treatment Plans",
      dentocad: "Dentocad",
      bookAppointment: "Book Appointment",
      doctors: "Doctors",
      medicalRecords: "Medical Records",
      ratings: "Ratings",
      search: "Search",
      payment: "Billing & Payment",
      chat: "Smart Dento",
      todayAppointments: "Today's Appointments",
      priceManagement: "Price Management",
      patients: "Patients",
      university: "Delta University of Science and Technology",
    },
  };

  const t = translations[language];

  return (
    <Sidebar side="right" collapsible="offcanvas">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg">
            <Hospital className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Dento Health Care</h2>
            <p className="text-xs text-[#ffffff]">{t.university}</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t.mainMenu}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleClick("home")}
                  isActive={activePage === "home"}
                  data-testid="nav-home"
                >
                  <Home className="w-4 h-4" />
                  <span>{t.home}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {isStaff && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => handleClick("today-appointments")}
                    isActive={activePage === "today-appointments"}
                    data-testid="nav-today-appointments"
                    className="font-semibold bg-gradient-to-r from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20"
                  >
                    <CalendarCheck className="w-4 h-4 text-green-600" />
                    <span>{t.todayAppointments}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {isStaff && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => handleClick("patients")}
                    isActive={activePage === "patients"}
                    data-testid="nav-patients"
                  >
                    <Users className="w-4 h-4" />
                    <span>{t.patients}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {isDoctor && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => handleClick("price-management")}
                    isActive={activePage === "price-management"}
                    data-testid="nav-price-management"
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>{t.priceManagement}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleClick("ai-diagnosis")}
                  isActive={activePage === "ai-diagnosis"}
                  data-testid="nav-ai-diagnosis"
                  className="font-semibold bg-gradient-to-r from-primary/10 to-blue-500/10 hover:from-primary/20 hover:to-blue-500/20"
                >
                  <Brain className="w-4 h-4 text-primary" />
                  <span>{t.aiDiagnosis}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton data-testid="nav-clinic-details">
                      <Hospital className="w-4 h-4" />
                      <span>{t.clinicDetails}</span>
                      <ChevronDown className="mr-auto transition-transform group-data-[state=open]/collapsible:rotate-180 w-4 h-4" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {clinics.map((clinic) => (
                        <SidebarMenuSubItem key={clinic.id}>
                          <SidebarMenuSubButton
                            onClick={() => handleClick(`clinic-${clinic.id}`)}
                            isActive={activePage === `clinic-${clinic.id}`}
                            data-testid={`nav-clinic-${clinic.id}`}
                          >
                            <span>{language === "ar" ? clinic.name : clinic.nameEn}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleClick("treatment-plans")}
                  isActive={activePage === "treatment-plans"}
                  data-testid="nav-treatment-plans"
                >
                  <ClipboardList className="w-4 h-4" />
                  <span>{t.treatmentPlans}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleClick("dentocad")}
                  isActive={activePage === "dentocad"}
                  data-testid="nav-dentocad"
                >
                  <SquareCode className="w-4 h-4" />
                  <span>{t.dentocad}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {isPatient && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => handleClick("appointments")}
                    isActive={activePage === "appointments"}
                    data-testid="nav-appointments"
                  >
                    <Clock className="w-4 h-4" />
                    <span>{t.bookAppointment}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleClick("doctors")}
                  isActive={activePage === "doctors"}
                  data-testid="nav-doctors"
                >
                  <Users className="w-4 h-4" />
                  <span>{t.doctors}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleClick("medical-records")}
                  isActive={activePage === "medical-records"}
                  data-testid="nav-medical-records"
                >
                  <FileTextIcon className="w-4 h-4" />
                  <span>{t.medicalRecords}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleClick("ratings")}
                  isActive={activePage === "ratings"}
                  data-testid="nav-ratings"
                >
                  <Star className="w-4 h-4" />
                  <span>{t.ratings}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleClick("search")}
                  isActive={activePage === "search"}
                  data-testid="nav-search"
                >
                  <Search className="w-4 h-4" />
                  <span>{t.search}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {isPatient && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => handleClick("payment")}
                    isActive={activePage === "payment"}
                    data-testid="nav-payment"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>{t.payment}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleClick("chat")}
                  isActive={activePage === "chat"}
                  data-testid="nav-chat"
                  className="font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-500 dark:to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>{t.chat}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
