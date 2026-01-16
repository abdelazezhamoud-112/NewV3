import { useState, useEffect, useRef } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import NotFound from "@/pages/not-found";
import LoginPage from "@/components/LoginPage";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import AppSidebar from "@/components/AppSidebar";
import DashboardStats from "@/components/DashboardStats";
import PatientList from "@/components/PatientList";
import TreatmentPlanCard from "@/components/TreatmentPlanCard";
import ReportsList from "@/components/ReportsList";
import ClinicCard from "@/components/ClinicCard";
import UserProfileCard from "@/components/UserProfileCard";
import PatientChatbot from "@/components/PatientChatbot";
import FloatingChatbot from "@/components/FloatingChatbot";
import DentocadPage from "@/pages/DentocadPage";
import TreatmentPlanDetailPage from "@/pages/TreatmentPlanDetailPage";
import AppointmentBookingPageNew from "@/pages/AppointmentBookingPageNew";
import DoctorManagementPage from "@/pages/DoctorManagementPage";
import MedicalRecordsPage from "@/pages/MedicalRecordsPage";
import RatingsPage from "@/pages/RatingsPage";
import NotificationsPage from "@/pages/NotificationsPage";
import SearchPage from "@/pages/SearchPage";
import PaymentPageNew from "@/pages/PaymentPageNew";
import DoctorPanelPage from "@/pages/DoctorPanelPage";
import AdminPanelPage from "@/pages/AdminPanelPage";
import SettingsPage from "@/pages/SettingsPage";
import SupportTicketsPage from "@/pages/SupportTicketsPage";
import FinancialManagementPage from "@/pages/FinancialManagementPage";
import ClinicsOverviewPage from "@/pages/ClinicsOverviewPage";
import ClinicDetailPageNew from "@/pages/ClinicDetailPage";
import ReportsPage from "@/pages/ReportsPage";
import ChatBotPage from "@/pages/ChatBotPage";
import MyAppointmentsPage from "@/pages/MyAppointmentsPage";
import MedicationsPage from "@/pages/MedicationsPage";
import MyReviewsPage from "@/pages/MyReviewsPage";
import UpcomingRemindersPage from "@/pages/UpcomingRemindersPage";
import DoctorSchedulePage from "@/pages/DoctorSchedulePage";
import PatientQueuePage from "@/pages/PatientQueuePage";
import PatientMedicalHistoryPage from "@/pages/PatientMedicalHistoryPage";
import AppointmentsAnalyticsPage from "@/pages/AppointmentsAnalyticsPage";
import DoctorProfilePage from "@/pages/DoctorProfilePage";
import SignUpPage from "@/pages/SignUpPage";
import AIDiagnosisPage from "@/pages/AIDiagnosisPage";
import { Stethoscope, Syringe, Scissors, Layers, Building2, Moon, Sun, Activity, Sparkles, Baby, Smile, User, Globe, MessageCircle, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      data-testid="button-theme-toggle"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}

function LanguageToggle({ language, onLanguageChange }: { language: "ar" | "en"; onLanguageChange: (lang: "ar" | "en") => void }) {
  const toggleLanguage = () => {
    const newLang: "ar" | "en" = language === "ar" ? "en" : "ar";
    onLanguageChange(newLang);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
      data-testid="button-language-toggle"
      title={language === "ar" ? "English" : "العربية"}
    >
      <Globe className="h-5 w-5" />
      <span className="text-xs ml-1">{language === "ar" ? "EN" : "AR"}</span>
    </Button>
  );
}

