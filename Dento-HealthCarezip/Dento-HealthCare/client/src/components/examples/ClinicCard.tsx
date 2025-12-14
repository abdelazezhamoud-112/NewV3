import ClinicCard from "../ClinicCard";
import { Stethoscope, Syringe, Scissors, Layers, Building2 } from "lucide-react";

export default function ClinicCardExample() {
  const clinics = [
    {
      id: "diagnosis",
      name: "التشخيص والأشعة",
      description: "الفحص الأولي والتشخيص بالأشعة",
      patientCount: 245,
      activeCount: 52,
      icon: <Stethoscope className="h-6 w-6 text-primary" />,
    },
    {
      id: "conservative",
      name: "العلاج التحفظي وطب وجراحة الجذور",
      description: "علاج الأسنان وحشو الجذور",
      patientCount: 189,
      activeCount: 38,
      icon: <Syringe className="h-6 w-6 text-primary" />,
    },
    {
      id: "surgery",
      name: "جراحة الفم والفكين",
      description: "العمليات الجراحية للفم والفكين",
      patientCount: 156,
      activeCount: 24,
      icon: <Scissors className="h-6 w-6 text-primary" />,
    },
  ];

  return (
    <div className="p-6 bg-background space-y-4">
      {clinics.map((clinic) => (
        <ClinicCard
          key={clinic.id}
          {...clinic}
          onViewDetails={(id) => console.log("View clinic:", id)}
        />
      ))}
    </div>
  );
}
