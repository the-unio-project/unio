"use client";

import { useDroppable } from "@dnd-kit/core";
import { corSolida } from "@/lib/cores";
import CartaoTarefa from "@/components/tasks/CartaoTarefa";
import NovaTarefaInline from "@/components/tasks/NovaTarefaInline";

export default function ColunaKanban({ status, tarefas, membros, aoAdicionar, aoSelecionar }) {
    const { setNodeRef, isOver } = useDroppable({ id: status.id });

    return (
        <section
            ref={setNodeRef}
            style={corSolida(status.cor)}
            className={`w-72 shrink-0 rounded-lg p-3 transition ${isOver ? "ring-4 ring-inset ring-primary/70" : ""}`}
        >
            <h2 className="mb-3 px-1 text-sm font-bold">{status.nome}</h2>

            <ul className="flex flex-col gap-2">
                {tarefas.map((tarefa) => (
                    <li key={tarefa.id}>
                        <CartaoTarefa
                            tarefa={tarefa}
                            membros={membros}
                            aoClicar={() => aoSelecionar(tarefa.id)}
                        />
                    </li>
                ))}
            </ul>

            <NovaTarefaInline variante="contrast" aoAdicionar={(titulo) => aoAdicionar(status.id, titulo)} />
        </section>
    );
}