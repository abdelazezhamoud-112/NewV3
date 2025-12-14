import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "../AppSidebar";

export default function AppSidebarExample() {
  const style = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar activePage="home" onNavigate={(page) => console.log("Navigate to:", page)} />
        <div className="flex-1 p-6 bg-background">
          <p className="text-muted-foreground">المحتوى الرئيسي هنا</p>
        </div>
      </div>
    </SidebarProvider>
  );
}
