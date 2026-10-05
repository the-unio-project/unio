"use client";

import { useState } from "react";
import { tarefasMock } from "@/lib/mock";
import SecaoStatus from "@/components/tasks/SecaoStatus";

export default function TaskList({ projetoId }) {
  const [tarefas, setTarefas] = useState(
    tarefasMock.filter((t) => t.projetoId === projetoId)
  );

  
  const [filtroPrioridade, setFiltroPrioridade] = useState("todas");
  const [filtroResponsavel, setFiltroResponsavel] = useState("todos");
  
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
    setTarefas([...tarefas, novaTarefa]);
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
      {Object.entries(porStatus).map(([status, tarefasDoStatus]) => (
        <SecaoStatus
          key={status}
          status={status}
          tarefas={tarefasDoStatus}
          aoAdicionar={aoAdicionar}
        />
      ))}
    </div>
  );
}