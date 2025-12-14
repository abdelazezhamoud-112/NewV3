import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { 
  Camera, Mail, Phone, User, Clock, Bell, Lock, Shield, HelpCircle, LogOut, Edit2, Check, X,
  Smartphone, Activity, RotateCw, Download, Trash2, Pill, Heart, Calendar, CreditCard, MessageSquare,
  AlertCircle, Eye, Volume2, Palette, Settings2, Info, Zap, Send, Lightbulb, Accessibility,
  Smartphone as MobileIcon, Smartphone as DeviceIcon, Banknote, Stethoscope, TrendingUp, Star
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  bio: string;
  joinDate: string;
}

interface CustomPage {
  id: string;
  name: string;
  content: string;
  icon: string;
}

interface SettingsPageProps {
  customPages?: CustomPage[];
  setCustomPages?: (pages: CustomPage[]) => void;
}

export default function SettingsPage({ customPages: propCustomPages, setCustomPages: setPropCustomPages }: SettingsPageProps) {
  const [profile, setProfile] = useState<UserProfile>({
    name: "أحمد محمد علي",
    email: "ahmed.ali@example.com",
    phone: "+201001234567",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed",
    bio: "مريض مهتم بصحة الأسنان",
    joinDate: "2025-09-15",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(profile);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 2️⃣1️⃣ تحسينات الواجهة
  const [interfaceSettings, setInterfaceSettings] = useState({
    theme: "blue",
    highContrast: false,
    fontSize: "medium",
    fontFamily: "cairo",
    animationsEnabled: true,
  });

  // 2️⃣2️⃣ تحسينات الأداء
  const [performanceSettings, setPerformanceSettings] = useState({
    enableCache: true,
    dataCompression: true,
    reduceAnimations: false,
    loadOptimization: true,
  });

  // 2️⃣3️⃣ نظام الدعم والمساعدة
  const [supportChat, setSupportChat] = useState({
    isOpen: false,
    messages: [
      { id: "1", type: "bot", text: "مرحباً! كيف يمكنني مساعدتك؟" }
    ],
    newMessage: "",
  });

  // 2️⃣4️⃣ تطبيق الهاتف
  const [mobileSettings, setMobileSettings] = useState({
    notificationsEnabled: true,
    offlineMode: true,
    autoSync: true,
    darkMode: false,
  });

  // إعدادات مخصصة - يمكن الإضافة والحذف
  const [customSettings, setCustomSettings] = useState([
    { id: "1", name: "تذكيرات المواعيد", enabled: true },
    { id: "2", name: "إشعارات البريد الإلكتروني", enabled: true },
    { id: "3", name: "المزامنة التلقائية", enabled: false },
  ]);
  const [newSettingName, setNewSettingName] = useState("");

  // 2️⃣ إعدادات الإشعارات المتقدمة
  const [notificationSettings, setNotificationSettings] = useState({
    appointmentBefore: "24", // ساعات قبل الموعد
    billingNotifications: true,
    testResultsNotifications: true,
    doNotDisturbEnabled: true,
    doNotDisturbStart: "22:00",
    doNotDisturbEnd: "08:00",
  });

  // 3️⃣ إعدادات اللغة والتنسيق
  const [localizationSettings, setLocalizationSettings] = useState({
    language: "ar",
    dateFormat: "hijri",
    currency: "EGP",
  });

  // 4️⃣ إعدادات طبية شخصية
  const [medicalSettings, setMedicalSettings] = useState({
    allergies: "لا توجد",
    pastDiseases: "سكري من النوع 2",
    currentMedications: "الأنسولين، فيتامين D",
    medicalNotes: "حساس من المضادات الحيوية",
  });

  // 5️⃣ إعدادات الفواتير والدفع
  const [billingSettings, setBillingSettings] = useState({
    defaultPaymentMethod: "creditCard",
    billAddresses: [
      { id: "1", city: "القاهرة", street: "شارع النيل" }
    ],
    paymentOption: "installment", // فوري أو تقسيط
  });

  // 6️⃣ إعدادات البيانات والنسخ الاحتياطي
  const [backupSettings, setBackupSettings] = useState({
    autoBackupEnabled: true,
    backupFrequency: "weekly",
    lastBackup: "2025-11-23",
  });

  // 7️⃣ إعدادات التفضيلات الطبية
  const [preferenceSettings, setPreferenceSettings] = useState({
    favoriteDoctorId: "DR001",
    favoriteClinicId: "CLINIC01",
    preferredAppointmentTime: "morning",
  });

  // 8️⃣ إعدادات الحساب الأمان
  const [accountSettings, setAccountSettings] = useState({
    twoFactorEnabled: false,
    activeSessions: 2,
  });

  // 9️⃣ صفحات مخصصة - يمكن الإضافة والحذف
  const [customPages, setCustomPages] = useState(propCustomPages || [
    { id: "1", name: "ملفي الطبي", content: "معلومات صحتي الشاملة", icon: "Heart" },
    { id: "2", name: "تقاريري", content: "جميع التقارير الطبية", icon: "FileText" },
  ]);
  const [newPageName, setNewPageName] = useState("");
  const [newPageContent, setNewPageContent] = useState("");

  const handleUpdateCustomPages = (pages: CustomPage[]) => {
    setCustomPages(pages);
    setPropCustomPages?.(pages);
  };

  // بيانات الرسوم البيانية
  const performanceData = [
    { month: "يناير", سرعة: 95, استجابة: 92 },
    { month: "فبراير", سرعة: 98, استجابة: 95 },
    { month: "مارس", سرعة: 96, استجابة: 94 },
    { month: "أبريل", سرعة: 99, استجابة: 98 },
    { month: "مايو", سرعة: 97, استجابة: 96 },
  ];

  const usageData = [
    { name: "المواعيد", value: 35 },
    { name: "الفواتير", value: 25 },
    { name: "السجلات", value: 20 },
    { name: "أخرى", value: 20 },
  ];

  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

  const handleProfileUpdate = () => {
    setProfile(editForm);
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setEditForm({ ...editForm, avatar: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = () => {
    if (!supportChat.newMessage.trim()) return;
    
    const newMsg = {
      id: Date.now().toString(),
      type: "user",
      text: supportChat.newMessage
    };
    
    setSupportChat({
      ...supportChat,
      messages: [...supportChat.messages, newMsg],
      newMessage: ""
    });

    setTimeout(() => {
      setSupportChat(prev => ({
        ...prev,
        messages: [...prev.messages, {
          id: (Date.now() + 1).toString(),
          type: "bot",
          text: "شكراً على سؤالك! هل تحتاج إلى مساعدة إضافية؟"
        }]
      }));
    }, 1000);
  };

  const handleAddCustomSetting = () => {
    if (!newSettingName.trim()) return;
    
    const newSetting = {
      id: Date.now().toString(),
      name: newSettingName,
      enabled: true
    };
    
    setCustomSettings([...customSettings, newSetting]);
    setNewSettingName("");
  };

  const handleDeleteCustomSetting = (id: string) => {
    setCustomSettings(customSettings.filter(setting => setting.id !== id));
  };

  const handleToggleCustomSetting = (id: string) => {
    setCustomSettings(customSettings.map(setting =>
      setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
    ));
  };

  const handleAddCustomPage = () => {
    if (!newPageName.trim() || !newPageContent.trim()) return;
    
    const newPage = {
      id: Date.now().toString(),
      name: newPageName,
      content: newPageContent,
      icon: "Settings2"
    };
    
    handleUpdateCustomPages([...customPages, newPage]);
    setNewPageName("");
    setNewPageContent("");
  };

  const handleDeleteCustomPage = (id: string) => {
    handleUpdateCustomPages(customPages.filter(page => page.id !== id));
  };

  const themes = [
    { name: "أزرق طبي", value: "blue", color: "#3b82f6" },
    { name: "أخضر", value: "green", color: "#10b981" },
    { name: "بنفسجي", value: "purple", color: "#8b5cf6" },
    { name: "برتقالي", value: "orange", color: "#f97316" },
  ];

  return (
    <div className="space-y-6 pb-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">الإعدادات المتقدمة</h1>
        <p className="text-muted-foreground text-lg">تخصيص التطبيق حسب احتياجاتك</p>
      </div>

      {/* صورة البروفايل */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            صورة البروفايل
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={isEditing ? editForm.avatar : profile.avatar} />
              <AvatarFallback>أ.م</AvatarFallback>
            </Avatar>
            <div className="space-y-2 flex-1">
              <p className="text-sm text-muted-foreground">الصورة الحالية</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                data-testid="input-profile-image"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                data-testid="button-change-image"
              >
                <Camera className="h-4 w-4 mr-2" />
                تغيير الصورة
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* بيانات الحساب */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <User className="h-5 w-5" />
              بيانات الحساب
            </span>
            {!isEditing && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditForm(profile);
                  setIsEditing(true);
                }}
                data-testid="button-edit-profile"
              >
                <Edit2 className="h-4 w-4 mr-1" />
                تعديل
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <>
              <div className="space-y-2">
                <label className="text-sm font-semibold">الاسم</label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  data-testid="input-name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">البريد الإلكتروني</label>
                <Input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  data-testid="input-email"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">رقم الهاتف</label>
                <Input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  data-testid="input-phone"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleProfileUpdate} className="flex-1" data-testid="button-save-profile">
                  <Check className="h-4 w-4 mr-1" />
                  حفظ
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setIsEditing(false)} data-testid="button-cancel-edit">
                  <X className="h-4 w-4 mr-1" />
                  إلغاء
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div><p className="text-sm text-muted-foreground">الاسم</p><p className="font-semibold">{profile.name}</p></div>
              <div><p className="text-sm text-muted-foreground flex items-center gap-2"><Mail className="h-4 w-4" />البريد الإلكتروني</p><p className="font-semibold">{profile.email}</p></div>
              <div><p className="text-sm text-muted-foreground flex items-center gap-2"><Phone className="h-4 w-4" />رقم الهاتف</p><p className="font-semibold">{profile.phone}</p></div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Accordion جميع الإعدادات المتقدمة */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            الإعدادات المتقدمة
          </CardTitle>
          <CardDescription>جميع خيارات التخصيص والأداء والدعم</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            
            {/* 2️⃣1️⃣ تحسينات الواجهة */}
            <AccordionItem value="interface" data-testid="accordion-interface">
              <AccordionTrigger className="hover-elevate" data-testid="trigger-interface">
                <div className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  <span className="font-semibold">تحسينات الواجهة 🎨</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-6 pt-4">
                {/* اختيار الثيم */}
                <div>
                  <p className="font-semibold mb-3">اختر ثيم الألوان</p>
                  <div className="grid grid-cols-2 gap-3">
                    {themes.map(theme => (
                      <button
                        key={theme.value}
                        onClick={() => setInterfaceSettings({ ...interfaceSettings, theme: theme.value })}
                        className={`p-4 border-2 rounded-lg transition ${
                          interfaceSettings.theme === theme.value
                            ? "border-primary bg-primary/10"
                            : "border-gray-300 dark:border-gray-700"
                        }`}
                        data-testid={`button-theme-${theme.value}`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.color }}></div>
                          <span>{theme.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* وضع عالي التباين */}
                <div className="p-4 border rounded-lg hover-elevate">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Accessibility className="h-4 w-4" />
                      <div>
                        <p className="font-semibold">وضع عالي التباين</p>
                        <p className="text-sm text-muted-foreground">للرؤية الأوضح</p>
                      </div>
                    </div>
                    <Switch
                      checked={interfaceSettings.highContrast}
                      onCheckedChange={() => setInterfaceSettings({ ...interfaceSettings, highContrast: !interfaceSettings.highContrast })}
                      data-testid="toggle-high-contrast"
                    />
                  </div>
                </div>

                {/* حجم الخط */}
                <div>
                  <label className="text-sm font-semibold mb-2 block">حجم الخط</label>
                  <select
                    value={interfaceSettings.fontSize}
                    onChange={(e) => setInterfaceSettings({ ...interfaceSettings, fontSize: e.target.value })}
                    className="w-full p-2 border rounded-lg dark:bg-secondary"
                    data-testid="select-font-size"
                  >
                    <option value="small">صغير</option>
                    <option value="medium">متوسط</option>
                    <option value="large">كبير</option>
                  </select>
                </div>

                {/* تفعيل/تعطيل الرسوم المتحركة */}
                <div className="p-4 border rounded-lg hover-elevate">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">الرسوم المتحركة</p>
                      <p className="text-sm text-muted-foreground">تأثيرات سلسة</p>
                    </div>
                    <Switch
                      checked={interfaceSettings.animationsEnabled}
                      onCheckedChange={() => setInterfaceSettings({ ...interfaceSettings, animationsEnabled: !interfaceSettings.animationsEnabled })}
                      data-testid="toggle-animations"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 2️⃣2️⃣ تحسينات الأداء */}
            <AccordionItem value="performance" data-testid="accordion-performance">
              <AccordionTrigger className="hover-elevate" data-testid="trigger-performance">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  <span className="font-semibold">تحسينات الأداء ⚡</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                {/* الرسم البياني */}
                <div>
                  <p className="font-semibold mb-4">أداء النظام</p>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="سرعة" stroke="#3b82f6" />
                      <Line type="monotone" dataKey="استجابة" stroke="#10b981" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* خيارات الأداء */}
                <div className="space-y-3 mt-6">
                  <div className="p-4 border rounded-lg hover-elevate">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">التخزين المؤقت</p>
                        <p className="text-sm text-muted-foreground">تحسين السرعة</p>
                      </div>
                      <Switch
                        checked={performanceSettings.enableCache}
                        onCheckedChange={() => setPerformanceSettings({ ...performanceSettings, enableCache: !performanceSettings.enableCache })}
                        data-testid="toggle-cache"
                      />
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg hover-elevate">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">ضغط البيانات</p>
                        <p className="text-sm text-muted-foreground">تقليل حجم البيانات</p>
                      </div>
                      <Switch
                        checked={performanceSettings.dataCompression}
                        onCheckedChange={() => setPerformanceSettings({ ...performanceSettings, dataCompression: !performanceSettings.dataCompression })}
                        data-testid="toggle-compression"
                      />
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg hover-elevate">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">تحسين التحميل</p>
                        <p className="text-sm text-muted-foreground">تحميل أسرع</p>
                      </div>
                      <Switch
                        checked={performanceSettings.loadOptimization}
                        onCheckedChange={() => setPerformanceSettings({ ...performanceSettings, loadOptimization: !performanceSettings.loadOptimization })}
                        data-testid="toggle-load-optimization"
                      />
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 2️⃣3️⃣ نظام الدعم والمساعدة */}
            <AccordionItem value="support" data-testid="accordion-support">
              <AccordionTrigger className="hover-elevate" data-testid="trigger-support">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  <span className="font-semibold">نظام الدعم 24/7 🆘</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                {/* رسائل المحادثة */}
                <div className="border rounded-lg p-4 bg-muted/50 h-64 overflow-y-auto space-y-3">
                  {supportChat.messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-xs p-3 rounded-lg ${
                        msg.type === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }`}>
                        <p className="text-sm">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* حقل الإدخال */}
                <div className="flex gap-2">
                  <Input
                    placeholder="اكتب رسالتك..."
                    value={supportChat.newMessage}
                    onChange={(e) => setSupportChat({ ...supportChat, newMessage: e.target.value })}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    data-testid="input-support-message"
                  />
                  <Button onClick={handleSendMessage} size="icon" data-testid="button-send-support-message">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                {/* خيارات الدعم */}
                <div className="grid grid-cols-2 gap-2 mt-6">
                  <Button variant="outline" className="w-full" data-testid="button-faq">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    الأسئلة الشائعة
                  </Button>
                  <Button variant="outline" className="w-full" data-testid="button-contact-support">
                    <Phone className="h-4 w-4 mr-2" />
                    اتصل بنا
                  </Button>
                </div>

                {/* استخدام التطبيق */}
                <div className="mt-6">
                  <p className="font-semibold mb-4">استخدام التطبيق</p>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={usageData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {usageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 2️⃣4️⃣ تطبيق الهاتف */}
            <AccordionItem value="mobile" data-testid="accordion-mobile">
              <AccordionTrigger className="hover-elevate" data-testid="trigger-mobile">
                <div className="flex items-center gap-2">
                  <MobileIcon className="h-5 w-5" />
                  <span className="font-semibold">تطبيق الهاتف 📱</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                {/* iOS */}
                <div className="p-4 border rounded-lg hover-elevate">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded flex items-center justify-center">
                        <Info className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold">iOS</p>
                        <p className="text-sm text-muted-foreground">iPhone و iPad</p>
                      </div>
                    </div>
                    <Badge>متاح</Badge>
                  </div>
                  <Button size="sm" variant="outline" className="w-full" data-testid="button-download-ios">
                    <Download className="h-4 w-4 mr-2" />
                    تحميل من App Store
                  </Button>
                </div>

                {/* Android */}
                <div className="p-4 border rounded-lg hover-elevate">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-300 dark:bg-green-700 rounded flex items-center justify-center">
                        <Info className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold">Android</p>
                        <p className="text-sm text-muted-foreground">هواتف Android</p>
                      </div>
                    </div>
                    <Badge>متاح</Badge>
                  </div>
                  <Button size="sm" variant="outline" className="w-full" data-testid="button-download-android">
                    <Download className="h-4 w-4 mr-2" />
                    تحميل من Play Store
                  </Button>
                </div>

                {/* خيارات التطبيق */}
                <div className="space-y-3 mt-6">
                  <div className="p-4 border rounded-lg hover-elevate">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">الإشعارات الفورية</p>
                        <p className="text-sm text-muted-foreground">احصل على تنبيهات فوراً</p>
                      </div>
                      <Switch
                        checked={mobileSettings.notificationsEnabled}
                        onCheckedChange={() => setMobileSettings({ ...mobileSettings, notificationsEnabled: !mobileSettings.notificationsEnabled })}
                        data-testid="toggle-mobile-notifications"
                      />
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg hover-elevate">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">الوضع بدون إنترنت</p>
                        <p className="text-sm text-muted-foreground">استخدم التطبيق بدون إنترنت</p>
                      </div>
                      <Switch
                        checked={mobileSettings.offlineMode}
                        onCheckedChange={() => setMobileSettings({ ...mobileSettings, offlineMode: !mobileSettings.offlineMode })}
                        data-testid="toggle-offline-mode"
                      />
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg hover-elevate">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">المزامنة التلقائية</p>
                        <p className="text-sm text-muted-foreground">مزامنة تلقائية مع الويب</p>
                      </div>
                      <Switch
                        checked={mobileSettings.autoSync}
                        onCheckedChange={() => setMobileSettings({ ...mobileSettings, autoSync: !mobileSettings.autoSync })}
                        data-testid="toggle-auto-sync"
                      />
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg hover-elevate">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">الوضع الليلي</p>
                        <p className="text-sm text-muted-foreground">وضع مريح للعيون</p>
                      </div>
                      <Switch
                        checked={mobileSettings.darkMode}
                        onCheckedChange={() => setMobileSettings({ ...mobileSettings, darkMode: !mobileSettings.darkMode })}
                        data-testid="toggle-mobile-dark-mode"
                      />
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 2️⃣ إعدادات الإشعارات المتقدمة */}
            <AccordionItem value="notifications" data-testid="accordion-notifications">
              <AccordionTrigger className="hover-elevate" data-testid="trigger-notifications">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  <span className="font-semibold">إعدادات الإشعارات المتقدمة 🔔</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">تنبيهات المواعيد (قبل كم ساعة)</label>
                    <select value={notificationSettings.appointmentBefore} onChange={(e) => setNotificationSettings({...notificationSettings, appointmentBefore: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-secondary" data-testid="select-appointment-before">
                      <option value="1">ساعة واحدة</option>
                      <option value="6">6 ساعات</option>
                      <option value="12">12 ساعة</option>
                      <option value="24">24 ساعة</option>
                      <option value="48">48 ساعة</option>
                    </select>
                  </div>

                  <div className="p-4 border rounded-lg hover-elevate">
                    <div className="flex items-center justify-between">
                      <div><p className="font-semibold">إشعارات الفواتير والدفع</p></div>
                      <Switch checked={notificationSettings.billingNotifications} onCheckedChange={() => setNotificationSettings({...notificationSettings, billingNotifications: !notificationSettings.billingNotifications})} data-testid="toggle-billing-notifications" />
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg hover-elevate">
                    <div className="flex items-center justify-between">
                      <div><p className="font-semibold">إشعارات نتائج الفحوصات</p></div>
                      <Switch checked={notificationSettings.testResultsNotifications} onCheckedChange={() => setNotificationSettings({...notificationSettings, testResultsNotifications: !notificationSettings.testResultsNotifications})} data-testid="toggle-test-results" />
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg hover-elevate">
                    <div className="flex items-center justify-between mb-3">
                      <div><p className="font-semibold">عدم الإزعاج</p></div>
                      <Switch checked={notificationSettings.doNotDisturbEnabled} onCheckedChange={() => setNotificationSettings({...notificationSettings, doNotDisturbEnabled: !notificationSettings.doNotDisturbEnabled})} data-testid="toggle-do-not-disturb" />
                    </div>
                    {notificationSettings.doNotDisturbEnabled && (
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                        <div>
                          <label className="text-xs font-semibold">من</label>
                          <Input type="time" value={notificationSettings.doNotDisturbStart} onChange={(e) => setNotificationSettings({...notificationSettings, doNotDisturbStart: e.target.value})} data-testid="input-dnd-start" />
                        </div>
                        <div>
                          <label className="text-xs font-semibold">إلى</label>
                          <Input type="time" value={notificationSettings.doNotDisturbEnd} onChange={(e) => setNotificationSettings({...notificationSettings, doNotDisturbEnd: e.target.value})} data-testid="input-dnd-end" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 3️⃣ إعدادات اللغة والتنسيق */}
            <AccordionItem value="localization" data-testid="accordion-localization">
              <AccordionTrigger className="hover-elevate" data-testid="trigger-localization">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  <span className="font-semibold">إعدادات اللغة والتنسيق 🌍</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-semibold mb-2 block">اللغة</label>
                  <select value={localizationSettings.language} onChange={(e) => setLocalizationSettings({...localizationSettings, language: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-secondary" data-testid="select-language">
                    <option value="ar">العربية</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">تنسيق التاريخ</label>
                  <select value={localizationSettings.dateFormat} onChange={(e) => setLocalizationSettings({...localizationSettings, dateFormat: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-secondary" data-testid="select-date-format">
                    <option value="hijri">هجري (1446)</option>
                    <option value="gregorian">ميلادي (2025)</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">العملة</label>
                  <select value={localizationSettings.currency} onChange={(e) => setLocalizationSettings({...localizationSettings, currency: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-secondary" data-testid="select-currency">
                    <option value="EGP">جنيه مصري (ج.م)</option>
                    <option value="USD">دولار أمريكي (USD)</option>
                  </select>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 4️⃣ إعدادات طبية شخصية */}
            <AccordionItem value="medical" data-testid="accordion-medical">
              <AccordionTrigger className="hover-elevate" data-testid="trigger-medical">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  <span className="font-semibold">إعدادات طبية شخصية 🏥</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-semibold mb-2 block">الحساسيات المعروفة</label>
                  <Textarea value={medicalSettings.allergies} onChange={(e) => setMedicalSettings({...medicalSettings, allergies: e.target.value})} placeholder="أدرج الحساسيات..." data-testid="textarea-allergies" />
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">الأمراض السابقة</label>
                  <Textarea value={medicalSettings.pastDiseases} onChange={(e) => setMedicalSettings({...medicalSettings, pastDiseases: e.target.value})} placeholder="أدرج الأمراض السابقة..." data-testid="textarea-past-diseases" />
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">الأدوية الحالية</label>
                  <Textarea value={medicalSettings.currentMedications} onChange={(e) => setMedicalSettings({...medicalSettings, currentMedications: e.target.value})} placeholder="أدرج الأدوية الحالية..." data-testid="textarea-medications" />
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">ملاحظات طبية مهمة</label>
                  <Textarea value={medicalSettings.medicalNotes} onChange={(e) => setMedicalSettings({...medicalSettings, medicalNotes: e.target.value})} placeholder="أي ملاحظات طبية مهمة..." data-testid="textarea-medical-notes" />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 6️⃣ إعدادات البيانات والنسخ الاحتياطي */}
            <AccordionItem value="backup" data-testid="accordion-backup">
              <AccordionTrigger className="hover-elevate" data-testid="trigger-backup">
                <div className="flex items-center gap-2">
                  <RotateCw className="h-5 w-5" />
                  <span className="font-semibold">إعدادات البيانات والنسخ الاحتياطي 📁</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="p-4 border rounded-lg hover-elevate">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">النسخ الاحتياطي التلقائي</p>
                      <p className="text-sm text-muted-foreground">آخر نسخة: {backupSettings.lastBackup}</p>
                    </div>
                    <Switch checked={backupSettings.autoBackupEnabled} onCheckedChange={() => setBackupSettings({...backupSettings, autoBackupEnabled: !backupSettings.autoBackupEnabled})} data-testid="toggle-auto-backup" />
                  </div>
                </div>

                {backupSettings.autoBackupEnabled && (
                  <div>
                    <label className="text-sm font-semibold mb-2 block">تكرار النسخ الاحتياطية</label>
                    <select value={backupSettings.backupFrequency} onChange={(e) => setBackupSettings({...backupSettings, backupFrequency: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-secondary" data-testid="select-backup-frequency">
                      <option value="daily">يومي</option>
                      <option value="weekly">أسبوعي</option>
                      <option value="monthly">شهري</option>
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2 pt-4">
                  <Button variant="outline" className="w-full" data-testid="button-download-records">
                    <Download className="h-4 w-4 mr-2" />
                    تنزيل السجلات
                  </Button>
                  <Button variant="outline" className="w-full" data-testid="button-export-invoices">
                    <Download className="h-4 w-4 mr-2" />
                    تصدير الفواتير
                  </Button>
                  <Button variant="outline" className="w-full" data-testid="button-backup-now">
                    <RotateCw className="h-4 w-4 mr-2" />
                    نسخة الآن
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 7️⃣ إعدادات التفضيلات الطبية */}
            <AccordionItem value="preferences" data-testid="accordion-preferences">
              <AccordionTrigger className="hover-elevate" data-testid="trigger-preferences">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  <span className="font-semibold">إعدادات التفضيلات الطبية ⭐</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-semibold mb-2 block">الطبيب المفضل</label>
                  <Input placeholder="د. أحمد محمد" value={preferenceSettings.favoriteDoctorId} disabled className="bg-muted" data-testid="input-favorite-doctor" />
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">العيادة المفضلة</label>
                  <Input placeholder="عيادة طب الأسنان التحفظي" value={preferenceSettings.favoriteClinicId} disabled className="bg-muted" data-testid="input-favorite-clinic" />
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">وقت المواعيد المفضل</label>
                  <select value={preferenceSettings.preferredAppointmentTime} onChange={(e) => setPreferenceSettings({...preferenceSettings, preferredAppointmentTime: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-secondary" data-testid="select-preferred-time">
                    <option value="morning">الصباح (8:00 - 12:00)</option>
                    <option value="afternoon">بعد الظهر (12:00 - 17:00)</option>
                    <option value="evening">المساء (17:00 - 21:00)</option>
                  </select>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 8️⃣ إعدادات الحساب */}
            <AccordionItem value="account-security" data-testid="accordion-account-security">
              <AccordionTrigger className="hover-elevate" data-testid="trigger-account-security">
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  <span className="font-semibold">إعدادات الحساب والأمان 👤</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="p-4 border rounded-lg hover-elevate">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">المصادقة الثنائية</p>
                      <p className="text-sm text-muted-foreground">حماية إضافية للحساب</p>
                    </div>
                    <Switch checked={accountSettings.twoFactorEnabled} onCheckedChange={() => setAccountSettings({...accountSettings, twoFactorEnabled: !accountSettings.twoFactorEnabled})} data-testid="toggle-two-factor" />
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <p className="font-semibold mb-3">الجلسات النشطة</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>عدد الأجهزة المتصلة: {accountSettings.activeSessions}</span>
                      <Badge>نشط</Badge>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full" data-testid="button-sign-out-all">
                  <LogOut className="h-4 w-4 mr-2" />
                  تسجيل الخروج من جميع الأجهزة
                </Button>
              </AccordionContent>
            </AccordionItem>

            {/* 9️⃣ صفحات مخصصة */}
            <AccordionItem value="custom-pages" data-testid="accordion-custom-pages">
              <AccordionTrigger className="hover-elevate" data-testid="trigger-custom-pages">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  <span className="font-semibold">صفحات مخصصة 📄</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                {/* إضافة صفحة جديدة */}
                <div className="p-4 border rounded-lg bg-muted/50 space-y-3">
                  <label className="text-sm font-semibold block">إضافة صفحة جديدة</label>
                  <Input
                    placeholder="اسم الصفحة (مثل: ملفي الطبي)..."
                    value={newPageName}
                    onChange={(e) => setNewPageName(e.target.value)}
                    data-testid="input-new-page-name"
                  />
                  <Textarea
                    placeholder="محتوى الصفحة (وصف مختصر)..."
                    value={newPageContent}
                    onChange={(e) => setNewPageContent(e.target.value)}
                    data-testid="textarea-new-page-content"
                  />
                  <Button 
                    onClick={handleAddCustomPage}
                    className="w-full"
                    data-testid="button-add-page"
                  >
                    إضافة الصفحة
                  </Button>
                </div>

                {/* قائمة الصفحات المخصصة */}
                <div className="space-y-2">
                  {customPages.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">لم تضف أي صفحات حتى الآن</p>
                  ) : (
                    customPages.map(page => (
                      <div key={page.id} className="p-4 border rounded-lg hover-elevate">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex-1">
                            <p className="font-semibold text-base">{page.name}</p>
                            <p className="text-sm text-muted-foreground">{page.content}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteCustomPage(page.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 flex-shrink-0"
                            data-testid={`button-delete-page-${page.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <Badge variant="outline" data-testid={`badge-page-status-${page.id}`}>
                          ✓ ستظهر في القائمة
                        </Badge>
                      </div>
                    ))
                  )}
                </div>

                {customPages.length > 0 && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">📌 الصفحات المضافة:</p>
                    <ul className="text-sm space-y-1 text-blue-800 dark:text-blue-200">
                      {customPages.map(page => (
                        <li key={page.id}>✓ {page.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* 2️⃣5️⃣ الإعدادات المخصصة */}
            <AccordionItem value="custom" data-testid="accordion-custom">
              <AccordionTrigger className="hover-elevate" data-testid="trigger-custom">
                <div className="flex items-center gap-2">
                  <Settings2 className="h-5 w-5" />
                  <span className="font-semibold">إعدادات مخصصة ⚙️</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                {/* إضافة إعداد جديد */}
                <div className="p-4 border rounded-lg bg-muted/50">
                  <label className="text-sm font-semibold mb-2 block">إضافة إعداد جديد</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="اسم الإعداد الجديد..."
                      value={newSettingName}
                      onChange={(e) => setNewSettingName(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddCustomSetting()}
                      data-testid="input-new-setting"
                    />
                    <Button 
                      onClick={handleAddCustomSetting}
                      data-testid="button-add-setting"
                    >
                      إضافة
                    </Button>
                  </div>
                </div>

                {/* قائمة الإعدادات المخصصة */}
                <div className="space-y-2">
                  {customSettings.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">لم تضف أي إعدادات حتى الآن</p>
                  ) : (
                    customSettings.map(setting => (
                      <div key={setting.id} className="p-4 border rounded-lg hover-elevate flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <Switch
                            checked={setting.enabled}
                            onCheckedChange={() => handleToggleCustomSetting(setting.id)}
                            data-testid={`toggle-setting-${setting.id}`}
                          />
                          <span className={setting.enabled ? "font-semibold" : "font-semibold text-muted-foreground"}>
                            {setting.name}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteCustomSetting(setting.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                          data-testid={`button-delete-setting-${setting.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>

                {/* إحصائيات الإعدادات */}
                {customSettings.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 pt-4 border-t">
                    <div className="p-3 bg-primary/10 rounded-lg text-center">
                      <p className="text-2xl font-bold text-primary">{customSettings.filter(s => s.enabled).length}</p>
                      <p className="text-xs text-muted-foreground">مفعل</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg text-center">
                      <p className="text-2xl font-bold">{customSettings.filter(s => !s.enabled).length}</p>
                      <p className="text-xs text-muted-foreground">معطل</p>
                    </div>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </CardContent>
      </Card>

      {/* زر الأمان والخروج */}
      <Card className="border-red-200 dark:border-red-900">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            الأمان والخروج
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full" data-testid="button-change-password">
            <Lock className="h-4 w-4 mr-2" />
            تغيير كلمة المرور
          </Button>
          <Button variant="destructive" className="w-full" data-testid="button-logout">
            <LogOut className="h-4 w-4 mr-2" />
            تسجيل الخروج
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
