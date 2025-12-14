import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, Upload, Bot, User, X, MessageCircle, Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  image?: string;
  timestamp: Date;
  suggestedClinic?: string;
  suggestedDoctors?: Array<{ id: string; name: string; rating: number }>;
}

interface FloatingChatbotProps {
  patientName?: string;
}

interface Doctor {
  id: string;
  name: string;
  clinic: string;
  specialization: string;
  rating: number;
  availability: string;
}

export default function FloatingChatbot({ patientName = "المريض" }: FloatingChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content: `مرحباً ${patientName}! أنا مساعدك الطبي الذكي. كيف يمكنني مساعدتك اليوم؟`,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const doctorsData: Doctor[] = [
    { id: "1", name: "د. محمد أحمد", clinic: "التشخيص والأشعة", specialization: "تشخيص وأشعة", rating: 4.8, availability: "متاح" },
    { id: "2", name: "د. فاطمة علي", clinic: "العلاج التحفظي", specialization: "علاج تحفظي", rating: 4.9, availability: "متاح" },
    { id: "3", name: "د. سارة حسن", clinic: "تجميل الأسنان", specialization: "تجميل وتبييض", rating: 4.7, availability: "متاح" },
    { id: "4", name: "د. علي محمود", clinic: "جراحة الفم والفكين", specialization: "جراحة", rating: 4.6, availability: "متاح" },
  ];

  const quickSymptoms = [
    { label: "ألم أسنان", emoji: "😣" },
    { label: "تسوس", emoji: "🦷" },
    { label: "تبييض", emoji: "✨" },
    { label: "تقويم", emoji: "📐" },
    { label: "زراعة", emoji: "🌱" },
    { label: "تنظيف", emoji: "🧹" },
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  const analyzeSymptoms = (userMessage: string): { clinic: string; response: string; doctors: Array<{ id: string; name: string; rating: number }> } => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("ألم") || lowerMessage.includes("وجع") || lowerMessage.includes("تسوس") || lowerMessage.includes("حشو")) {
      return {
        clinic: "العلاج التحفظي وطب وجراحة الجذور",
        response: "بناءً على الأعراض، أنصحك بزيارة عيادة العلاج التحفظي. أليك الأطباء المتخصصين المتاحين:",
        doctors: [{ id: "2", name: "د. فاطمة علي", rating: 4.9 }],
      };
    } else if (lowerMessage.includes("لثة") || lowerMessage.includes("نزيف") || lowerMessage.includes("التهاب اللثة")) {
      return {
        clinic: "اللثة",
        response: "أعراضك تشير إلى مشكلة في اللثة. يمكنك حجز موعد مع الأطباء المختصين:",
        doctors: [{ id: "2", name: "د. فاطمة علي", rating: 4.9 }],
      };
    } else if (lowerMessage.includes("تقويم") || lowerMessage.includes("اعوجاج") || lowerMessage.includes("تصحيح") || lowerMessage.includes("فك")) {
      return {
        clinic: "تقويم الأسنان",
        response: "يبدو أنك بحاجة لزيارة قسم تقويم الأسنان. اليك الأطباء المتاحين:",
        doctors: [{ id: "1", name: "د. محمد أحمد", rating: 4.8 }],
      };
    } else if (lowerMessage.includes("زراعة") || lowerMessage.includes("غرس") || lowerMessage.includes("implant")) {
      return {
        clinic: "زراعة الأسنان",
        response: "أنصحك بزيارة قسم زراعة الأسنان. اليك الأطباء المتخصصين:",
        doctors: [{ id: "4", name: "د. علي محمود", rating: 4.6 }],
      };
    } else if (lowerMessage.includes("تجميل") || lowerMessage.includes("تبييض") || lowerMessage.includes("ابتسامة") || lowerMessage.includes("مظهر")) {
      return {
        clinic: "تجميل الأسنان",
        response: "يمكنك زيارة قسم تجميل الأسنان لتحسين مظهر ابتسامتك:",
        doctors: [{ id: "3", name: "د. سارة حسن", rating: 4.7 }],
      };
    } else if (lowerMessage.includes("طفل") || lowerMessage.includes("ابني") || lowerMessage.includes("ابنتي") || lowerMessage.includes("صغير")) {
      return {
        clinic: "أسنان الأطفال",
        response: "أنصحك بزيارة قسم أسنان الأطفال. اليك الأطباء المتخصصين:",
        doctors: [{ id: "3", name: "د. سارة حسن", rating: 4.7 }],
      };
    } else if (lowerMessage.includes("خلع") || lowerMessage.includes("عملية") || lowerMessage.includes("كسر") || lowerMessage.includes("حادث")) {
      return {
        clinic: "جراحة الفم والفكين",
        response: "حالتك تتطلب زيارة قسم جراحة الفم والفكين. اليك جراحونا:",
        doctors: [{ id: "4", name: "د. علي محمود", rating: 4.6 }],
      };
    } else if (lowerMessage.includes("تركيبة") || lowerMessage.includes("تاج") || lowerMessage.includes("جسر")) {
      return {
        clinic: "التركيبات",
        response: "أنصحك بزيارة قسم التركيبات. اليك الأطباء المتخصصين:",
        doctors: [{ id: "2", name: "د. فاطمة علي", rating: 4.9 }],
      };
    } else if (lowerMessage.includes("أشعة") || lowerMessage.includes("صورة") || lowerMessage.includes("فحص") || lowerMessage.includes("تشخيص")) {
      return {
        clinic: "التشخيص والأشعة",
        response: "أنصحك بزيارة قسم التشخيص والأشعة لإجراء الفحص الشامل:",
        doctors: [{ id: "1", name: "د. محمد أحمد", rating: 4.8 }],
      };
    } else {
      return {
        clinic: "التشخيص والأشعة",
        response: "أنصحك بزيارة قسم التشخيص والأشعة للفحص الشامل. اليك الأطباء المتاحين:",
        doctors: [{ id: "1", name: "د. محمد أحمد", rating: 4.8 }],
      };
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    setTimeout(() => {
      const { clinic, response, doctors } = analyzeSymptoms(inputMessage);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: response,
        suggestedClinic: clinic,
        suggestedDoctors: doctors,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
      
      if (!isOpen) {
        setUnreadCount((prev) => prev + 1);
      }
    }, 1500);
  };

  const handleQuickSymptom = (symptom: string) => {
    setInputMessage(symptom);
    setTimeout(() => {
      handleSendMessage();
    }, 0);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      
      const userMessage: Message = {
        id: Date.now().toString(),
        type: "user",
        content: "قمت برفع صورة للفحص",
        image: imageUrl,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);

      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          content: "شكراً لرفع الصورة. أنصحك بزيارة قسم التشخيص والأشعة للتقييم الدقيق.",
          suggestedClinic: "التشخيص والأشعة",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
        
        if (!isOpen) {
          setUnreadCount((prev) => prev + 1);
        }
      }, 2000);
    };

    reader.readAsDataURL(file);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? "60px" : "600px"
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 left-6 z-50 w-96 shadow-2xl"
            data-testid="floating-chatbot"
          >
            <Card className="h-full flex flex-col">
              <CardHeader className="border-b bg-primary text-primary-foreground p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5" />
                    <CardTitle className="text-lg">المساعد الطبي الذكي</CardTitle>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                      onClick={() => setIsMinimized(!isMinimized)}
                      data-testid="button-minimize-chatbot"
                    >
                      <Minimize2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                      onClick={() => setIsOpen(false)}
                      data-testid="button-close-chatbot"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {!isMinimized && (
                <>
                  <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex gap-2 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                        >
                          {message.type === "bot" && (
                            <div className="flex-shrink-0">
                              <div className="p-2 bg-primary/10 rounded-full">
                                <Bot className="w-4 h-4 text-primary" />
                              </div>
                            </div>
                          )}

                          <div className={`max-w-[75%] ${message.type === "user" ? "order-first" : ""}`}>
                            <div className={`rounded-lg p-3 ${
                              message.type === "user" 
                                ? "bg-primary text-primary-foreground" 
                                : "bg-muted"
                            }`}>
                              {message.image && (
                                <img
                                  src={message.image}
                                  alt="صورة"
                                  className="rounded mb-2 max-w-full"
                                />
                              )}
                              <p className="text-sm">{message.content}</p>
                              {message.suggestedClinic && (
                                <div className="mt-2 space-y-2">
                                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 text-xs">
                                    {message.suggestedClinic}
                                  </Badge>
                                  {message.suggestedDoctors && message.suggestedDoctors.length > 0 && (
                                    <div className="space-y-1">
                                      <p className="text-xs font-semibold">الأطباء المتخصصين:</p>
                                      {message.suggestedDoctors.map(doc => (
                                        <div key={doc.id} className="text-xs bg-primary/10 p-2 rounded">
                                          <p className="font-semibold">{doc.name}</p>
                                          <p className="text-yellow-500">★ {doc.rating}</p>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 px-1">
                              {message.timestamp.toLocaleTimeString("ar-EG", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>

                          {message.type === "user" && (
                            <div className="flex-shrink-0">
                              <div className="p-2 bg-primary rounded-full">
                                <User className="w-4 h-4 text-primary-foreground" />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}

                      {isTyping && (
                        <div className="flex gap-2 justify-start">
                          <div className="flex-shrink-0">
                            <div className="p-2 bg-primary/10 rounded-full">
                              <Bot className="w-4 h-4 text-primary" />
                            </div>
                          </div>
                          <div className="bg-muted rounded-lg p-3">
                            <div className="flex gap-1">
                              <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                              <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></span>
                              <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>

                  <CardContent className="border-t p-3 space-y-3">
                    {messages.length === 1 && (
                      <div className="grid grid-cols-2 gap-2">
                        {quickSymptoms.map((symptom) => (
                          <Button
                            key={symptom.label}
                            size="sm"
                            variant="outline"
                            onClick={() => handleQuickSymptom(symptom.label)}
                            className="text-xs"
                            data-testid={`button-quick-symptom-${symptom.label}`}
                          >
                            {symptom.label}
                          </Button>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        data-testid="input-image-upload"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => fileInputRef.current?.click()}
                        data-testid="button-upload-image"
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                      <Input
                        placeholder="اكتب رسالتك..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        data-testid="input-chatbot-message"
                      />
                      <Button onClick={handleSendMessage} size="icon" data-testid="button-send-message">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 left-6 z-50"
      >
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg dental-gradient relative"
          onClick={() => setIsOpen(!isOpen)}
          data-testid="button-toggle-chatbot"
        >
          <MessageCircle className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-6 h-6 text-xs flex items-center justify-center font-bold">
              {unreadCount}
            </span>
          )}
        </Button>
      </motion.div>
    </>
  );
}
