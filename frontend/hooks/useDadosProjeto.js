import { useState, useEffect } from "react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { membrosMock } from "@/lib/mock";
import { listarStatus, listarTarefas } from "@/lib/api";

export function useDadosProjeto(projetoId) {
    const { projetos } = useWorkspace();
    const [statusDoProjeto, setStatusDoProjeto] = useState([]);
    const [tarefas, setTarefas] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        let ignorarResposta = false;

        Promise.all([listarStatus(projetoId), listarTarefas(projetoId)])
            .then(([listaStatus, listaTarefas]) => {
                if (ignorarResposta) return;
                setStatusDoProjeto(listaStatus);
                setTarefas(listaTarefas);
            })
            .catch(() => {
                if (!ignorarResposta) setErro("Não foi possível carregar o projeto.");
            })
            .finally(() => {
                if (!ignorarResposta) setCarregando(false);
            });

        return () => {
            ignorarResposta = true;
        };
    }, [projetoId]);

    function atualizarTarefa(id, mudancas) {
        setTarefas((anteriores) => anteriores.map((t) => (t.id === id ? { ...t, ...mudancas } : t)));
    }

    function adicionarTarefa(statusId, titulo) {
        const nova = {
            id: Date.now(),
            projetoId,
            statusId,
            titulo,
            descricao: "",
            responsaveis: [],
            prioridade: "normal",
            dataVencimento: "",
        };
        setTarefas((anteriores) => [...anteriores, nova]);
    }

    function excluirTarefa(id) {
        setTarefas((anteriores) => anteriores.filter((t) => t.id !== id));
    }

    const workspaceId = projetos.find((p) => p.id === projetoId)?.workspaceId;
    const membros = membrosMock.filter((m) => m.workspaceId === workspaceId);

    return {
        tarefas, membros, statusDoProjeto, carregando, erro,
        atualizarTarefa, adicionarTarefa, excluirTarefa,
    };
}