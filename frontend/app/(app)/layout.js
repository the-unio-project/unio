import { WorkspaceProvider } from "@/context/WorkspaceContext";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function AppLayout({ children }) {
  return (
    <WorkspaceProvider>
      <div className="flex h-screen flex-col">
        <Header />
        <div className="flex flex-1 gap-4 overflow-hidden bg-neutral-200 p-4 dark:bg-neutral-950">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </WorkspaceProvider>
  );
}