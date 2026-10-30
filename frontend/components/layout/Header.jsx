"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import WorkspaceSelector from "@/components/layout/WorkspaceSelector";
import CentroNotificacoes from "@/components/notifications/CentroNotificacoes";

export default function Header() {
    const router = useRouter();
    const { fazerLogout } = useAuth();

    function handleLogout() {
        fazerLogout();
        router.push("/login");
    }

    return (
        <header className="flex justify-between p-4">
            <div className="flex items-center gap-4">
                <WorkspaceSelector />
                <input type="text" placeholder="Buscar..." className="border p-2 rounded" />
            </div>
            <div className="flex items-center gap-4">
                <CentroNotificacoes />
                <span>Perfil</span>
                <Button variant="contorno" onClick={handleLogout}>Sair</Button>
            </div>
        </header>
    )
}