import TreatmentPlanCard from "../TreatmentPlanCard";

export default function TreatmentPlanCardExample() {
  const mockSteps = [
    {
      id: "1",
      title: "الفحص الأولي والأشعة",
      description: "فحص شامل للفم والأسنان مع أخذ الأشعة اللازمة",
      status: "completed" as const,
      date: "2025-10-15",
    },
    {
      id: "2",
      title: "تنظيف الأسنان وإزالة الجير",
      description: "جلسة تنظيف عميق للأسنان وإزالة الجير والبلاك",
      status: "in-progress" as const,
      date: "2025-10-28",
    },
    {
      id: "3",
      title: "حشو الضرس الأول",
      description: "حشو تجميلي للضرس المصاب بالتسوس",
      status: "pending" as const,
    },
    {
      id: "4",
      title: "المتابعة والفحص النهائي",
      description: "فحص المتابعة للتأكد من نجاح العلاج",
      status: "pending" as const,
    },
  ];

  return (
    <div className="p-6 bg-background max-w-4xl">
      <TreatmentPlanCard
        patientName="أحمد محمد علي"
        planTitle="خطة علاج التسوس والتنظيف"
        steps={mockSteps}
        onUpdateStep={(id) => console.log("Update step:", id)}
      />
    </div>
  );
}
