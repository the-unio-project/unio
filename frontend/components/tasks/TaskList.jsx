"use client";

import { useState } from "react";
import { useTarefas } from "@/context/TarefasContext";
import { useDadosProjeto } from "@/hooks/useDadosProjeto";
import { useFiltrosTarefas } from "@/hooks/useFiltrosTarefas";
import FiltrosTarefas from "@/components/tasks/FiltrosTarefas";
import SecaoStatus from "@/components/tasks/SecaoStatus";
import ModalTarefa from "@/components/tasks/ModalTarefa";

export default function TaskList({ projetoId }) {
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

  const porStatus = tarefasFiltradas.reduce((acc, tarefa) => {
    acc[tarefa.statusId] = acc[tarefa.statusId] || [];
    acc[tarefa.statusId].push(tarefa);
    return acc;
  }, {});

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

      {statusDoProjeto.map((status) => (
        <SecaoStatus
          key={status.id}
          status={status}
          tarefas={porStatus[status.id] || []}
          aoAdicionar={aoAdicionar}
          aoSelecionar={setTarefaSelecionadaId}
          membros={membros}
        />
      ))}
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