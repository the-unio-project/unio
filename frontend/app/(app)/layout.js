import { WorkspaceProvider } from "@/context/WorkspaceContext";
import { TarefasProvider } from "@/context/TarefasContext";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function AppLayout({ children }) {
  return (
    <WorkspaceProvider>
      <TarefasProvider>
        <div className="flex h-screen flex-col">
          <Header />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </div>
      </TarefasProvider>
    </WorkspaceProvider>
  );
}