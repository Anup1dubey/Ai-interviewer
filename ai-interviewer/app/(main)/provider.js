import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./components/AppSidebar";

export default function DashboardProvider({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex-1">
        {children}
      </div>
    </SidebarProvider>
  );
}
