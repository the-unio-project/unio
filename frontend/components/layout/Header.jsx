"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
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
        <header className="flex items-center justify-between p-4 bg-primary text-white border-b border-primary-hover shadow-sm">
            <div className="flex items-center gap-4">
                <WorkspaceSelector />
                <input
                    type="text"
                    placeholder="Buscar..."
                    className="w-64 rounded-md border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-white placeholder-white/60 transition-colors focus:bg-white/20 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-white/50"
                />
            </div>
            <div className="flex items-center gap-4">
                <CentroNotificacoes />
                <Link href="/configuracoes" className="flex items-center gap-2 rounded-md p-1 hover:bg-white/10 transition-colors" aria-label="Configurações do perfil">
                    <Avatar nome={usuarioAtual?.nickname} src={usuarioAtual?.profile_picture} />
                    <span className="text-sm font-medium text-white">{usuarioAtual?.nickname ?? "Perfil"}</span>
                </Link>
                <Button variant="contornoClaro" onClick={handleLogout} className="hover:cursor-pointer" >
                    Sair
                </Button>
            </div>
        </header>
    )
}