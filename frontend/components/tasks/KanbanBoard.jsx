import { agruparPorStatus } from "@/lib/tarefas";
import ColunaKanban from "@/components/tasks/ColunaKanban";

export default function KanbanBoard({ statusDoProjeto, tarefas, membros, aoAdicionar, aoSelecionar }) {
    const porStatus = agruparPorStatus(tarefas);

    return (
        <div className="flex items-start gap-4 overflow-x-auto pb-4">
            {statusDoProjeto.map((status) => (
                <ColunaKanban
                    key={status.id}
                    status={status}
                    tarefas={porStatus[status.id] || []}
                    membros={membros}
                    aoAdicionar={aoAdicionar}
                    aoSelecionar={aoSelecionar}
                />
            ))}
        </div>
    );
}