"use client";
import { useState } from "react";
import { tarefasMock } from "@/lib/mock";

export default function TaskList({ projetoId }) {
  const [tarefas, setTarefas] = useState(
    tarefasMock.filter((t) => t.projetoId === projetoId)
  );

  const porStatus = tarefas.reduce((acc, tarefa) => {
    acc[tarefa.status] = acc[tarefa.status] || [];
    acc[tarefa.status].push(tarefa);
    return acc;
  }, {});

  return (
    <div>
      {Object.entries(porStatus).map(([status, tarefasDoStatus]) => (
        <section key={status}>
          <h2>{status}</h2>
          <ul>
            {tarefasDoStatus.map((t) => (
              <li key={t.id}>{t.titulo}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}