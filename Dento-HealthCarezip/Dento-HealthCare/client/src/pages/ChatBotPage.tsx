import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Wand2, AlertCircle, Lightbulb, Clock, User, Sparkles } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
  type?: "text" | "suggestion" | "alert";
}

const QUICK_SUGGESTIONS = [
  "كيف أحجز موعد؟",
  "ما أسعار الخدمات؟",
  "أين توجد العيادة؟",
  "ما ساعات العمل؟",
  "كيف أدفع الفاتورة؟",
  "هل يوجد تأمين طبي؟",
];

const BOT_RESPONSES: { [key: string]: string } = {
  "حجز": "يمكنك حجز موعد من خلال قسم المواعيد في التطبيق. اختر العيادة والطبيب والتاريخ والوقت المناسب لك. 📅",
  "أسعار": "تختلف الأسعار حسب نوع الخدمة. الفحص العام 100 ج.م، التنظيف العميق 200 ج.م، الحشو التجميلي 250 ج.م. 💰",
  "عيادة": "نحن موجودون في جامعة الدلتا للعلوم والتكنولوجيا، كلية طب الأسنان. 📍",
  "ساعات": "نعمل من الساعة 8 صباحاً إلى 8 مساءً من السبت إلى الخميس. الجمعة عطلة. ⏰",
  "دفع": "يمكنك الدفع بالبطاقة الائتمانية، المحفظة الرقمية، أو التحويل البنكي. 💳",
  "تأمين": "نقبل معظم شركات التأمين الطبي. تواصل معنا للتأكد من قبول تأمينك. 🏥",
  "طبيب": "لدينا فريق متخصص من الأطباء ذوي خبرة طويلة. يمكنك اختيار الطبيب من قسم الأطباء. 👨‍⚕️",
  "موعد": "لإلغاء أو تعديل موعدك، تواصل معنا قبل 24 ساعة من الموعد. 📞",
  "شكاوى": "هناك قسم دعم متخصص لتلقي شكاواك واقتراحاتك. نقدّر ملاحظاتك! 💬",
  "default": "شكراً لسؤالك! هل هناك شيء آخر يمكنني مساعدتك فيه؟",
};

export default function ChatBotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      text: "مرحباً! أنا Dento، مساعدك الرقمي من عيادة أسنان جامعة الدلتا. كيف يمكنني مساعدتك اليوم؟ 😊",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    for (const [key, response] of Object.entries(BOT_RESPONSES)) {
      if (key !== "default" && lowerMessage.includes(key)) {
        return response;
      }
    }
    return BOT_RESPONSES.default;
  };

  const handleSendMessage = (messageText: string) => {
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: getBotResponse(messageText),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);
    }, 500);
  };

  const handleQuickSuggestion = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 dark:from-blue-700 dark:via-cyan-700 dark:to-blue-800 text-white p-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-colors">
              <Wand2 className="w-6 h-6 animate-pulse" />
            </div>
            <h1 className="text-3xl font-bold">✨ Dento - مساعدك الطبي الذكي</h1>
          </div>
          <p className="text-blue-100">متاح 24/7 للإجابة عن جميع أسئلتك بذكاء</p>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 overflow-hidden flex flex-col max-w-4xl mx-auto w-full">
        {/* Messages */}
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                data-testid={`message-${message.sender}-${message.id}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-2xl shadow-sm ${
                    message.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-blue-100 dark:border-blue-900 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm lg:text-base leading-relaxed">{message.text}</p>
                  <div
                    className={`text-xs mt-1 ${
                      message.sender === "user"
                        ? "text-blue-100"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString("ar-EG", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm border border-blue-100 dark:border-blue-900">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        {/* Quick Suggestions - Show when no messages beyond greeting */}
        {messages.length === 1 && (
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              أسئلة شهيرة:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_SUGGESTIONS.slice(0, 4).map((suggestion, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickSuggestion(suggestion)}
                  className="text-xs text-left justify-start hover-elevate"
                  data-testid={`button-suggestion-${idx}`}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 lg:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-3">
              <Input
                placeholder="اكتب سؤالك هنا..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage(input);
                  }
                }}
                disabled={isLoading}
                className="flex-1"
                data-testid="input-message"
              />
              <Button
                onClick={() => handleSendMessage(input)}
                disabled={isLoading || !input.trim()}
                className="gap-2"
                data-testid="button-send"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">إرسال</span>
              </Button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              💡 نحن هنا للمساعدة 24/7. رد الفعل الفوري مضمون!
            </p>
          </div>
        </div>
      </div>

      {/* Info Bar */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800 px-6 py-3">
        <div className="max-w-4xl mx-auto flex flex-wrap gap-4 justify-center text-sm">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>الخدمة متاحة 24 ساعة</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <AlertCircle className="w-4 h-4 text-blue-600" />
            <span>للحالات الطارئة: 101</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <User className="w-4 h-4 text-blue-600" />
            <span>فريق الدعم جاهز</span>
          </div>
        </div>
      </div>
    </div>
  );
}
