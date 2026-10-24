"use client";

import { useDraggable } from "@dnd-kit/core";
import Avatar from "@/components/ui/Avatar";
import { PRIORIDADES } from "@/lib/prioridades";
import { formatarData } from "@/lib/datas";

const MAX_AVATARES = 3;

export default function CartaoTarefa({ tarefa, membros, aoClicar }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: tarefa.id });
    const estilo = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;
    const prioridade = PRIORIDADES[tarefa.prioridade];
    const responsaveis = (tarefa.responsaveis ?? []).map((id) => membros.find((m) => m.id === id)).filter(Boolean);
    const visiveis = responsaveis.slice(0, MAX_AVATARES);
    const extras = responsaveis.length - visiveis.length;

    return (
        <div
            ref={setNodeRef}
            style={estilo}
            {...listeners}
            {...attributes}
            onClick={aoClicar}
            className={`rounded-lg border bg-white dark:bg-zinc-800 p-3 cursor-grab select-none hover:shadow transition-shadow ${isDragging ? "relative z-10 opacity-80 shadow-lg" : ""}`}
        >
            <p className="text-sm font-medium mb-2">{tarefa.titulo}</p>

            {prioridade && (
                <span className={`inline-block text-xs px-2 py-1 rounded ${prioridade.cor}`}>
                    {prioridade.rotulo}
                </span>
            )}

            <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-xs text-gray-500">{formatarData(tarefa.dataVencimento)}</span>

                <div className="flex -space-x-2">
                    {visiveis.map((m) => (
                        <span key={m.id} className="rounded-full ring-2 ring-white dark:ring-gray-900">
                            <Avatar nome={m.nome} src={m.foto} tamanho="sm" />
                        </span>
                    ))}
                    {extras > 0 && (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-300 text-[10px] font-medium text-gray-700 ring-2 ring-white dark:ring-gray-900">
                            +{extras}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}