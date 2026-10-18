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

    function adicionarTarefa(projetoId, status, titulo) {
        const novaTarefa = {
            id: Date.now(),
            projetoId,
            status,
            titulo,
            responsaveis: [],
            prioridade: 'normal',
            dataVencimento: '',
        };
        setTarefas((anteriores) => [...anteriores, novaTarefa]);
    }

    return (
        <TarefasContext.Provider value={{ tarefas, atualizarTarefa, adicionarTarefa }}>
            {children}
        </TarefasContext.Provider>
    );
}

export function useTarefas() {
    return useContext(TarefasContext);
}