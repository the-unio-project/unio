"use client";

import { useState } from "react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { projetosMock } from "@/lib/mock";
import Link from 'next/link';

export default function Sidebar() {
    const { workspaceAtual, setWorkspaceAtual, workspaces } = useWorkspace();
    const [projetosAberto, setProjetosAberto] = useState(true);

    const projetos = workspaceAtual
        ? projetosMock.filter((projeto) => projeto.workspaceId === workspaceAtual.id)
        : [];

    return (
        <nav className="w-64 h-screen p-4">
            <span className="text-lg font-bold">
                {workspaceAtual ? workspaceAtual.nome : "Carregando..."}
            </span>
            <ul className="flex flex-col gap-2 list-none mt-4">
                {workspaces.map((workspace) => (
                    <li key={workspace.id}>
                        <button onClick={() => setWorkspaceAtual(workspace)}>
                            {workspace.nome}
                        </button>
                    </li>
                ))}
            </ul>

            <button
                onClick={() => setProjetosAberto(!projetosAberto)}
                className="flex items-center gap-2 mt-4 font-semibold"
            >
                {projetosAberto ? "▼" : "▶"} Projetos
            </button>
            {projetosAberto && (
                <ul className="flex flex-col gap-2 list-none mt-2 ml-2">
                    {projetos.map((projeto) => (
                        <li key={projeto.id}>
                            <Link href={`/${workspaceAtual.id}/projetos/${projeto.id}`}>
                                {projeto.nome}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}

            <ul className="flex flex-col gap-4 list-none mt-4">
                <li><Link href="/dashboard">Dashboard</Link></li>
                {workspaceAtual && (
                    <>
                        <li><Link href={`/${workspaceAtual.id}/membros`}>Membros</Link></li>
                        <li><Link href={`/${workspaceAtual.id}/settings`}>Configurações</Link></li>
                    </>
                )}
            </ul>
        </nav>
    )
}