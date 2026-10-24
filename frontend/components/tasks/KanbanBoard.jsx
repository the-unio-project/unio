import { estiloDaCor } from "@/lib/cores";
import { agruparPorStatus } from "@/lib/tarefas";
import CartaoTarefa from "@/components/tasks/CartaoTarefa";
import NovaTarefaInline from "@/components/tasks/NovaTarefaInline";

export default function KanbanBoard({ statusDoProjeto, tarefas, membros, aoAdicionar, aoSelecionar }) {
    const porStatus = agruparPorStatus(tarefas);

    return (
        <div className="flex items-start gap-4 overflow-x-auto pb-4">
            {statusDoProjeto.map((status) => (
                <section
                    key={status.id}
                    className="w-72 shrink-0 rounded-lg bg-gray-100 dark:bg-zinc-900 p-3"
                >
                    <h2
                        className="inline-block font-bold text-sm mb-3 px-2 py-1 rounded"
                        style={estiloDaCor(status.cor)}
                    >
                        {status.nome}
                    </h2>

                    <ul className="flex flex-col gap-2">
                        {(porStatus[status.id] || []).map((tarefa) => (
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
            ))}
        </div>
    );
}