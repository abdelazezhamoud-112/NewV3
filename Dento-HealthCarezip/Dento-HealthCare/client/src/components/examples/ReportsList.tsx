import ReportsList from "../ReportsList";

export default function ReportsListExample() {
  return (
    <div className="p-6 bg-background">
      <ReportsList 
        onViewReport={(id) => console.log("View report:", id)}
        onAddReport={() => console.log("Add new report")}
      />
    </div>
  );
}
