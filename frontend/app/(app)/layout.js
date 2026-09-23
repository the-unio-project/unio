import { AuthProvider } from "@/context/AuthContext";
import { WorkspaceProvider } from "@/context/WorkspaceContext";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function AppLayout({ children }) {
  return (
    <AuthProvider>
    <WorkspaceProvider>
      <div className="flex">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Header />
          <main className="p-4">
            {children}
          </main>
        </div>
      </div>
    </WorkspaceProvider>
    </AuthProvider>
  );
}