import DashboardProvider from "./provider";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-muted">
      <DashboardProvider>
        <main className="flex-1">
          <div className="mx-auto max-w-7xl p-6 space-y-6">
            {children}
          </div>
        </main>
      </DashboardProvider>
    </div>
  );
}
