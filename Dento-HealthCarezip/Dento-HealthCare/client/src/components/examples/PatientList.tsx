import PatientList from "../PatientList";

export default function PatientListExample() {
  return (
    <div className="p-6 bg-background">
      <PatientList 
        clinicName="التشخيص والأشعة" 
        onViewPatient={(id) => console.log("View patient:", id)}
      />
    </div>
  );
}
