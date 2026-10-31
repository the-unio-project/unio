"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { fotoDoUsuario } from "@/lib/api";
import Button from "@/components/ui/Button";
import WorkspaceSelector from "@/components/layout/WorkspaceSelector";
import CentroNotificacoes from "@/components/notifications/CentroNotificacoes";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";

export default function Header() {
    const router = useRouter();
    const { usuarioAtual, fazerLogout } = useAuth();

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
                <Link href="/configuracoes" className="flex items-center gap-2" aria-label="Configurações do perfil">
                    <Avatar nome={usuarioAtual?.nickname} src={usuarioAtual?.profile_picture} />
                    <span>{usuarioAtual?.nickname ?? "Perfil"}</span>
                </Link>
                <Button variant="contorno" onClick={handleLogout}>Sair</Button>
            </div>
        </header>
    )
}