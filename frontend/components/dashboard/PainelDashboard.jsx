"use client";

import { useWorkspace } from "@/context/WorkspaceContext";
import useTarefasDashboard from "@/hooks/useTarefasDashboard";

export default function PainelDashboard() {
    const { workspaceAtual, projetosAtivos } = useWorkspace();
    const { minhas, hoje, atrasadas, carregando, erro } = useTarefasDashboard();

    if (carregando) return <p className="p-4 text-gray-500">Carregando...</p>;
    if (erro) return <p className="p-4 text-red-500">{erro}</p>;

    const idsWorkspace = new Set(
        projetosAtivos
            .filter((p) => p.workspaceId === workspaceAtual.id)
            .map((p) => p.id)
    );
    const doWorkspace = (lista) => lista.filter((t) => idsWorkspace.has(t.projetoId));

    return (
        <div className="p-4">
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <p>Minhas tarefas: {doWorkspace(minhas).length}</p>
            <p>Vencendo hoje: {doWorkspace(hoje).length}</p>
            <p>Atrasadas: {doWorkspace(atrasadas).length}</p>
        </div>
    );
}