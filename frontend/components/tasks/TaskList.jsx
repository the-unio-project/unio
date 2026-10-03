"use client";

import { useState } from "react";
import { tarefasMock } from "@/lib/mock";
import SecaoStatus from "@/components/tasks/SecaoStatus";

export default function TaskList({ projetoId }) {
  const [tarefas, setTarefas] = useState(
    tarefasMock.filter((t) => t.projetoId === projetoId)
  );

  const porStatus = tarefas.reduce((acc, tarefa) => {
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