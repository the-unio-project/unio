"use client";

import { useState } from "react";
import { useDadosProjeto } from "@/hooks/useDadosProjeto";
import { useFiltrosTarefas } from "@/hooks/useFiltrosTarefas";
import FiltrosTarefas from "@/components/tasks/FiltrosTarefas";
import TaskList from "@/components/tasks/TaskList";
import ModalTarefa from "@/components/tasks/ModalTarefa";
import ModosVisualizacao from "@/components/tasks/ModosVisualizacao";
import KanbanBoard from "@/components/tasks/KanbanBoard";

export default function VisaoProjeto({ projetoId }) {
    const {
        tarefas, membros, statusDoProjeto, carregando, erro, atualizarTarefa,
        adicionarTarefa, excluirTarefa, moverTarefa,
        adicionarResponsavel, removerResponsavel,
    } = useDadosProjeto(projetoId);
    const {
        filtroPrioridade,
        setFiltroPrioridade,
        filtroResponsavel,
        setFiltroResponsavel,
        tarefasFiltradas,
    } = useFiltrosTarefas(tarefas);

    const [visao, setVisao] = useState("lista");
    const [tarefaSelecionadaId, setTarefaSelecionadaId] = useState(null);
    const tarefaSelecionada = tarefas.find((t) => t.id === tarefaSelecionadaId);

    function aoAdicionar(statusId, titulo) {
        return adicionarTarefa(statusId, titulo);
    }

    async function excluir(id) {
        const deuCerto = await excluirTarefa(id);
        if (deuCerto) setTarefaSelecionadaId(null);
    }

    if (carregando) return <p className="p-4 text-gray-500">Carregando...</p>;
    if (erro) return <p className="p-4 text-red-500">{erro}</p>;

    return (
        <div className="p-4">
            <ModosVisualizacao visaoAtual={visao} aoMudar={setVisao} />
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

            {visao === "lista" ? (
                <TaskList
                    statusDoProjeto={statusDoProjeto}
                    tarefas={tarefasFiltradas}
                    membros={membros}
                    aoAdicionar={aoAdicionar}
                    aoSelecionar={setTarefaSelecionadaId}
                />
            ) : (
                <KanbanBoard
                    statusDoProjeto={statusDoProjeto}
                    tarefas={tarefasFiltradas}
                    membros={membros}
                    aoAdicionar={aoAdicionar}
                    aoSelecionar={setTarefaSelecionadaId}
                    aoMoverTarefa={moverTarefa}
                />
            )}

            {tarefaSelecionada && (
                <ModalTarefa
                    tarefa={tarefaSelecionada}
                    aoFechar={() => setTarefaSelecionadaId(null)}
                    aoAtualizar={atualizarTarefa}
                    aoMover={moverTarefa}
                    membros={membros}
                    aoAdicionarResponsavel={adicionarResponsavel}
                    aoRemoverResponsavel={removerResponsavel}
                    statusDoProjeto={statusDoProjeto}
                    aoExcluir={excluir}
                />
            )}
        </div>
    );
}