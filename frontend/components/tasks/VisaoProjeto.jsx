"use client";

import { useState } from "react";
import { useTarefas } from "@/context/TarefasContext";
import { useDadosProjeto } from "@/hooks/useDadosProjeto";
import { useFiltrosTarefas } from "@/hooks/useFiltrosTarefas";
import FiltrosTarefas from "@/components/tasks/FiltrosTarefas";
import TaskList from "@/components/tasks/TaskList";
import ModalTarefa from "@/components/tasks/ModalTarefa";

export default function VisaoProjeto({ projetoId }) {
    const { atualizarTarefa, adicionarTarefa, excluirTarefa } = useTarefas();
    const { tarefas, membros, statusDoProjeto } = useDadosProjeto(projetoId);
    const {
        filtroPrioridade,
        setFiltroPrioridade,
        filtroResponsavel,
        setFiltroResponsavel,
        tarefasFiltradas,
    } = useFiltrosTarefas(tarefas);

    const [tarefaSelecionadaId, setTarefaSelecionadaId] = useState(null);
    const tarefaSelecionada = tarefas.find((t) => t.id === tarefaSelecionadaId);

    function aoAdicionar(statusId, titulo) {
        adicionarTarefa(projetoId, statusId, titulo);
    }

    function excluir(id) {
        excluirTarefa(id);
        setTarefaSelecionadaId(null);
    }

    return (
        <div className="p-4">
            <FiltrosTarefas
                membros={membros}
                filtroPrioridade={filtroPrioridade}
                aoMudarPrioridade={setFiltroPrioridade}
                filtroResponsavel={filtroResponsavel}
                aoMudarResponsavel={setFiltroResponsavel}
            />

            {statusDoProjeto.length === 0 && (
                <p className="text-gray-500 mb-4">Este projeto ainda não tem status.</p>
            )}

            {tarefas.length === 0 && statusDoProjeto.length > 0 && (
                <p className="text-gray-500 mb-4">Esse projeto ainda não possui tarefas, crie a primeira abaixo.</p>
            )}

            {tarefas.length > 0 && tarefasFiltradas.length === 0 && (
                <p className="text-gray-500 mb-4">Nenhuma tarefa corresponde aos filtros aplicados.</p>
            )}

            <TaskList
                statusDoProjeto={statusDoProjeto}
                tarefas={tarefasFiltradas}
                membros={membros}
                aoAdicionar={aoAdicionar}
                aoSelecionar={setTarefaSelecionadaId}
            />

            {tarefaSelecionada && (
                <ModalTarefa
                    tarefa={tarefaSelecionada}
                    aoFechar={() => setTarefaSelecionadaId(null)}
                    aoAtualizar={atualizarTarefa}
                    membros={membros}
                    statusDoProjeto={statusDoProjeto}
                    aoExcluir={excluir}
                />
            )}
        </div>
    );
}