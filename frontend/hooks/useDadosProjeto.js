import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { listarStatus, listarTarefas, listarMembros } from "@/lib/api";

export function useDadosProjeto(projetoId) {
    const { workspaceId } = useParams();
    const [statusDoProjeto, setStatusDoProjeto] = useState([]);
    const [tarefas, setTarefas] = useState([]);
    const [membros, setMembros] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        let ignorarResposta = false;

        Promise.all([listarStatus(projetoId), listarTarefas(projetoId), listarMembros(workspaceId)])
            .then(([listaStatus, listaTarefas, listaMembros]) => {
                if (ignorarResposta) return;
                setStatusDoProjeto(listaStatus);
                setTarefas(listaTarefas);
                setMembros(listaMembros);
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
    }, [projetoId, workspaceId]);

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

    return {
        tarefas, membros, statusDoProjeto, carregando, erro,
        atualizarTarefa, adicionarTarefa, excluirTarefa,
    };
}