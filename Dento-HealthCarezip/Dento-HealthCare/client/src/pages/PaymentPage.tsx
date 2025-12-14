import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, DollarSign, CheckCircle, AlertCircle, Download, Eye, Smartphone, Wallet, History } from "lucide-react";

interface Invoice {
  id: string;
  date: string;
  service: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  doctor?: string;
}

interface PaymentRecord {
  id: string;
  date: string;
  description: string;
  amount: number;
  method: "بطاقة" | "محفظة رقمية" | "تحويل بنكي";
  status: "مكتمل" | "قيد المعالجة";
}

export default function PaymentPage() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [paymentMethod, setPaymentMethod] = useState("بطاقة");
  const [installmentMonths, setInstallmentMonths] = useState(1);
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "INV001",
      date: "2025-10-15",
      service: "فحص عام وأشعات سينية",
      amount: 250,
      status: "paid",
      doctor: "د. محمد أحمد"
    },
    {
      id: "INV002",
      date: "2025-10-28",
      service: "جلسة تنظيف عميق",
      amount: 150,
      status: "paid",
      doctor: "د. فاطمة علي"
    },
    {
      id: "INV003",
      date: "2025-11-10",
      service: "حشو تجميلي - ضرسين",
      amount: 400,
      status: "pending",
      doctor: "د. فاطمة علي"
    },
  ]);

  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [saveCard, setSaveCard] = useState(false);
  const [partialPaymentEnabled, setPartialPaymentEnabled] = useState(false);
  const [partialAmount, setPartialAmount] = useState("");

  const [paymentHistory] = useState<PaymentRecord[]>([
    {
      id: "PAY001",
      date: "2025-10-15",
      description: "فحص عام وأشعات سينية",
      amount: 250,
      method: "بطاقة",
      status: "مكتمل"
    },
    {
      id: "PAY002",
      date: "2025-10-28",
      description: "جلسة تنظيف عميق",
      amount: 150,
      method: "محفظة رقمية",
      status: "مكتمل"
    },
    {
      id: "PAY003",
      date: "2025-11-05",
      description: "قسط 1 من حشو تجميلي",
      amount: 133.33,
      method: "تحويل بنكي",
      status: "قيد المعالجة"
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return { variant: "default" as const, label: "✓ مدفوع" };
      case "pending":
        return { variant: "secondary" as const, label: "⏳ قيد الانتظار" };
      case "overdue":
        return { variant: "destructive" as const, label: "✕ متأخر" };
      default:
        return { variant: "outline" as const, label: "معروف" };
    }
  };

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidAmount = invoices.filter(inv => inv.status === "paid").reduce((sum, inv) => sum + inv.amount, 0);
  const pendingAmount = invoices.filter(inv => inv.status === "pending").reduce((sum, inv) => sum + inv.amount, 0);
  
  const applyDiscount = (code: string) => {
    if (code === "SAVE10") {
      setDiscountPercent(10);
      setDiscountApplied(true);
    } else if (code === "SAVE20") {
      setDiscountPercent(20);
      setDiscountApplied(true);
    } else {
      setDiscountApplied(false);
      setDiscountPercent(0);
    }
  };

  const discountAmount = (pendingAmount * discountPercent) / 100;
  const finalAmount = pendingAmount - discountAmount;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">💰 الفواتير والدفع</h1>
        <p className="text-muted-foreground text-lg">إدارة الفواتير والمدفوعات الخاصة بك</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-2">إجمالي الفواتير</p>
            <p className="text-3xl font-bold text-primary">{totalAmount} ج.م</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
          <CardContent className="pt-6">
            <p className="text-sm text-green-900 dark:text-green-100 mb-2">المدفوع</p>
            <p className="text-3xl font-bold text-green-600">{paidAmount} ج.م</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
          <CardContent className="pt-6">
            <p className="text-sm text-yellow-900 dark:text-yellow-100 mb-2">قيد الانتظار</p>
            <p className="text-3xl font-bold text-yellow-600">{pendingAmount} ج.م</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-2">عدد الفواتير</p>
            <p className="text-3xl font-bold">{invoices.length}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="invoices" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="invoices">الفواتير</TabsTrigger>
          <TabsTrigger value="payment">الدفع</TabsTrigger>
          <TabsTrigger value="history">السجل</TabsTrigger>
          <TabsTrigger value="installment">الأقساط</TabsTrigger>
        </TabsList>

        {/* Invoices */}
        <TabsContent value="invoices" className="mt-6 space-y-4">
          {/* Filter Buttons */}
          <div className="flex gap-2 flex-wrap mb-4">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("all")}
            >
              الكل ({invoices.length})
            </Button>
            <Button
              variant={filterStatus === "paid" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("paid")}
            >
              مدفوع ({invoices.filter(i => i.status === "paid").length})
            </Button>
            <Button
              variant={filterStatus === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("pending")}
            >
              قيد الانتظار ({invoices.filter(i => i.status === "pending").length})
            </Button>
          </div>

          {invoices.filter(i => filterStatus === "all" ? true : i.status === filterStatus).map(invoice => {
            const statusBadge = getStatusBadge(invoice.status);
            const isOverdue = invoice.status === "pending" && new Date(invoice.date).getTime() < Date.now() - 30*24*60*60*1000;
            return (
              <Card key={invoice.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <DollarSign className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-bold">{invoice.service}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{invoice.doctor}</p>
                    </div>
                    <Badge 
                      variant={statusBadge.variant} 
                      className={`status-badge text-xs px-3 py-1 font-medium ${invoice.status === "pending" ? "status-pending" : ""}`}
                      aria-label={`حالة الفاتورة: ${statusBadge.label}`}
                    >
                      {statusBadge.label}
                    </Badge>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3 mb-4 pb-4 border-b">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">رقم الفاتورة</p>
                      <p className="font-semibold">{invoice.id}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">التاريخ</p>
                      <p className="font-semibold">{invoice.date}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">المبلغ</p>
                      <p className="text-xl font-bold text-primary">{invoice.amount} ج.م</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye className="h-4 w-4" />
                      عرض التفاصيل
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      تحميل PDF
                    </Button>
                    {invoice.status === "pending" && (
                      <Button size="sm" className="gap-2" data-testid={`button-pay-${invoice.id}`}>
                        <CreditCard className="h-4 w-4" />
                        ادفع الآن
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* Payment */}
        <TabsContent value="payment" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Payment Form */}
            <Card>
              <CardHeader>
                <CardTitle>طريقة الدفع</CardTitle>
                <CardDescription>اختر طريقة الدفع المفضلة</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Discount Code */}
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                  <p className="text-xs font-semibold text-amber-900 dark:text-amber-100 mb-2">هل لديك كود خصم؟</p>
                  <div className="flex gap-2">
                    <Input
                      placeholder="أدخل الكود..."
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                      className="text-sm"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => applyDiscount(discountCode)}
                    >
                      تطبيق
                    </Button>
                  </div>
                  {discountApplied && (
                    <p className="text-xs text-green-600 mt-2">✓ تم تطبيق الخصم بنجاح</p>
                  )}
                  <p className="text-xs text-amber-700 dark:text-amber-200 mt-2">الأكواد: SAVE10 (10%) • SAVE20 (20%)</p>
                </div>

                <div className="grid gap-3">
                  <button
                    onClick={() => setPaymentMethod("بطاقة")}
                    className={`p-4 border rounded-lg transition ${
                      paymentMethod === "بطاقة"
                        ? "border-primary bg-primary/10"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <div className="text-left">
                        <p className="font-semibold">بطاقة الائتمان</p>
                        <p className="text-xs text-muted-foreground">فيزا - ماستركارد - أمريكان إكسبريس</p>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => setPaymentMethod("محفظة رقمية")}
                    className={`p-4 border rounded-lg transition ${
                      paymentMethod === "محفظة رقمية"
                        ? "border-primary bg-primary/10"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-primary" />
                      <div className="text-left">
                        <p className="font-semibold">المحفظة الرقمية</p>
                        <p className="text-xs text-muted-foreground">Apple Pay - Google Pay</p>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => setPaymentMethod("تحويل بنكي")}
                    className={`p-4 border rounded-lg transition ${
                      paymentMethod === "تحويل بنكي"
                        ? "border-primary bg-primary/10"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Wallet className="h-5 w-5 text-primary" />
                      <div className="text-left">
                        <p className="font-semibold">تحويل بنكي</p>
                        <p className="text-xs text-muted-foreground">من حسابك البنكي مباشرة</p>
                      </div>
                    </div>
                  </button>
                </div>

                <div className="border-t pt-4">
                  {paymentMethod === "بطاقة" && (
                    <>
                      <div>
                        <label className="text-sm font-semibold mb-2 block">رقم البطاقة</label>
                        <Input
                          placeholder="xxxx xxxx xxxx xxxx"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                          className="font-mono"
                          data-testid="input-card-number"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold mb-2 block">صاحب البطاقة</label>
                        <Input
                          placeholder="اسمك الكامل"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          data-testid="input-card-holder"
                        />
                      </div>

                      <div className="grid gap-4 grid-cols-2">
                        <div>
                          <label className="text-sm font-semibold mb-2 block">صلاحية البطاقة</label>
                          <Input
                            placeholder="MM/YY"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            data-testid="input-expiry-date"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold mb-2 block">CVV</label>
                          <Input
                            placeholder="xxx"
                            type="password"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value.slice(0, 3))}
                            className="font-mono"
                            data-testid="input-cvv"
                          />
                        </div>
                      </div>
                          <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                        <input
                          type="checkbox"
                          checked={saveCard}
                          onChange={(e) => setSaveCard(e.target.checked)}
                          id="save-card"
                          className="w-4 h-4 cursor-pointer"
                        />
                        <label htmlFor="save-card" className="text-sm cursor-pointer">
                          حفظ البطاقة للمرات القادمة
                        </label>
                      </div>

                      {/* Partial Payment Option */}
                      <div className="mt-4 pt-4 border-t space-y-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={partialPaymentEnabled}
                            onChange={(e) => setPartialPaymentEnabled(e.target.checked)}
                            id="partial-payment"
                            className="w-4 h-4 cursor-pointer"
                          />
                          <label htmlFor="partial-payment" className="text-sm font-semibold cursor-pointer">
                            دفع جزئي
                          </label>
                        </div>
                        {partialPaymentEnabled && (
                          <div>
                            <label className="text-xs font-semibold mb-2 block text-blue-900 dark:text-blue-100">
                              المبلغ المراد دفعه (أقصى: {finalAmount.toFixed(2)} ج.م)
                            </label>
                            <Input
                              type="number"
                              placeholder="أدخل المبلغ"
                              value={partialAmount}
                              onChange={(e) => setPartialAmount(e.target.value)}
                              max={finalAmount}
                              min="0"
                              className="text-sm"
                              data-testid="input-partial-amount"
                            />
                            {partialAmount && (
                              <p className="text-xs text-blue-700 dark:text-blue-200 mt-2">
                                الرصيد المتبقي: {(finalAmount - parseFloat(partialAmount)).toFixed(2)} ج.م
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  {paymentMethod === "محفظة رقمية" && (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground">سيتم تحويلك إلى تطبيق المحفظة الرقمية</p>
                    </div>
                  )}
                  {paymentMethod === "تحويل بنكي" && (
                    <div className="space-y-2 text-sm">
                      <p className="font-semibold">بيانات التحويل البنكي:</p>
                      <p>اسم البنك: البنك الأهلي المصري</p>
                      <p>رقم الحساب: 1234567890</p>
                      <p className="text-xs text-muted-foreground">برجاء كتابة رقم الفاتورة في الحقل المرجعي</p>
                    </div>
                  )}
                </div>

                <Button className="w-full gap-2" size="lg" data-testid="button-process-payment">
                  <CreditCard className="h-4 w-4" />
                  معالجة الدفع
                </Button>
              </CardContent>
            </Card>

            {/* Payment Summary */}
            <Card>
              <CardHeader>
                <CardTitle>ملخص الدفع</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {invoices.filter(inv => inv.status === "pending").map(invoice => (
                    <div key={invoice.id} className="flex justify-between pb-2 border-b">
                      <div>
                        <p className="font-semibold text-sm">{invoice.service}</p>
                        <p className="text-xs text-muted-foreground">{invoice.id}</p>
                      </div>
                      <p className="font-bold">{invoice.amount} ج.م</p>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t space-y-2">
                  <div className="flex justify-between">
                    <p className="font-semibold">المجموع الجزئي</p>
                    <p className="font-semibold">{pendingAmount} ج.م</p>
                  </div>
                  <div className="flex justify-between">
                    <p>رسوم معالجة</p>
                    <p>-</p>
                  </div>
                  {discountApplied && (
                    <div className="flex justify-between text-sm text-green-600">
                      <p>الخصم ({discountPercent}%)</p>
                      <p>-{discountAmount.toFixed(2)} ج.م</p>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <p>المجموع النهائي</p>
                    <p className="text-primary">{finalAmount.toFixed(2)} ج.م</p>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                  <div className="flex gap-2 items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-green-900 dark:text-green-100">
                      <p className="font-semibold">آمن تماماً</p>
                      <p className="text-xs mt-1">جميع المعاملات مشفرة وآمنة</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Payment History */}
        <TabsContent value="history" className="mt-6 space-y-4">
          <div className="space-y-3">
            {paymentHistory.map(payment => (
              <Card key={payment.id} className="hover-elevate">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <History className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <p className="font-semibold">{payment.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {payment.date} • {payment.method}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">{payment.amount} ج.م</p>
                      <Badge
                        variant={payment.status === "مكتمل" ? "default" : "secondary"}
                        className="mt-2 text-xs"
                      >
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Installment Plans */}
        <TabsContent value="installment" className="mt-6">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>خطط الأقساط</CardTitle>
                <CardDescription>قسّم فواتيرك لأقساط شهرية سهلة</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold mb-3 block">اختر عدد الأقساط</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[1, 3, 6].map(months => (
                        <button
                          key={months}
                          onClick={() => setInstallmentMonths(months)}
                          className={`p-3 border rounded-lg font-semibold transition ${
                            installmentMonths === months
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {months} {months === 1 ? "قسط" : "أقساط"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-3">
                    <p className="font-semibold">ملخص الأقساط</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <p>المبلغ الإجمالي:</p>
                        <p className="font-semibold">{pendingAmount} ج.م</p>
                      </div>
                      <div className="flex justify-between">
                        <p>عدد الأقساط:</p>
                        <p className="font-semibold">{installmentMonths}</p>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <p className="font-semibold">مبلغ القسط الواحد:</p>
                        <p className="font-bold text-primary">
                          {(pendingAmount / installmentMonths).toFixed(2)} ج.م
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-blue-900 dark:text-blue-100">
                      ✓ بدون فوائد إضافية • ✓ معتمدة شرعاً
                    </p>
                  </div>

                  <Button className="w-full gap-2 mt-4">
                    <CreditCard className="h-4 w-4" />
                    طلب القسط
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Payment Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>إحصائيات الدفع</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">متوسط الدفعة</p>
                    <p className="text-2xl font-bold text-primary">
                      {(totalAmount / invoices.length).toFixed(2)} ج.م
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">نسبة الدفع</p>
                    <p className="text-2xl font-bold text-green-600">
                      {((paidAmount / totalAmount) * 100).toFixed(0)}%
                    </p>
                  </div>
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">المتبقي</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {pendingAmount.toFixed(2)} ج.م
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
