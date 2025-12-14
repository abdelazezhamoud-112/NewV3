import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { UserCircle, GraduationCap, Users, Stethoscope, LogIn, Globe, Moon, Sun, Volume2, Eye, EyeOff, AlertTriangle, CheckCircle, Zap, Check, X, HelpCircle, ShieldAlert, Clock, Lock, UserPlus, Apple } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import loginBg from "@assets/stock_images/modern_dental_hospit_e3518571.jpg";

interface LoginPageProps {
  onLogin?: (userType: string, username: string) => void;
  onSignUpClick?: () => void;
}

export default function LoginPage({ onLogin, onSignUpClick }: LoginPageProps) {
  const [userType, setUserType] = useState<string>("patient");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [language, setLanguage] = useState<"ar" | "en">("ar");
  const [isDark, setIsDark] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [passwordStrength, setPasswordStrength] = useState<"weak" | "medium" | "strong">("weak");
  const [rememberMe, setRememberMe] = useState(false);
  const [usernameValid, setUsernameValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [showShake, setShowShake] = useState(false);
  const [enable2FA, setEnable2FA] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [sessionTimeout, setSessionTimeout] = useState(false);

  // Load remember me data on mount
  useEffect(() => {
    const saved = localStorage.getItem("dentoRememberedUser");
    if (saved) {
      setUsername(saved);
      setRememberMe(true);
    }
  }, []);

  // Calculate password strength
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return "weak";
    if (pwd.length < 8) return "weak";
    if (/^[a-z]+$|^[0-9]+$|^[A-Z]+$/.test(pwd)) return "medium";
    return "strong";
  };

  const checkPasswordRequirements = (pwd: string) => {
    return {
      minLength: pwd.length >= 8,
      hasUpperCase: /[A-Z]/.test(pwd),
      hasLowerCase: /[a-z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      hasSpecial: /[!@#$%^&*]/.test(pwd),
    };
  };

  const passwordReqs = checkPasswordRequirements(password);
  const inputBgColor = password ? (
    passwordStrength === "weak" ? "bg-red-50 dark:bg-red-950/20" :
    passwordStrength === "medium" ? "bg-yellow-50 dark:bg-yellow-950/20" :
    "bg-green-50 dark:bg-green-950/20"
  ) : "bg-white dark:bg-slate-900";

  useEffect(() => {
    setPasswordStrength(getPasswordStrength(password));
    setPasswordValid(password.length >= 6 && /[A-Z]/.test(password) && /[0-9]/.test(password));
  }, [password]);

  useEffect(() => {
    setUsernameValid(username.trim().length >= 3);
  }, [username]);

  const isAccountLocked = failedAttempts >= 5;

  // Shake animation on error
  const triggerShake = () => {
    setShowShake(true);
    setTimeout(() => setShowShake(false), 500);
  };

  // Load demo account
  const loadDemoAccount = (type: string) => {
    const demos: { [key: string]: { username: string; password: string } } = {
      patient: { username: "patient123", password: "Patient@123" },
      doctor: { username: "doctor456", password: "Doctor@456" },
      student: { username: "student789", password: "Student@789" },
      graduate: { username: "intern2024", password: "Intern@2024" },
    };
    const demo = demos[type];
    if (demo) {
      setUsername(demo.username);
      setPassword(demo.password);
      setUserType(type);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isAccountLocked) {
      setErrors({ 
        username: language === "ar" 
          ? "الحساب مقفل لأسباب أمان. يرجى المحاولة بعد 15 دقيقة" 
          : "Account locked for security. Try again later"
      });
      triggerShake();
      return;
    }

    const newErrors: { username?: string; password?: string } = {};
    
    if (!username.trim()) {
      newErrors.username = language === "ar" ? "اسم المستخدم مطلوب" : "Username is required";
    }
    
    if (!password.trim()) {
      newErrors.password = language === "ar" ? "كلمة المرور مطلوبة" : "Password is required";
    } else if (password.length < 6) {
      newErrors.password = language === "ar" 
        ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل" 
        : "Password must be at least 6 characters";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setFailedAttempts(prev => prev + 1);
      triggerShake();
      return;
    }
    
    if (rememberMe) {
      localStorage.setItem("dentoRememberedUser", username);
    } else {
      localStorage.removeItem("dentoRememberedUser");
    }

    setIsLoading(true);
    setErrors({});
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ 
          username: data.message || (language === "ar" ? "خطأ في تسجيل الدخول" : "Login error") 
        });
        setFailedAttempts(prev => prev + 1);
        triggerShake();
        setIsLoading(false);
        return;
      }

      localStorage.setItem('dentoUser', JSON.stringify(data));
      
      if (onLogin) {
        onLogin(data.userType || userType, data.username);
      }
    } catch (error) {
      setErrors({ 
        username: language === "ar" ? "حدث خطأ في الاتصال بالخادم" : "Server connection error" 
      });
      triggerShake();
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (focusedField === "username") {
        passwordRef.current?.focus();
      } else if (focusedField === "password") {
        handleSubmit(e as any);
      }
    }
  };

  const userTypes = [
    { value: "patient", label: "مريض", icon: UserCircle },
    { value: "doctor", label: "طبيب", icon: Stethoscope },
    { value: "student", label: "طالب", icon: GraduationCap },
    { value: "graduate", label: "إمتياز", icon: Users },
  ];

  const translations = {
    ar: {
      title: "Dento Health Care",
      subtitle: "مستشفى طب الفم والأسنان بجامعة الدلتا للعلوم والتكنولوجيا",
      userType: "نوع المستخدم",
      patient: "مريض",
      doctor: "طبيب",
      student: "طالب",
      graduate: "إمتياز",
      username: "اسم المستخدم",
      password: "كلمة المرور",
      login: "تسجيل الدخول",
      forgotPassword: "نسيت كلمة المرور؟",
      rememberMe: "تذكرني",
      demoAccounts: "حسابات تجريبية",
      enable2FA: "تفعيل المصادقة الثنائية",
      signUp: "إنشاء حساب جديد",
      socialLogin: "أو سجل الدخول عبر",
      clearForm: "مسح",
      passwordRequirements: "متطلبات كلمة المرور:",
      sessionTimeout: "انتهت جلسة الاتصال. الرجاء تسجيل الدخول مرة أخرى",
    },
    en: {
      title: "Dento Health Care",
      subtitle: "Faculty of Dentistry Hospital - Delta University of Science and Technology",
      userType: "User Type",
      patient: "Patient",
      doctor: "Doctor",
      student: "Student",
      graduate: "Excellence",
      username: "Username",
      password: "Password",
      login: "Sign In",
      forgotPassword: "Forgot Password?",
      rememberMe: "Remember me",
      demoAccounts: "Demo Accounts",
      enable2FA: "Enable Two-Factor Auth",
      signUp: "Create New Account",
      socialLogin: "Or sign in with",
      clearForm: "Clear",
      passwordRequirements: "Password Requirements:",
      sessionTimeout: "Session timeout. Please login again",
    },
  };

  const t = translations[language];

  return (
    <div className={`min-h-screen flex items-center justify-center relative overflow-hidden dental-pattern ${showShake ? "animate-pulse" : ""}`}>
      {/* Decorative background elements */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${loginBg})` }}
        >
          <div className="absolute inset-0 dental-gradient opacity-95"></div>
        </div>
        
        {/* Animated decorative circles */}
        <motion.div
          className="absolute top-10 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
          animate={{ x: [0, 20, 0], y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl"
          animate={{ x: [0, -20, 0], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, delay: 0.5 }}
        />
      </div>

      {/* Top Controls */}
      <div className="absolute top-4 left-4 z-20 flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => { setIsDark(!isDark); document.documentElement.classList.toggle("dark"); }}
          className="bg-white/20 hover:bg-white/30 text-white rounded-full"
          data-testid="button-toggle-theme"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
          className="bg-white/20 hover:bg-white/30 text-white rounded-full"
          data-testid="button-toggle-language"
        >
          <Globe className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            if ('speechSynthesis' in window) {
              const text = language === "ar" ? "مرحبا بك في تطبيق دينتو هيلث كير" : "Welcome to Dento Health Care";
              const utterance = new SpeechSynthesisUtterance(text);
              utterance.lang = language === "ar" ? "ar-SA" : "en-US";
              window.speechSynthesis.speak(utterance);
            }
          }}
          className="bg-white/20 hover:bg-white/30 text-white rounded-full"
          data-testid="button-text-to-speech"
        >
          <Volume2 className="w-5 h-5" />
        </Button>
      </div>

      {/* Main Form Container */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`w-full max-w-md mx-4 relative z-10 ${language === "en" ? "ltr" : "rtl"}`}
        dir={language === "en" ? "ltr" : "rtl"}
      >
        <Card className="shadow-2xl backdrop-blur-md border border-white/20 dark:border-white/10 bg-white/95 dark:bg-slate-950/80">
          <CardHeader className="text-center space-y-2 pb-6 bg-gradient-to-b from-primary/5 to-transparent dark:from-primary/10">
            <CardTitle className="text-3xl font-bold text-primary">{t.title}</CardTitle>
            <CardDescription className="text-base">{t.subtitle}</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Type Selection */}
              <motion.div 
                className="space-y-3"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Label className="text-base font-semibold">{t.userType}</Label>
                <div className="grid grid-cols-2 gap-3">
                  {userTypes.map(({ value, label, icon: Icon }, idx) => (
                    <motion.div
                      key={value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                    >
                      <Card
                        onClick={() => setUserType(value)}
                        className={`cursor-pointer transition-all duration-300 ${
                          userType === value
                            ? "border-2 border-primary bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg"
                            : "border hover-elevate"
                        }`}
                        data-testid={`card-${value}`}
                      >
                        <CardContent className="flex flex-col items-center justify-center p-4">
                          <motion.div
                            animate={userType === value ? { rotate: 360 } : { rotate: 0 }}
                            transition={{ duration: 0.5 }}
                          >
                            <Icon className={`w-8 h-8 mb-2 transition-colors duration-300 ${userType === value ? "text-primary" : "text-muted-foreground"}`} />
                          </motion.div>
                          <span className={`font-medium text-sm transition-colors duration-300 ${userType === value ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                            {label}
                          </span>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Session Timeout Warning */}
              <AnimatePresence>
                {sessionTimeout && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-950/30 border-2 border-orange-200 dark:border-orange-900 rounded-lg"
                  >
                    <Clock className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-orange-700 dark:text-orange-400">{t.sessionTimeout}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Username Input */}
              <motion.div 
                className="space-y-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="flex items-center gap-2">
                  <Label htmlFor="username" className={`font-semibold transition-colors ${focusedField === "username" ? "text-primary" : ""}`}>
                    {t.username}
                  </Label>
                  <motion.button
                    type="button"
                    onMouseEnter={() => setShowTooltip("username")}
                    onMouseLeave={() => setShowTooltip(null)}
                    className="text-muted-foreground hover:text-primary"
                  >
                    <HelpCircle className="h-4 w-4" />
                  </motion.button>
                </div>

                <AnimatePresence>
                  {showTooltip === "username" && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-xs text-muted-foreground bg-muted p-2 rounded"
                    >
                      {language === "ar" ? "أدخل اسم مستخدم من 3 أحرف على الأقل" : "Enter a username with at least 3 characters"}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative group">
                  <motion.div
                    className={`relative border-2 border-muted rounded-md focus-within:border-primary transition-all duration-300 overflow-hidden ${inputBgColor}`}
                    whileFocus={{ scale: 1.01 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={{ backgroundPosition: ['0% 0%', '100% 0%'] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <Input
                      ref={usernameRef}
                      id="username"
                      type="text"
                      placeholder={language === "ar" ? "أدخل اسم المستخدم" : "Enter username"}
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        if (errors.username) setErrors({ ...errors, username: undefined });
                      }}
                      onFocus={() => setFocusedField("username")}
                      onBlur={() => setFocusedField(null)}
                      onKeyPress={handleKeyPress}
                      className="relative z-10 transition-all duration-300 border-0 focus:ring-0 pr-10"
                      data-testid="input-username"
                      disabled={isLoading || isAccountLocked}
                    />
                    {usernameValid && username && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-20"
                      >
                        <Check className="h-4 w-4 text-green-500" />
                      </motion.div>
                    )}
                  </motion.div>
                </div>
                {errors.username && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-destructive flex items-center gap-1"
                  >
                    <AlertTriangle className="h-3 w-3" />
                    {errors.username}
                  </motion.p>
                )}
              </motion.div>

              {/* Password Input */}
              <motion.div 
                className="space-y-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="password" className={`font-semibold transition-colors ${focusedField === "password" ? "text-primary" : ""}`}>
                      {t.password}
                    </Label>
                    <motion.button
                      type="button"
                      onMouseEnter={() => setShowTooltip("password")}
                      onMouseLeave={() => setShowTooltip(null)}
                      className="text-muted-foreground hover:text-primary"
                    >
                      <HelpCircle className="h-4 w-4" />
                    </motion.button>
                  </div>
                  <motion.button
                    type="button"
                    className="text-xs text-primary hover:underline transition-colors"
                    onClick={() => console.log("Forgot password")}
                    data-testid="link-forgot-password"
                    whileHover={{ color: "#0ea5e9" }}
                  >
                    {t.forgotPassword}
                  </motion.button>
                </div>

                <AnimatePresence>
                  {showTooltip === "password" && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-xs text-muted-foreground bg-muted p-2 rounded"
                    >
                      {language === "ar" ? "استخدم أحرف كبيرة وأرقام ورموز" : "Use uppercase, numbers and symbols"}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative group">
                  <motion.div
                    className={`relative border-2 border-muted rounded-md focus-within:border-primary transition-all duration-300 overflow-hidden ${inputBgColor}`}
                    whileFocus={{ scale: 1.01 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={{ backgroundPosition: ['0% 0%', '100% 0%'] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <Input
                      ref={passwordRef}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={language === "ar" ? "أدخل كلمة المرور" : "Enter password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors({ ...errors, password: undefined });
                        setFailedAttempts(0);
                      }}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      onKeyPress={handleKeyPress}
                      className="relative z-10 transition-all duration-300 border-0 focus:ring-0 pr-20"
                      data-testid="input-password"
                      disabled={isLoading || isAccountLocked}
                    />
                    <motion.button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-10 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition z-20"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </motion.button>
                    {passwordValid && password && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-20"
                      >
                        <Check className="h-4 w-4 text-green-500" />
                      </motion.div>
                    )}
                  </motion.div>
                </div>

                {/* Password Requirements */}
                {password && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                  >
                    <p className="text-xs font-semibold text-muted-foreground">{t.passwordRequirements}</p>
                    <div className="space-y-1">
                      {[
                        { label: language === "ar" ? "8 أحرف على الأقل" : "At least 8 chars", check: passwordReqs.minLength },
                        { label: language === "ar" ? "حرف كبير" : "Uppercase", check: passwordReqs.hasUpperCase },
                        { label: language === "ar" ? "حرف صغير" : "Lowercase", check: passwordReqs.hasLowerCase },
                        { label: language === "ar" ? "رقم" : "Number", check: passwordReqs.hasNumber },
                        { label: language === "ar" ? "رمز (!@#$%^&*)" : "Special char", check: passwordReqs.hasSpecial },
                      ].map((req, idx) => (
                        <motion.div
                          key={idx}
                          className="flex items-center gap-2"
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: idx * 0.05 }}
                        >
                          <motion.div
                            animate={req.check ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                          >
                            {req.check ? (
                              <Check className="h-3.5 w-3.5 text-green-500" />
                            ) : (
                              <div className="h-3.5 w-3.5 border border-gray-300 rounded-full" />
                            )}
                          </motion.div>
                          <span className={`text-xs ${req.check ? "text-green-600 dark:text-green-400 font-medium" : "text-muted-foreground"}`}>
                            {req.label}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-destructive flex items-center gap-1"
                  >
                    <AlertTriangle className="h-3 w-3" />
                    {errors.password}
                  </motion.p>
                )}
              </motion.div>

              {/* Failed Attempts Warning */}
              <AnimatePresence>
                {failedAttempts > 0 && failedAttempts < 5 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-950/30 border-2 border-orange-200 dark:border-orange-900 rounded-lg"
                  >
                    <motion.div
                      animate={{ rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                    >
                      <ShieldAlert className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    </motion.div>
                    <div className="text-sm text-orange-700 dark:text-orange-400 font-medium">
                      {language === "ar"
                        ? `${failedAttempts} محاولات فاشلة. تحذير: بعد 5 محاولات سيتم قفل الحساب`
                        : `${failedAttempts} failed attempts. Warning: Account will lock after 5`}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Account Locked */}
              <AnimatePresence>
                {isAccountLocked && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-900 rounded-lg"
                  >
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                    >
                      <Lock className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    </motion.div>
                    <div className="text-sm text-red-700 dark:text-red-400 font-medium">
                      {language === "ar"
                        ? "الحساب مقفل لأسباب أمان. يرجى المحاولة بعد 15 دقيقة"
                        : "Account locked for security. Try again in 15 minutes"}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Remember Me */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    disabled={isLoading || isAccountLocked}
                    data-testid="checkbox-remember-me"
                  />
                  <Label htmlFor="remember" className="text-sm cursor-pointer font-medium">
                    {t.rememberMe}
                  </Label>
                </div>

                {/* 2FA Toggle */}
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="2fa"
                    checked={enable2FA}
                    onCheckedChange={(checked) => setEnable2FA(checked as boolean)}
                    disabled={isLoading}
                    data-testid="checkbox-2fa"
                  />
                  <Label htmlFor="2fa" className="text-xs cursor-pointer font-medium text-muted-foreground hover:text-primary">
                    {t.enable2FA}
                  </Label>
                </div>
              </motion.div>

              {/* Demo Accounts */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.65 }}
                className="space-y-2"
              >
                <p className="text-xs font-semibold text-muted-foreground">{t.demoAccounts}</p>
                <div className="grid grid-cols-2 gap-2">
                  {userTypes.map(({ value, label }) => (
                    <Button
                      key={value}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => loadDemoAccount(value)}
                      className="text-xs"
                      disabled={isLoading}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </motion.div>

              {/* Login Button */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <motion.div
                  whileHover={{ scale: isLoading || isAccountLocked ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading || isAccountLocked ? 1 : 0.98 }}
                >
                  <motion.div
                    animate={isLoading ? { scale: [1, 1.02, 1] } : {}}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    <Button 
                      type="submit" 
                      className={`w-full h-12 text-lg font-semibold dental-gradient shadow-lg transition-all duration-300 ${
                        isLoading ? "animate-pulse" : ""
                      }`}
                      data-testid="button-login"
                      disabled={isLoading || isAccountLocked}
                    >
                      {isLoading ? (
                        <>
                          <motion.div 
                            className="mr-2"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            <Zap className="w-5 h-5" />
                          </motion.div>
                          {language === "ar" ? "جاري التحقق..." : "Verifying..."}
                        </>
                      ) : (
                        <>
                          <LogIn className={`w-5 h-5 ${language === "en" ? "mr-2" : "ml-2"}`} />
                          {language === "ar" ? "تسجيل الدخول" : "Sign In"}
                        </>
                      )}
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Clear Form Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.75 }}
              >
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setUsername("");
                    setPassword("");
                    setErrors({});
                    setRememberMe(false);
                    setEnable2FA(false);
                  }}
                  disabled={isLoading}
                  data-testid="button-clear-form"
                >
                  {t.clearForm}
                </Button>
              </motion.div>

              {/* Social Login */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="space-y-3"
              >
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-muted"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-slate-950 px-2 text-muted-foreground">{t.socialLogin}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={isLoading}
                    data-testid="button-google-login"
                  >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/></svg>
                    Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={isLoading}
                    data-testid="button-apple-login"
                  >
                    <Apple className="w-4 h-4 mr-2" />
                    Apple
                  </Button>
                </div>
              </motion.div>

              {/* Sign Up Link */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.85 }}
                className="text-center text-sm"
              >
                <span className="text-muted-foreground">
                  {language === "ar" ? "ليس لديك حساب؟ " : "Don't have an account? "}
                  <motion.button
                    type="button"
                    className="text-primary hover:underline font-semibold"
                    onClick={() => onSignUpClick?.()}
                    whileHover={{ color: "#0ea5e9" }}
                    data-testid="link-sign-up"
                  >
                    {t.signUp}
                  </motion.button>
                </span>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
