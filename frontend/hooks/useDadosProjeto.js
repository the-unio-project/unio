import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import {
    listarStatus, listarTarefas, listarMembros, criarTarefaApi,
    editarTarefaApi, excluirTarefaApi, moverTarefaApi,
    adicionarResponsavelApi, removerResponsavelApi
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
    const filaMover = useRef(Promise.resolve());

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
        const tarefaAntes = tarefas.find((t) => t.id === id);
        if (!tarefaAntes) return;
        const posicao = tarefas.filter((t) => t.statusId === novoStatusId).length + 1;

        setTarefas((anteriores) =>
            anteriores.map((t) => (t.id === id ? { ...t, statusId: novoStatusId, position: posicao } : t))
        );

        const envio = filaMover.current.then(() => moverTarefaApi(id, novoStatusId, posicao));
        filaMover.current = envio.catch(() => { });

        try {
            await envio;
            setErroAcao("");
        } catch {
            setTarefas((anteriores) => anteriores.map((t) => (t.id === id ? tarefaAntes : t)));
            setErroAcao("Não foi possível mover a tarefa.");
        }
    }

    async function adicionarResponsavel(tarefaId, usuarioId) {
        try {
            await adicionarResponsavelApi(tarefaId, usuarioId);
        } catch {
            setErroAcao("Não foi possível adicionar o responsável.");
            return;
        }
        setErroAcao("");
        setTarefas((anteriores) =>
            anteriores.map((t) => (t.id === tarefaId ? { ...t, responsaveis: [...t.responsaveis, usuarioId] } : t))
        );
    }

    async function removerResponsavel(tarefaId, usuarioId) {
        try {
            await removerResponsavelApi(tarefaId, usuarioId);
        } catch {
            setErroAcao("Não foi possível remover o responsável.");
            return;
        }
        setErroAcao("");
        setTarefas((anteriores) =>
            anteriores.map((t) =>
                t.id === tarefaId ? { ...t, responsaveis: t.responsaveis.filter((id) => id !== usuarioId) } : t
            )
        );
    }

    return {
        tarefas, membros, statusDoProjeto, carregando, erro,
        atualizarTarefa, adicionarTarefa, excluirTarefa,
        erroAcao, setErroAcao, moverTarefa, adicionarResponsavel, removerResponsavel
    };
}