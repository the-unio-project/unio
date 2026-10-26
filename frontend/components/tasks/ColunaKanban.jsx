"use client";

import { useDroppable } from "@dnd-kit/core";
import { estiloDaCor } from "@/lib/cores";
import CartaoTarefa from "@/components/tasks/CartaoTarefa";
import NovaTarefaInline from "@/components/tasks/NovaTarefaInline";

export default function ColunaKanban({ status, tarefas, membros, aoAdicionar, aoSelecionar }) {
    const { setNodeRef, isOver } = useDroppable({ id: status.id });

    return (
        <section
            ref={setNodeRef}
            className={`w-72 shrink-0 rounded-lg p-3 transition-colors ${isOver ? "bg-gray-200 dark:bg-zinc-700" : "bg-gray-100 dark:bg-zinc-900"
                }`}
        >
            <h2
                className="inline-block font-bold text-sm mb-3 px-2 py-1 rounded"
                style={estiloDaCor(status.cor)}
            >
                {status.nome}
            </h2>

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

            <NovaTarefaInline aoAdicionar={(titulo) => aoAdicionar(status.id, titulo)} />
        </section>
    );
}