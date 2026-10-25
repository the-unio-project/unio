"use client";

import { useDraggable } from "@dnd-kit/core";
import CartaoVisual from "@/components/tasks/CartaoVisual";

export default function CartaoTarefa({ tarefa, membros, aoClicar }) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: tarefa.id });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            onClick={aoClicar}
            className={`group rounded-lg cursor-grab select-none transition-shadow hover:shadow-md ${isDragging ? "opacity-40" : ""}`}
        >
            <CartaoVisual tarefa={tarefa} membros={membros} />
        </div>
    );
}