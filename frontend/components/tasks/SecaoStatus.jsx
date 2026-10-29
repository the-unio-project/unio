"use client";

import { PRIORIDADES } from "@/lib/prioridades";
import { estiloDaCor } from "@/lib/cores";
import { formatarDataLista } from "@/lib/datas";
import NovaTarefaInline from "@/components/tasks/NovaTarefaInline";

const COLUNAS = "grid grid-cols-[minmax(0,1fr)_8rem_7rem_7rem] items-center gap-4";

export default function SecaoStatus({ status, tarefas, membros, aoAdicionar, aoSelecionar }) {

    function nomesResponsaveis(tarefa) {
        return (tarefa.responsaveis ?? [])
            .map((id) => membros.find((m) => m.id === id)?.nome)
            .filter(Boolean)
            .join(", ");
    }

    return (
        <section className="mb-6">
            <h2
                className="inline-block font-bold text-lg mb-2 p-1 rounded"
                style={estiloDaCor(status.cor)}
            >
                {status.nome}
            </h2>
            {tarefas.length > 0 && (
                <div className={`${COLUNAS} px-2 mb-1 text-xs text-gray-500 border border-transparent`}>
                    <span>Título</span>
                    <span>Responsável</span>
                    <span>Prioridade</span>
                    <span>Data</span>
                </div>
            )}
            <ul className="flex flex-col gap-2">
                {tarefas.map((tarefa) => (
                    <li
                        key={tarefa.id}
                        className={`${COLUNAS} hover:bg-gray-100 dark:hover:bg-gray-700 transition border p-2 rounded cursor-pointer`}
                        onClick={() => aoSelecionar(tarefa.id)}
                    >
                        <button type="button" className="text-left truncate">
                            {tarefa.titulo}
                        </button>
                        <span className="text-sm text-gray-600 truncate" title={nomesResponsaveis(tarefa)}>
                            {nomesResponsaveis(tarefa) || "-"}
                        </span>
                        <span className={`justify-self-start text-xs px-2 py-1 rounded ${PRIORIDADES[tarefa.prioridade]?.cor}`}>
                            {PRIORIDADES[tarefa.prioridade]?.rotulo}
                        </span>
                        <span className="text-sm text-gray-600">
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