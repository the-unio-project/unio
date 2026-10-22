"use client";

import { createContext, useContext, useState } from 'react';
import { tarefasMock } from '@/lib/mock';

const TarefasContext = createContext();

export function TarefasProvider({ children }) {
    const [tarefas, setTarefas] = useState(tarefasMock);

    function atualizarTarefa(id, mudancas) {
        setTarefas((anteriores) =>
            anteriores.map((t) => (t.id === id ? { ...t, ...mudancas } : t))
        );
    }

    function adicionarTarefa(projetoId, statusId, titulo) {
        const novaTarefa = {
            id: Date.now(),
            projetoId,
            statusId,
            titulo,
            responsaveis: [],
            prioridade: 'normal',
            dataVencimento: '',
        };
        setTarefas((anteriores) => [...anteriores, novaTarefa]);
    }

    function excluirTarefa(id) {
        setTarefas((anteriores) => anteriores.filter((t) => t.id !== id));
    }

    function excluirTarefasProjeto(projetoId) {
        setTarefas((anteriores) => anteriores.filter((t) => t.projetoId !== projetoId));
    }

    return (
        <TarefasContext.Provider value={{ tarefas, atualizarTarefa, adicionarTarefa, excluirTarefa, excluirTarefasProjeto }}>
            {children}
        </TarefasContext.Provider>
    );
}

export function useTarefas() {
    return useContext(TarefasContext);
}