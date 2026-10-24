"use client";

import { DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { agruparPorStatus } from "@/lib/tarefas";
import ColunaKanban from "@/components/tasks/ColunaKanban";

export default function KanbanBoard({ statusDoProjeto, tarefas, membros, aoAdicionar, aoSelecionar, aoMoverTarefa }) {
    const porStatus = agruparPorStatus(tarefas);

    const sensores = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
    );

    function aoSoltar({ active, over }) {
        if (!over) return;
        const tarefa = tarefas.find((t) => t.id === active.id);
        if (!tarefa || tarefa.statusId === over.id) return;
        aoMoverTarefa(active.id, over.id);
    }

    return (
        <DndContext id="kanban-board" sensors={sensores} onDragEnd={aoSoltar}>
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
        </DndContext>
    );
}