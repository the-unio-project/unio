import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
    listarStatus, listarTarefas, listarMembros, criarTarefaApi,
    editarTarefaApi, excluirTarefaApi, moverTarefaApi
} from "@/lib/api";

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

        const putModificado = CAMPOS_PUT.some((campo) => campo in mudancas && mudancas[campo] !== tarefa[campo]);
        if (putModificado) {
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

    async function moverTarefa(id, novoStatusId) {
        const posicao = tarefas.filter((t) => t.statusId === novoStatusId).length + 1;
        try {
            await moverTarefaApi(id, novoStatusId, posicao);
        } catch {
            setErroAcao("Não foi possível mover a tarefa.");
            return;
        }
        setErroAcao("");
        setTarefas((anteriores) =>
            anteriores.map((t) => (t.id === id ? { ...t, statusId: novoStatusId, position: posicao } : t))
        );
    }

    return {
        tarefas, membros, statusDoProjeto, carregando, erro,
        atualizarTarefa, adicionarTarefa, excluirTarefa,
        erroAcao, setErroAcao, moverTarefa,
    };
}