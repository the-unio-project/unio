import SecaoStatus from "@/components/tasks/SecaoStatus";
import { agruparPorStatus } from "@/lib/tarefas";

export default function TaskList({ statusDoProjeto, tarefas, membros, aoAdicionar, aoSelecionar }) {
  const porStatus = agruparPorStatus(tarefas);

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