"use client";

import {useWorkspace} from "@/context/WorkspaceContext";
import Link from 'next/link';

export default function Sidebar() {
    const { workspaceAtual, setWorkspaceAtual, workspaces } = useWorkspace();

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
            <ul className="flex flex-col gap-4 list-none ">
                <li><Link href="/dashboard">Dashboard</Link></li>
                <li><Link href="/projetos">Projetos</Link></li>
                <li><Link href="/membros">Membros</Link></li>
                <li><Link href="/configuracoes">Configurações</Link></li>
            </ul>
        </nav>
    )
}