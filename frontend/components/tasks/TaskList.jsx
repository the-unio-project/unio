"use client";

import { useState } from "react";
import { tarefasMock } from "@/lib/mock";
import SecaoStatus from "@/components/tasks/SecaoStatus";
import ModalTarefa from "@/components/tasks/ModalTarefa";

const STATUS = ["A fazer", "Em andamento", "Concluída"];

export default function TaskList({ projetoId }) {
  const [tarefas, setTarefas] = useState(
    tarefasMock.filter((t) => t.projetoId === projetoId)
  );

  
  const [filtroPrioridade, setFiltroPrioridade] = useState("todas");
  const [filtroResponsavel, setFiltroResponsavel] = useState("todos");
  const [tarefaSelecionadaId, setTarefaSelecionadaId] = useState(null);

  const tarefaSelecionada = tarefas.find((t) => t.id === tarefaSelecionadaId);

  function atualizarTarefa(id, mudancas) {
    setTarefas((anteriores) =>
      anteriores.map((t) => (t.id === id ? { ...t, ...mudancas } : t))
    );
  }
  
  const responsaveis = [...new Set(tarefas.map(t => t.responsavel))];
  const tarefasFiltradas = tarefas.filter((tarefa) => {
    const prioridadeValida = filtroPrioridade === "todas" || tarefa.prioridade === filtroPrioridade;
    const responsavelValido = filtroResponsavel === "todos" || tarefa.responsavel === filtroResponsavel;
    return prioridadeValida && responsavelValido;
  });
  
  const porStatus = tarefasFiltradas.reduce((acc, tarefa) => {
    acc[tarefa.status] = acc[tarefa.status] || [];
    acc[tarefa.status].push(tarefa);
    return acc;
  }, {});

  function aoAdicionar(status, titulo) {
    const novaTarefa = {
      id: Date.now(),
      titulo,
      status,
      prioridade: "baixa",
      responsavel: "-",
      dataVencimento: "",
      projetoId,
    }
    setTarefas((anteriores) => [...anteriores, novaTarefa]);
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
          <option value="alta">Alta</option>
          <option value="média">Média</option>
          <option value="baixa">Baixa</option>
        </select>

        <select
          value={filtroResponsavel}
          onChange={(e) => setFiltroResponsavel(e.target.value)}
          className="border p-2 rounded text-sm"
        >
          <option value="todos">Responsável</option>
          {responsaveis.map((nome) => (
            <option key={nome} value={nome}>
              {nome}
            </option>
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
          />
        ))}
      {tarefaSelecionada && (
        <ModalTarefa
          tarefa={tarefaSelecionada}
          aoFechar={() => setTarefaSelecionadaId(null)}
          aoAtualizar={atualizarTarefa}
        />
      )}
    </div>
  );
}