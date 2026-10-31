"use client";

import { useAuth } from "@/context/AuthContext";
import PaginaPerfil from "@/components/profile/PaginaPerfil";

export default function Configuracoes() {
    const { usuarioAtual } = useAuth();

    if (!usuarioAtual) return <p className="p-4 text-gray-500">Carregando...</p>;

    return (
        <div className="max-w-xl p-6">
            <h1 className="mb-6 text-2xl font-bold">Configurações do perfil</h1>
            <PaginaPerfil usuario={usuarioAtual} />
        </div>
    );
}