function HomePage({ userName, userType, onNavigate, language = "ar" }: { userName: string; userType: string; onNavigate?: (page: string) => void; language?: "ar" | "en" }) {
  const today = new Date();
  const dayNames = language === "ar" 
    ? ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"]
    : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const monthNames = language === "ar"
    ? ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"]
    : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const greeting = () => {
    const hour = today.getHours();
    if (language === "ar") {
      if (hour < 12) return "صباح الخير";
      if (hour < 18) return "مساء الخير";
      return "مساء الخير";
    } else {
      if (hour < 12) return "Good Morning";
      if (hour < 18) return "Good Afternoon";
      return "Good Evening";
    }
  };

  const treatmentSteps = [
    { id: "1", title: language === "ar" ? "الفحص" : "Checkup", status: "completed" },
    { id: "2", title: language === "ar" ? "الأشعة" : "X-Ray", status: "completed" },
    { id: "3", title: language === "ar" ? "التنظيف" : "Cleaning", status: "current" },
    { id: "4", title: language === "ar" ? "الحشو" : "Filling", status: "pending" },
    { id: "5", title: language === "ar" ? "المتابعة" : "Follow-up", status: "pending" },
  ];

  const quickActions = [
    { icon: "📅", label: language === "ar" ? "حجز موعد" : "Book", page: "appointments", color: "bg-teal-500" },
    { icon: "💬", label: language === "ar" ? "تواصل" : "Chat", page: "chat", color: "bg-emerald-500" },
    { icon: "📋", label: language === "ar" ? "السجل" : "Records", page: "medical-records", color: "bg-cyan-500" },
    { icon: "💳", label: language === "ar" ? "الدفع" : "Pay", page: "payment", color: "bg-amber-500" },
    { icon: "🆘", label: language === "ar" ? "طوارئ" : "Emergency", page: "chat", color: "bg-red-500" },
  ];

  const healthTips = language === "ar" ? [
    "تنظيف الأسنان بعد الأكل بـ30 دقيقة أفضل من التنظيف الفوري!",
    "استخدم خيط الأسنان مرة واحدة يومياً على الأقل",
    "قم بزيارة طبيب الأسنان كل 6 أشهر للفحص الدوري",
    "تجنب المشروبات الغازية والسكريات للحفاظ على أسنانك",
  ] : [
    "Brushing 30 minutes after eating is better than immediately!",
    "Use dental floss at least once daily",
    "Visit your dentist every 6 months for regular checkups",
    "Avoid sugary drinks to maintain healthy teeth",
  ];

  const tipIndex = today.getDate() % healthTips.length;
  const dailyTip = healthTips[tipIndex];
  const completedSteps = treatmentSteps.filter(s => s.status === "completed").length;
  const progressPercent = Math.round((completedSteps / treatmentSteps.length) * 100);
  const isRTL = language === "ar";

  return (
    <div className="space-y-6">
      {/* Welcome Header with Greeting */}
      <div className="bg-gradient-to-l from-teal-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-teal-100 text-sm mb-1">
              {dayNames[today.getDay()]}، {today.getDate()} {monthNames[today.getMonth()]} {today.getFullYear()}
            </p>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {greeting()}، {userName}! 👋
            </h1>
            <p className="text-teal-100">
              {language === "ar" ? "ابتسامتك تبدأ من هنا" : "Your smile starts here"}
            </p>
          </div>
          <div className="hidden md:block text-6xl">😊</div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Next Appointment */}
        <button 
          className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 cursor-pointer hover:shadow-md transition-all text-right w-full"
          onClick={() => onNavigate?.("appointments")}
          aria-label={language === "ar" ? "عرض الموعد القادم" : "View next appointment"}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center">
              <span className="text-xl">📅</span>
            </div>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {language === "ar" ? "الموعد القادم" : "Next Appointment"}
            </span>
          </div>
          <p className="text-lg font-bold text-slate-800 dark:text-white">28 {language === "ar" ? "يناير" : "Jan"}</p>
          <p className="text-sm text-teal-600 dark:text-teal-400">د. محمد أحمد</p>
          <p className="text-xs text-slate-400">عيادة التنظيف</p>
        </button>

        {/* Treatment Progress */}
        <button 
          className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 cursor-pointer hover:shadow-md transition-all text-right w-full"
          onClick={() => onNavigate?.("treatment-plans")}
          aria-label={language === "ar" ? "عرض تقدم العلاج" : "View treatment progress"}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
              <span className="text-xl">📊</span>
            </div>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {language === "ar" ? "تقدم العلاج" : "Treatment Progress"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14">
              <svg className="w-14 h-14 transform -rotate-90">
                <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="none" className="text-slate-200 dark:text-slate-700" />
                <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="none" 
                  className="text-emerald-500" 
                  strokeDasharray={`${progressPercent * 1.51} 151`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-800 dark:text-white">
                {progressPercent}%
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-white">{completedSteps}/{treatmentSteps.length}</p>
              <p className="text-xs text-slate-400">{language === "ar" ? "مراحل مكتملة" : "Steps done"}</p>
            </div>
          </div>
        </button>

        {/* Balance */}
        <button 
          className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 cursor-pointer hover:shadow-md transition-all text-right w-full"
          onClick={() => onNavigate?.("payment")}
          aria-label={language === "ar" ? "عرض الفواتير والدفع" : "View billing and payments"}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
              <span className="text-xl">💳</span>
            </div>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {language === "ar" ? "الرصيد المستحق" : "Balance Due"}
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-800 dark:text-white">850</p>
          <p className="text-sm text-amber-600 dark:text-amber-400">{language === "ar" ? "جنيه مصري" : "EGP"}</p>
        </button>

        {/* Health Status */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 text-right">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
              <span className="text-xl">😊</span>
            </div>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {language === "ar" ? "حالتك الصحية" : "Health Status"}
            </span>
          </div>
          <p className="text-lg font-bold text-green-600 dark:text-green-400">
            {language === "ar" ? "جيدة جداً" : "Very Good"}
          </p>
          <p className="text-xs text-slate-400">{language === "ar" ? "آخر فحص: قبل أسبوع" : "Last check: 1 week ago"}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4">
          {language === "ar" ? "⚡ إجراءات سريعة" : "⚡ Quick Actions"}
        </h3>
        <div className="flex justify-around">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => onNavigate?.(action.page)}
              className="flex flex-col items-center gap-2 group"
              aria-label={action.label}
            >
              <div className={`w-14 h-14 ${action.color} rounded-full flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform`}>
                {action.icon}
              </div>
              <span className="text-xs text-slate-600 dark:text-slate-300">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Treatment Timeline */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            {language === "ar" ? "📈 رحلة علاجك" : "📈 Your Treatment Journey"}
          </h3>
          <button 
            onClick={() => onNavigate?.("treatment-plans")}
            className="text-xs text-teal-600 hover:text-teal-700 dark:text-teal-400"
            aria-label={language === "ar" ? "عرض تفاصيل الخطة العلاجية" : "View treatment plan details"}
          >
            {isRTL ? "← عرض التفاصيل" : "View Details →"}
          </button>
        </div>
        <div className="flex items-center justify-between">
          {treatmentSteps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold
                  ${step.status === "completed" ? "bg-emerald-500" : 
                    step.status === "current" ? "bg-teal-500 ring-4 ring-teal-200 dark:ring-teal-900" : 
                    "bg-slate-300 dark:bg-slate-600"}`}
                >
                  {step.status === "completed" ? "✓" : index + 1}
                </div>
                <span className={`text-xs mt-2 text-center max-w-16
                  ${step.status === "current" ? "text-teal-600 dark:text-teal-400 font-semibold" : "text-slate-500 dark:text-slate-400"}`}
                >
                  {step.title}
                </span>
              </div>
              {index < treatmentSteps.length - 1 && (
                <div className={`w-8 md:w-12 h-1 mx-1 rounded
                  ${step.status === "completed" ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700"}`} 
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Row: Health Tip + Messages */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Health Tip */}
        <div className="bg-gradient-to-l from-cyan-50 to-teal-50 dark:from-cyan-950/30 dark:to-teal-950/30 rounded-xl p-5 border border-teal-200 dark:border-teal-800">
          <div className="flex items-start gap-3">
            <span className="text-3xl">💡</span>
            <div>
              <h3 className="font-semibold text-teal-800 dark:text-teal-200 mb-2">
                {language === "ar" ? "نصيحة اليوم" : "Tip of the Day"}
              </h3>
              <p className="text-sm text-teal-700 dark:text-teal-300">{dailyTip}</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <button 
          className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 cursor-pointer hover:shadow-md transition-all text-right w-full"
          onClick={() => onNavigate?.("chat")}
          aria-label={language === "ar" ? "عرض الرسائل الجديدة" : "View new messages"}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="text-3xl">📱</span>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">2</span>
              </div>
              <div className="text-right">
                <h3 className="font-semibold text-slate-800 dark:text-white">
                  {language === "ar" ? "رسائل جديدة" : "New Messages"}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {language === "ar" ? "لديك رسالة من د. محمد" : "Message from Dr. Mohamed"}
                </p>
              </div>
            </div>
            <span className="text-slate-400">{isRTL ? "←" : "→"}</span>
          </div>
        </button>
      </div>

      {userType !== "patient" && <DashboardStats />}
    </div>
  );
}

function ClinicsPage() {
  const clinics = [
    {
      id: "diagnosis",
      name: "التشخيص والأشعة",
      description: "الفحص الأولي والتشخيص بالأشعة",
      patientCount: 245,
      activeCount: 52,
      icon: <Stethoscope className="h-6 w-6 text-blue-600" />,
      color: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      id: "conservative",
      name: "العلاج التحفظي وطب وجراحة الجذور",
      description: "علاج الأسنان وحشو الجذور",
      patientCount: 189,
      activeCount: 38,
      icon: <Syringe className="h-6 w-6 text-green-600" />,
      color: "bg-green-100 dark:bg-green-900/30",
    },
    {
      id: "surgery",
      name: "جراحة الفم والفكين",
      description: "العمليات الجراحية للفم والفكين",
      patientCount: 156,
      activeCount: 24,
      icon: <Scissors className="h-6 w-6 text-red-600" />,
      color: "bg-red-100 dark:bg-red-900/30",
    },
    {
      id: "removable",
      name: "التركيبات المتحركة",
      description: "تركيبات الأسنان المتحركة والجسور",
      patientCount: 198,
      activeCount: 31,
      icon: <Layers className="h-6 w-6 text-purple-600" />,
      color: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      id: "fixed",
      name: "التركيبات الثابتة",
      description: "التركيبات الثابتة والزراعة",
      patientCount: 213,
      activeCount: 45,
      icon: <Building2 className="h-6 w-6 text-indigo-600" />,
      color: "bg-indigo-100 dark:bg-indigo-900/30",
    },
    {
      id: "gums",
      name: "اللثة",
      description: "علاج أمراض اللثة والتهاباتها",
      patientCount: 167,
      activeCount: 29,
      icon: <Activity className="h-6 w-6 text-pink-600" />,
      color: "bg-pink-100 dark:bg-pink-900/30",
    },
    {
      id: "oral-surgery",
      name: "الجراحة",
      description: "الجراحات الفموية المتخصصة",
      patientCount: 134,
      activeCount: 22,
      icon: <Scissors className="h-6 w-6 text-orange-600" />,
      color: "bg-orange-100 dark:bg-orange-900/30",
    },
    {
      id: "cosmetic",
      name: "تجميل الأسنان",
      description: "تحسين مظهر الأسنان والابتسامة",
      patientCount: 221,
      activeCount: 47,
      icon: <Sparkles className="h-6 w-6 text-yellow-600" />,
      color: "bg-yellow-100 dark:bg-yellow-900/30",
    },
    {
      id: "implants",
      name: "زراعة الأسنان",
      description: "زراعة الأسنان المفقودة",
      patientCount: 178,
      activeCount: 35,
      icon: <Building2 className="h-6 w-6 text-teal-600" />,
      color: "bg-teal-100 dark:bg-teal-900/30",
    },
    {
      id: "orthodontics",
      name: "تقويم الأسنان",
      description: "تصحيح وضع الأسنان والفكين",
      patientCount: 256,
      activeCount: 61,
      icon: <Smile className="h-6 w-6 text-cyan-600" />,
      color: "bg-cyan-100 dark:bg-cyan-900/30",
    },
    {
      id: "pediatric",
      name: "أسنان الأطفال",
      description: "رعاية أسنان الأطفال المتخصصة",
      patientCount: 312,
      activeCount: 73,
      icon: <Baby className="h-6 w-6 text-rose-600" />,
      color: "bg-rose-100 dark:bg-rose-900/30",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">العيادات الطبية</h1>
        <p className="text-muted-foreground text-lg">جميع العيادات المتاحة في المستشفى</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {clinics.map((clinic) => (
          <ClinicCard
            key={clinic.id}
            {...clinic}
            onViewDetails={(id) => console.log("عرض تفاصيل العيادة:", id)}
          />
        ))}
      </div>
    </div>
  );
}

function ClinicDetailPage({ clinicId }: { clinicId: string }) {
  const clinicNames: Record<string, string> = {
    diagnosis: "التشخيص والأشعة",
    conservative: "العلاج التحفظي وطب وجراحة الجذور",
    surgery: "جراحة الفم والفكين",
    removable: "التركيبات المتحركة",
    fixed: "التركيبات الثابتة",
    gums: "اللثة",
    "oral-surgery": "الجراحة",
    cosmetic: "تجميل الأسنان",
    implants: "زراعة الأسنان",
    orthodontics: "تقويم الأسنان",
    pediatric: "أسنان الأطفال",
  };

  const mockTreatmentPlans = [
    {
      id: "1",
      patientName: "أحمد محمد علي",
      planTitle: "خطة علاج التسوس",
      steps: [
        {
          id: "1",
          title: "الفحص الأولي",
          description: "فحص شامل للفم والأسنان",
          status: "completed" as const,
          date: "2025-10-15",
        },
        {
          id: "2",
          title: "الحشو التجميلي",
          description: "حشو الضرس المصاب",
          status: "in-progress" as const,
          date: "2025-11-02",
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">عيادة {clinicNames[clinicId] || "العيادة"}</h1>
        <p className="text-muted-foreground text-lg">إدارة المرضى والخطط العلاجية</p>
      </div>

      <Tabs defaultValue="patients" className="w-full" data-testid="tabs-clinic">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="patients" data-testid="tab-patients">
            🦷 المرضى
          </TabsTrigger>
          <TabsTrigger value="reports" data-testid="tab-reports">
            🧾 التقارير
          </TabsTrigger>
          <TabsTrigger value="plans" data-testid="tab-plans">
            📅 الخطط العلاجية
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="patients" className="mt-6">
          <PatientList
            clinicName={clinicNames[clinicId]}
            onViewPatient={(id) => console.log("عرض المريض:", id)}
          />
        </TabsContent>
        
        <TabsContent value="reports" className="mt-6">
          <ReportsList
            onViewReport={(id) => console.log("عرض التقرير:", id)}
            onAddReport={() => console.log("إضافة تقرير")}
          />
        </TabsContent>
        
        <TabsContent value="plans" className="mt-6">
          <div className="space-y-4">
            {mockTreatmentPlans.map((plan) => (
              <TreatmentPlanCard
                key={plan.id}
                patientName={plan.patientName}
                planTitle={plan.planTitle}
                steps={plan.steps}
                onUpdateStep={(id) => console.log("تحديث الخطوة:", id)}
                onViewDetails={() => console.log("عرض تفاصيل الخطة")}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface CustomPage {
  id: string;
  name: string;
  content: string;
  icon: string;
}

interface RouterProps {
  userName: string;
  userType: string;
  customPages: CustomPage[];
  setCustomPages: (pages: CustomPage[]) => void;
  language?: "ar" | "en";
}

function Router({ userName, userType, customPages, setCustomPages, language = "ar" }: RouterProps) {
  const [activePage, setActivePage] = useState("home");

  return (
    <Switch>
      <Route path="/">
        <HomePage userName={userName} userType={userType} onNavigate={setActivePage} language={language} />
      </Route>
      <Route path="/clinics">
        <ClinicsPage />
      </Route>
      <Route path="/clinic/:id">
        {(params) => <ClinicDetailPage clinicId={params.id} />}
      </Route>
      <Route path="/treatment-plans">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold">الخطط العلاجية</h1>
          <TreatmentPlanCard
            patientName="أحمد محمد علي"
            planTitle="خطة علاج التسوس والتنظيف"
            steps={[
              {
                id: "1",
                title: "الفحص الأولي",
                description: "فحص شامل",
                status: "completed",
                date: "2025-10-15",
              },
              {
                id: "2",
                title: "التنظيف",
                description: "تنظيف الأسنان",
                status: "in-progress",
                date: "2025-10-28",
              },
            ]}
          />
        </div>
      </Route>
      <Route path="/reports">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold">التقارير الطبية</h1>
          <ReportsList />
        </div>
      </Route>
      <Route path="/dentocad">
        <DentocadPage />
      </Route>
      <Route path="/treatment-plan-detail">
        <TreatmentPlanDetailPage onBackClick={() => console.log("عودة")} />
      </Route>
      <Route path="/doctor-panel">
        <DoctorPanelPage />
      </Route>
      <Route path="/admin-panel">
        <AdminPanelPage />
      </Route>
      <Route path="/settings">
        <SettingsPage customPages={customPages} setCustomPages={setCustomPages} />
      </Route>
      <Route path="/my-appointments">
        <MyAppointmentsPage />
      </Route>
      <Route path="/medications">
        <MedicationsPage />
      </Route>
      <Route path="/my-reviews">
        <MyReviewsPage />
      </Route>
      <Route path="/reminders">
        <UpcomingRemindersPage />
      </Route>
      <Route path="/doctor-schedule">
        <DoctorSchedulePage />
      </Route>
      <Route path="/patient-queue">
        <PatientQueuePage />
      </Route>
      <Route path="/patient-history">
        <PatientMedicalHistoryPage />
      </Route>
      <Route path="/appointments-analytics">
        <AppointmentsAnalyticsPage />
      </Route>
      <Route path="/doctor-profile">
        <DoctorProfilePage />
      </Route>
      {customPages.map((page: CustomPage) => (
        <Route key={page.id} path={`/custom-page-${page.id}`}>
          <div className="space-y-6">
            <h1 className="text-4xl font-bold">{page.name}</h1>
            <div className="p-6 border rounded-lg bg-card">
              <p className="text-lg">{page.content}</p>
              <p className="text-sm text-muted-foreground mt-4">هذه صفحة مخصصة تم إنشاؤها من الإعدادات</p>
            </div>
          </div>
        </Route>
      ))}
      <Route component={NotFound} />
    </Switch>
  );
}

function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState("");
  const [activePage, setActivePage] = useState("home");
  const { language, setLanguage } = useLanguage();
  const [customPages, setCustomPages] = useState([
    { id: "1", name: "ملفي الطبي", content: "معلومات صحتي الشاملة", icon: "Heart" },
    { id: "2", name: "تقاريري", content: "جميع التقارير الطبية", icon: "FileText" },
  ]);
  
  // Navigation History Management
  const [pageHistory, setPageHistory] = useState<string[]>(["home"]);
  const historyIndex = useRef(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (type: string, username: string) => {
    setUserType(type);
    setUserName(username || "مستخدم");
    setIsLoggedIn(true);
  };

  const handleNavigate = (page: string) => {
    // Prevent adding duplicate consecutive pages
    if (page === activePage) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setActivePage(page);
      setPageHistory([...pageHistory.slice(0, historyIndex.current + 1), page]);
      historyIndex.current = pageHistory.length;
      setIsLoading(false);
    }, 100);
  };

  const goBack = () => {
    if (historyIndex.current > 0) {
      setIsLoading(true);
      setTimeout(() => {
        historyIndex.current--;
        setActivePage(pageHistory[historyIndex.current]);
        setIsLoading(false);
      }, 100);
    }
  };

  const goHome = () => {
    handleNavigate("home");
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + ArrowLeft = Go Back
      if (e.altKey && e.key === "ArrowLeft") {
        e.preventDefault();
        goBack();
      }
      // Ctrl/Cmd + Home = Go to Home
      if ((e.ctrlKey || e.metaKey) && e.key === "Home") {
        e.preventDefault();
        goHome();
      }
      // Escape = Go Back
      if (e.key === "Escape" && activePage !== "home") {
        e.preventDefault();
        goBack();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePage, pageHistory, historyIndex]);

  const getBreadcrumbs = () => {
    const breadcrumbs = [{ name: "الرئيسية", path: "home" }];
    
    if (activePage.startsWith("clinic-")) {
      breadcrumbs.push({ name: "العيادات الطبية", path: "clinics" });
      const clinicId = activePage.replace("clinic-", "");
      const clinicNames: Record<string, string> = {
        diagnosis: "التشخيص والأشعة",
        conservative: "العلاج التحفظي",
        surgery: "جراحة الفم والفكين",
        removable: "التركيبات المتحركة",
        fixed: "التركيبات الثابتة",
        gums: "اللثة",
        "oral-surgery": "الجراحة",
        cosmetic: "تجميل الأسنان",
        implants: "زراعة الأسنان",
        orthodontics: "تقويم الأسنان",
        pediatric: "أسنان الأطفال",
      };
      breadcrumbs.push({ name: clinicNames[clinicId] || "العيادة", path: activePage });
    } else if (activePage === "treatment-plans") {
      breadcrumbs.push({ name: "الخطط العلاجية", path: activePage });
    } else if (activePage === "reports") {
      breadcrumbs.push({ name: "التقارير والإحصائيات", path: activePage });
    } else if (activePage === "dentocad") {
      breadcrumbs.push({ name: "Dentocad", path: activePage });
    } else if (activePage === "settings") {
      breadcrumbs.push({ name: "الإعدادات", path: activePage });
    } else if (activePage === "treatment-plan-detail") {
      breadcrumbs.push({ name: "الخطط العلاجية", path: "treatment-plans" });
      breadcrumbs.push({ name: "تفاصيل الخطة", path: activePage });
    } else if (activePage === "appointments") {
      breadcrumbs.push({ name: "حجز المواعيد", path: activePage });
    } else if (activePage === "doctors") {
      breadcrumbs.push({ name: "الأطباء", path: activePage });
    } else if (activePage === "medical-records") {
      breadcrumbs.push({ name: "السجل الطبي", path: activePage });
    } else if (activePage === "ratings") {
      breadcrumbs.push({ name: "التقييمات", path: activePage });
    } else if (activePage === "notifications") {
      breadcrumbs.push({ name: "الإشعارات", path: activePage });
    } else if (activePage === "search") {
      breadcrumbs.push({ name: "البحث", path: activePage });
    } else if (activePage === "payment") {
      breadcrumbs.push({ name: "الفواتير والدفع", path: activePage });
    } else if (activePage === "doctor-panel") {
      breadcrumbs.push({ name: "لوحة تحكم الطبيب", path: activePage });
    } else if (activePage === "admin-panel") {
      breadcrumbs.push({ name: "لوحة تحكم المسؤول", path: activePage });
    } else if (activePage === "support-tickets") {
      breadcrumbs.push({ name: "تذاكر الدعم", path: activePage });
    } else if (activePage === "financial") {
      breadcrumbs.push({ name: "الإدارة المالية", path: activePage });
    } else if (activePage === "chat") {
      breadcrumbs.push({ name: "Dento - مساعدك الطبي", path: activePage });
    } else if (activePage === "clinics") {
      breadcrumbs.push({ name: "العيادات الطبية", path: activePage });
    } else if (activePage === "ai-diagnosis") {
      breadcrumbs.push({ name: "التشخيص الذكي", path: activePage });
    }
    
    return breadcrumbs;
  };

  const [showSignUp, setShowSignUp] = useState(false);

  if (!isLoggedIn) {
    if (showSignUp) {
      return <SignUpPage 
        onSignUp={(userData) => {
          handleLogin(userData.userType, userData.fullName);
          setShowSignUp(false);
        }}
        onLoginClick={() => setShowSignUp(false)}
      />;
    }
    return <LoginPage onLogin={handleLogin} onSignUpClick={() => setShowSignUp(true)} />;
  }

  const style = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <SidebarProvider defaultOpen={false} style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar activePage={activePage} onNavigate={handleNavigate} customPages={customPages} />
        <div className="flex flex-col flex-1">
          {/* Header with Navigation Controls */}
          <header className="flex items-center justify-between p-4 border-b bg-card gap-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              
              {/* Back Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={goBack}
                disabled={historyIndex.current === 0}
                title="رجوع (Alt+←)"
                data-testid="button-back"
                className="transition-all hover-elevate"
              >
                <ArrowRight className="h-5 w-5" />
              </Button>

              {/* Home Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={goHome}
                title="الرئيسية (Ctrl+Home)"
                data-testid="button-home"
                className="transition-all hover-elevate"
              >
                <Home className="h-5 w-5" />
              </Button>
              
              {/* Breadcrumbs */}
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((crumb, index) => (
                    <div key={crumb.path} className="flex items-center">
                      {index > 0 && <BreadcrumbSeparator />}
                      <BreadcrumbItem>
                        {index === breadcrumbs.length - 1 ? (
                          <BreadcrumbPage className="font-semibold">{crumb.name}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink
                            className="cursor-pointer hover-elevate transition-all rounded px-2 py-1"
                            onClick={() => handleNavigate(crumb.path)}
                            data-testid={`breadcrumb-${crumb.path}`}
                          >
                            {crumb.name}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </div>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">{userName}</p>
                <p className="text-xs text-muted-foreground">
                  {userType === "patient" ? "مريض" : userType === "doctor" ? "طبيب" : userType === "student" ? "طالب" : "إمتياز"}
                </p>
              </div>
              <Avatar data-testid="avatar-user">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <LanguageToggle language={language} onLanguageChange={setLanguage} />
              <ThemeToggle />
            </div>
          </header>
          <main className={`flex-1 overflow-auto p-6 bg-slate-50 dark:bg-slate-900 ${isLoading ? 'opacity-50 pointer-events-none' : 'page-transition'}`}>
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3"></div>
                  <p className="text-muted-foreground">جاري التحميل...</p>
                </div>
              </div>
            ) : (
              <>
            {activePage === "home" && <HomePage userName={userName} userType={userType} onNavigate={handleNavigate} language={language} />}
            {activePage === "treatment-plans" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">الخطة العلاجية للمريض</h1>
                  <p className="text-slate-500 dark:text-slate-400">متابعة مراحل العلاج الخاصة بك</p>
                </div>
                <TreatmentPlanCard
                  patientName={userName}
                  planTitle="خطة علاج التسوس والتنظيف"
                  steps={[
                    {
                      id: "1",
                      title: "الفحص الأولي والأشعة",
                      description: "فحص شامل للفم والأسنان مع أخذ الأشعة اللازمة",
                      status: "completed",
                      date: "2025-10-15",
                    },
                    {
                      id: "2",
                      title: "تنظيف الأسنان وإزالة الجير",
                      description: "جلسة تنظيف عميق للأسنان وإزالة الجير والبلاك",
                      status: "in-progress",
                      date: "2025-10-28",
                    },
                    {
                      id: "3",
                      title: "حشو الضرس الأول",
                      description: "حشو تجميلي للضرس المصاب بالتسوس",
                      status: "pending",
                    },
                  ]}
                  onUpdateStep={(id) => console.log("تحديث الخطوة:", id)}
                  onViewDetails={() => handleNavigate("treatment-plan-detail")}
                />
              </div>
            )}
            {activePage === "dentocad" && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-12 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 max-w-md">
                  <div className="text-6xl mb-6">🦷</div>
                  <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Dentocad</h1>
                  <p className="text-xl text-teal-600 dark:text-teal-400 font-semibold mb-3">Coming Soon</p>
                  <p className="text-slate-500 dark:text-slate-400">نعمل على تطوير هذه الميزة. ترقبوا التحديثات القادمة!</p>
                </div>
              </div>
            )}
            {activePage === "treatment-plan-detail" && (
              <TreatmentPlanDetailPage onBackClick={() => handleNavigate("treatment-plans")} />
            )}
            {activePage === "appointments" && <AppointmentBookingPageNew />}
            {activePage === "doctors" && <DoctorManagementPage />}
            {activePage === "medical-records" && <MedicalRecordsPage />}
            {activePage === "ratings" && <RatingsPage />}
            {activePage === "notifications" && <NotificationsPage />}
            {activePage === "search" && <SearchPage />}
            {activePage === "payment" && <PaymentPageNew />}
            {activePage === "support-tickets" && <SupportTicketsPage />}
            {activePage === "financial" && <FinancialManagementPage />}
            {activePage === "reports" && <ReportsPage />}
            {activePage === "chat" && <ChatBotPage />}
            {activePage === "ai-diagnosis" && <AIDiagnosisPage />}
            {activePage === "clinics" && <ClinicsOverviewPage onNavigate={setActivePage} />}
            {activePage.startsWith("clinic-") && <ClinicDetailPageNew clinicId={activePage.replace("clinic-", "")} onNavigate={setActivePage} />}
            {!activePage.startsWith("home") && !activePage.startsWith("treatment-plan") && 
              !activePage.startsWith("dentocad") &&
              !activePage.startsWith("appointments") && !activePage.startsWith("doctors") &&
              !activePage.startsWith("medical-records") && !activePage.startsWith("ratings") &&
              !activePage.startsWith("notifications") && !activePage.startsWith("search") &&
              !activePage.startsWith("payment") && !activePage.startsWith("support-tickets") &&
              !activePage.startsWith("financial") && !activePage.startsWith("clinics") &&
              !activePage.startsWith("clinic-") && !activePage.startsWith("ai-diagnosis") &&
              !activePage.startsWith("reports") && !activePage.startsWith("chat") && (
              <Router userName={userName} userType={userType} customPages={customPages} setCustomPages={setCustomPages} language={language} />
            )}
            {userType === "patient" && <FloatingChatbot patientName={userName} />}
              </>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Dashboard />
          <Toaster />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
