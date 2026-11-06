import SecaoStatus from "@/components/tasks/SecaoStatus";
import { agruparPorStatus, SEM_STATUS } from "@/lib/tarefas";

export default function TaskList({ statusDoProjeto, tarefas, membros, aoAdicionar, aoSelecionar }) {
  const porStatus = agruparPorStatus(tarefas);
  const semStatus = porStatus[null] || [];

  return (
    <>
      {semStatus.length > 0 && (
        <SecaoStatus
          status={SEM_STATUS}
          tarefas={semStatus}
          aoSelecionar={aoSelecionar}
          membros={membros}
        />
      )}
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