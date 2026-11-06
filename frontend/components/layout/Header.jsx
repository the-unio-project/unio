"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import WorkspaceSelector from "@/components/layout/WorkspaceSelector";
import CentroNotificacoes from "@/components/notifications/CentroNotificacoes";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import Image from "next/image";

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
                <Link href="/dashboard" aria-label="Ir para o Dashboard">
                    <Image src="/logoBW.svg" alt="UNIO" width={253} height={262} priority className="h-11 w-auto" />
                </Link>
                <WorkspaceSelector />
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