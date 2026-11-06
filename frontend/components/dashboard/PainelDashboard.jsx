"use client";

import { useWorkspace } from "@/context/WorkspaceContext";
import useTarefasDashboard from "@/hooks/useTarefasDashboard";
import SecaoDashboard from "@/components/dashboard/SecaoDashboard";

export default function PainelDashboard() {
    const { workspaceAtual, projetosAtivos } = useWorkspace();
    const { minhas, hoje, atrasadas, carregando, erro } = useTarefasDashboard();

    if (carregando) return <p className="p-4 text-neutral-500">Carregando...</p>;
    if (erro) return <p className="p-4 text-erro">{erro}</p>;

    const projetosPorId = new Map(
        projetosAtivos
            .filter((p) => p.workspaceId === workspaceAtual.id)
            .map((p) => [p.id, p])
    );
    const doWorkspace = (lista) => lista.filter((t) => projetosPorId.has(t.projetoId));

    return (
        <div className="flex flex-col gap-4 p-4">
            <h1 className="font-titulo text-3xl">Dashboard</h1>

            <div className="grid gap-4 lg:grid-cols-2">
                <SecaoDashboard
                    titulo="Vencendo hoje"
                    tarefas={doWorkspace(hoje)}
                    projetosPorId={projetosPorId}
                    workspaceId={workspaceAtual.id}
                    mensagemVazia="Nenhuma tarefa vence hoje."
                />
                <SecaoDashboard
                    titulo="Atrasadas"
                    tarefas={doWorkspace(atrasadas)}
                    projetosPorId={projetosPorId}
                    workspaceId={workspaceAtual.id}
                    mensagemVazia="Você não tem tarefas atrasadas."
                    alerta
                />
            </div>

            <SecaoDashboard
                titulo="Minhas tarefas"
                tarefas={doWorkspace(minhas)}
                projetosPorId={projetosPorId}
                workspaceId={workspaceAtual.id}
                mensagemVazia="Você não tem tarefas atribuídas."
            />
        </div>
    );
}