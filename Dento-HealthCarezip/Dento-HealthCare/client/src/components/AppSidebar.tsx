import { Home, Hospital, Calendar, ChevronDown, SquareCode, Clock, Users, FileTextIcon, Star, Search, CreditCard, Wand2, Brain } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface AppSidebarProps {
  activePage?: string;
  onNavigate?: (page: string) => void;
  customPages?: Array<{ id: string; name: string; content: string; icon: string }>;
}

export default function AppSidebar({ activePage = "home", onNavigate, customPages = [] }: AppSidebarProps) {
  const clinics = [
    { id: "diagnosis", name: "التشخيص والأشعة" },
    { id: "conservative", name: "العلاج التحفظي وطب وجراحة الجذور" },
    { id: "surgery", name: "جراحة الفم والفكين" },
    { id: "removable", name: "التركيبات المتحركة" },
    { id: "fixed", name: "التركيبات الثابتة" },
    { id: "gums", name: "اللثة" },
    { id: "oral-surgery", name: "الجراحة" },
    { id: "cosmetic", name: "تجميل الأسنان" },
    { id: "implants", name: "زراعة الأسنان" },
    { id: "orthodontics", name: "تقويم الأسنان" },
    { id: "pediatric", name: "أسنان الأطفال" },
  ];

  const handleClick = (page: string) => {
    console.log("التنقل إلى:", page);
    onNavigate?.(page);
  };

  return (
    <Sidebar side="right" collapsible="offcanvas">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg">
            <Hospital className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Dento Health Care</h2>
            <p className="text-xs text-[#ffffff]">جامعة الدلتا للعلوم والتكنولوجيا</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>القائمة الرئيسية</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleClick("home")}
                  isActive={activePage === "home"}
                  data-testid="nav-home"
                >
                  <Home className="w-4 h-4" />
                  <span>الرئيسية</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleClick("ai-diagnosis")}
                  isActive={activePage === "ai-diagnosis"}
                  data-testid="nav-ai-diagnosis"
                  className="font-semibold bg-gradient-to-r from-primary/10 to-blue-500/10 hover:from-primary/20 hover:to-blue-500/20"
                >
                  <Brain className="w-4 h-4 text-primary" />
                  <span>التشخيص الذكي</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton data-testid="nav-clinic-details">
                      <Hospital className="w-4 h-4" />
                      <span>تفاصيل العيادات</span>
                      <ChevronDown className="mr-auto transition-transform group-data-[state=open]/collapsible:rotate-180 w-4 h-4" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {clinics.map((clinic) => (
                        <SidebarMenuSubItem key={clinic.id}>
                          <SidebarMenuSubButton
                            onClick={() => handleClick(`clinic-${clinic.id}`)}
                            isActive={activePage === `clinic-${clinic.id}`}
                            data-testid={`nav-clinic-${clinic.id}`}
                          >
                            <span>{clinic.name}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleClick("treatment-plans")}
                  isActive={activePage === "treatment-plans"}
                  data-testid="nav-treatment-plans"
                >
                  <Calendar className="w-4 h-4" />
                  <span>الخطة العلاجية للمريض</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleClick("dentocad")}
                  isActive={activePage === "dentocad"}
                  data-testid="nav-dentocad"
                >
                  <SquareCode className="w-4 h-4" />
                  <span>Dentocad</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleClick("appointments")}
                  isActive={activePage === "appointments"}
                  data-testid="nav-appointments"
                >
                  <Clock className="w-4 h-4" />
                  <span>حجز المواعيد</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleClick("doctors")}
                  isActive={activePage === "doctors"}
                  data-testid="nav-doctors"
                >
                  <Users className="w-4 h-4" />
                  <span>الأطباء</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleClick("medical-records")}
                  isActive={activePage === "medical-records"}
                  data-testid="nav-medical-records"
                >
                  <FileTextIcon className="w-4 h-4" />
                  <span>السجل الطبي</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleClick("ratings")}
                  isActive={activePage === "ratings"}
                  data-testid="nav-ratings"
                >
                  <Star className="w-4 h-4" />
                  <span>التقييمات</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleClick("search")}
                  isActive={activePage === "search"}
                  data-testid="nav-search"
                >
                  <Search className="w-4 h-4" />
                  <span>البحث</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleClick("payment")}
                  isActive={activePage === "payment"}
                  data-testid="nav-payment"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>الفواتير والدفع</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleClick("chat")}
                  isActive={activePage === "chat"}
                  data-testid="nav-chat"
                  className="font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-500 dark:to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>Dento الذكي</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
