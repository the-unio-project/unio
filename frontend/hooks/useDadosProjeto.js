import { useTarefas } from "@/context/TarefasContext";
import { useWorkspace } from "@/context/WorkspaceContext";
import { membrosMock } from "@/lib/mock";

export function useDadosProjeto(projetoId) {
    const { tarefas: todasTarefas } = useTarefas();
    const { projetos, statusProjetos } = useWorkspace();

    const tarefas = todasTarefas.filter((t) => t.projetoId === projetoId);
    const workspaceId = projetos.find((p) => p.id === projetoId)?.workspaceId;
    const membros = membrosMock.filter((m) => m.workspaceId === workspaceId);
    const statusDoProjeto = statusProjetos.filter((s) => s.projetoId === projetoId);

    return { tarefas, membros, statusDoProjeto };
}