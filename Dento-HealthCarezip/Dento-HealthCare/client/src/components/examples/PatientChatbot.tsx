import PatientChatbot from "../PatientChatbot";

export default function PatientChatbotExample() {
  return (
    <div className="p-6 bg-background">
      <PatientChatbot patientName="أحمد محمد" onClose={() => console.log("Close chatbot")} />
    </div>
  );
}
