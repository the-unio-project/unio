"use client";

import { useAuth } from "@/context/AuthContext";
import PaginaPerfil from "@/components/profile/PaginaPerfil";

export default function Configuracoes() {
    const { usuarioAtual } = useAuth();

    if (!usuarioAtual) return <p className="p-4 text-neutral-500">Carregando...</p>;

    return (
        <div className="p-4">
            <h1 className="mb-4 font-titulo text-3xl">Configurações do perfil</h1>
            <PaginaPerfil usuario={usuarioAtual} />
        </div>
    )
}