"use client";

import { PRIORIDADES } from "@/lib/prioridades";
import { corSolida } from "@/lib/cores";
import { formatarDataLista } from "@/lib/datas";
import NovaTarefaInline from "@/components/tasks/NovaTarefaInline";

const COLUNAS = "grid grid-cols-[minmax(0,1fr)_8rem_7rem_7rem] items-center gap-8";

export default function SecaoStatus({ status, tarefas, membros, aoAdicionar, aoSelecionar }) {

    function nomesResponsaveis(tarefa) {
        return (tarefa.responsaveis ?? [])
            .map((id) => membros.find((m) => m.id === id)?.nome)
            .filter(Boolean)
            .join(", ");
    }

    return (
        <section className="mb-4 rounded-xl bg-white p-4 shadow-sm dark:bg-neutral-900">
            <h2
                className="mb-3 inline-block rounded-lg px-3 py-1 text-lg font-bold"
                style={corSolida(status.cor)}
            >
                {status.nome}
            </h2>
            {tarefas.length > 0 && (
                <div className={`${COLUNAS} border-b border-neutral-300 px-3 pb-1 text-xs font-medium text-neutral-500 dark:border-neutral-700 dark:text-neutral-400`}>
                    <span>Título</span>
                    <span>Responsável</span>
                    <span>Prioridade</span>
                    <span>Data</span>
                </div>
            )}
            <ul className="flex flex-col divide-y divide-neutral-200 dark:divide-neutral-800">
                {tarefas.map((tarefa) => (
                    <li
                        key={tarefa.id}
                        className={`${COLUNAS} hover:cursor-pointer rounded-lg px-3 py-2 transition hover:bg-primary/10`}
                        onClick={() => aoSelecionar(tarefa.id)}
                    >
                        <button type="button" className="truncate text-left font-medium hover:cursor-pointer">
                            {tarefa.titulo}
                        </button>
                        <span className="truncate text-sm text-neutral-600 dark:text-neutral-400" title={nomesResponsaveis(tarefa)}>
                            {nomesResponsaveis(tarefa) || "-"}
                        </span>
                        <span className={`justify-self-start text-xs px-2 py-1 rounded ${PRIORIDADES[tarefa.prioridade]?.cor}`}>
                            {PRIORIDADES[tarefa.prioridade]?.rotulo}
                        </span>
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                            {formatarDataLista(tarefa.dataVencimento)}
                        </span>
                    </li>
                ))}
            </ul>
            {status.id !== null && (
                <NovaTarefaInline aoAdicionar={(titulo) => aoAdicionar(status.id, titulo)} />
            )}
        </section>
    )
}