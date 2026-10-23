import SecaoStatus from "@/components/tasks/SecaoStatus";

export default function TaskList({ statusDoProjeto, tarefas, membros, aoAdicionar, aoSelecionar }) {
  const porStatus = tarefas.reduce((acc, tarefa) => {
    acc[tarefa.statusId] = acc[tarefa.statusId] || [];
    acc[tarefa.statusId].push(tarefa);
    return acc;
  }, {});

  return (
    <>
      {statusDoProjeto.map((status) => (
        <SecaoStatus
          key={status.id}
          status={status}
          tarefas={porStatus[status.id] || []}
          aoAdicionar={aoAdicionar}
          aoSelecionar={aoSelecionar}
          membros={membros}
        />
      ))}
    </>
  );
}