import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { listarStatus, listarTarefas, listarMembros, criarTarefaApi, editarTarefaApi, excluirTarefaApi } from "@/lib/api";

const CAMPOS_PUT = ["titulo", "descricao", "prioridade", "dataVencimento"];

export function useDadosProjeto(projetoId) {
    const { workspaceId } = useParams();
    const [statusDoProjeto, setStatusDoProjeto] = useState([]);
    const [tarefas, setTarefas] = useState([]);
    const [membros, setMembros] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);
    const [erroAcao, setErroAcao] = useState("");

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

    async function atualizarTarefa(id, mudancas) {
        const tarefa = tarefas.find((t) => t.id === id);
        if (!tarefa) return;

        const precisaSalvar = CAMPOS_PUT.some((campo) => campo in mudancas && mudancas[campo] !== tarefa[campo]);
        if (precisaSalvar) {
            try {
                await editarTarefaApi({ ...tarefa, ...mudancas });
            } catch {
                setErroAcao("Não foi possível salvar a alteração.");
                return;
            }
        }
        setErroAcao("");
        setTarefas((anteriores) => anteriores.map((t) => (t.id === id ? { ...t, ...mudancas } : t)));
    }

    async function adicionarTarefa(statusId, titulo) {
        const nova = await criarTarefaApi(projetoId, statusId, titulo);
        setTarefas((anteriores) => [...anteriores, nova]);
    }

    async function excluirTarefa(id) {
        try {
            await excluirTarefaApi(id);
        } catch {
            setErroAcao("Não foi possível excluir a tarefa.");
            return false;
        }
        setErroAcao("");
        setTarefas((anteriores) => anteriores.filter((t) => t.id !== id));
        return true;
    }

    return {
        tarefas, membros, statusDoProjeto, carregando, erro,
        atualizarTarefa, adicionarTarefa, excluirTarefa,
        erroAcao, setErroAcao,
    };
}