"use client";

import { useState } from "react";
import { useTarefas } from "@/context/TarefasContext";
import { useWorkspace } from "@/context/WorkspaceContext";
import { membrosMock } from "@/lib/mock";
import SecaoStatus from "@/components/tasks/SecaoStatus";
import ModalTarefa from "@/components/tasks/ModalTarefa";
import { PRIORIDADES } from "@/lib/prioridades";

const STATUS = ["A fazer", "Em andamento", "Concluída"];

export default function TaskList({ projetoId }) {
  const { tarefas: todasTarefas, atualizarTarefa, adicionarTarefa } = useTarefas();
  const tarefas = todasTarefas.filter((t) => t.projetoId === projetoId);
  const { projetos } = useWorkspace();
  const workspaceId = projetos.find((p) => p.id === projetoId)?.workspaceId;
  const membros = membrosMock.filter((m) => m.workspaceId === workspaceId);


  const [filtroPrioridade, setFiltroPrioridade] = useState("todas");
  const [filtroResponsavel, setFiltroResponsavel] = useState("todos");
  const [tarefaSelecionadaId, setTarefaSelecionadaId] = useState(null);
  const tarefaSelecionada = tarefas.find((t) => t.id === tarefaSelecionadaId);

  const tarefasFiltradas = tarefas.filter((tarefa) => {
    const prioridadeValida = filtroPrioridade === "todas" || tarefa.prioridade === filtroPrioridade;
    const responsavelValido = filtroResponsavel === "todos" || (tarefa.responsaveis ?? []).includes(Number(filtroResponsavel));
    return prioridadeValida && responsavelValido;
  });

  const porStatus = tarefasFiltradas.reduce((acc, tarefa) => {
    acc[tarefa.status] = acc[tarefa.status] || [];
    acc[tarefa.status].push(tarefa);
    return acc;
  }, {});

  function aoAdicionar(status, titulo) {
    adicionarTarefa(projetoId, status, titulo);
  }

  return (
    <div className="p-4">
      <div className="flex gap-4 mb-4">
        <select
          value={filtroPrioridade}
          onChange={(e) => setFiltroPrioridade(e.target.value)}
          className="border p-2 rounded text-sm"
        >
          <option value="todas">Prioridade</option>
          {Object.entries(PRIORIDADES).map(([valor, { rotulo }]) => (
            <option key={valor} value={valor}>{rotulo}</option>
          ))}
        </select>

        <select
          value={filtroResponsavel}
          onChange={(e) => setFiltroResponsavel(e.target.value)}
          className="border p-2 rounded text-sm"
        >
          <option value="todos">Responsável</option>
          {membros.map((m) => (
            <option key={m.id} value={m.id}>{m.nome}</option>
          ))}
        </select>
      </div>
      {tarefas.length === 0 && (
        <p className="text-gray-500 mb-4">Esse projeto ainda não possui tarefas, crie a primeira abaixo.</p>
      )}

      {tarefas.length > 0 && tarefasFiltradas.length === 0 && (
        <p className="text-gray-500 mb-4">Nenhuma tarefa corresponde aos filtros aplicados.</p>
      )}

      {STATUS.map((status) => (
        <SecaoStatus
          key={status}
          status={status}
          tarefas={porStatus[status] || []}
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
        />
      )}
    </div>
  );
}