import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./components/AppSidebar";

export default function DashboardProvider({ children }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted">
        <AppSidebar />
        <main className="flex-1 w-full">
          <div className="w-full p-6 space-y-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
