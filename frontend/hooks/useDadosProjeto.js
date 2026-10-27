import { useState, useEffect } from "react";
import { useTarefas } from "@/context/TarefasContext";
import { useWorkspace } from "@/context/WorkspaceContext";
import { membrosMock } from "@/lib/mock";
import { listarStatus } from "@/lib/api";

export function useDadosProjeto(projetoId) {
    const { tarefas: todasTarefas } = useTarefas();
    const { projetos } = useWorkspace();
    const [statusDoProjeto, setStatusDoProjeto] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        let ignorarResposta = false;

        listarStatus(projetoId)
            .then((lista) => {
                if (!ignorarResposta) setStatusDoProjeto(lista);
            })
            .catch(() => {
                if (!ignorarResposta) setErro("Não foi possível carregar os status do projeto.");
            })
            .finally(() => {
                if (!ignorarResposta) setCarregando(false);
            });

        return () => {
            ignorarResposta = true;
        };
    }, [projetoId]);

    const tarefas = todasTarefas.filter((t) => t.projetoId === projetoId);
    const workspaceId = projetos.find((p) => p.id === projetoId)?.workspaceId;
    const membros = membrosMock.filter((m) => m.workspaceId === workspaceId);

    return { tarefas, membros, statusDoProjeto, carregando, erro };
}