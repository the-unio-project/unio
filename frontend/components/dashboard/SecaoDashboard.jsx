import Link from "next/link";
import { PRIORIDADES } from "@/lib/prioridades";
import { formatarData } from "@/lib/datas";

export default function SecaoDashboard({ titulo, tarefas, projetosPorId, workspaceId, mensagemVazia, alerta = false, }) {
    return (
        <section className="rounded-xl bg-white p-5 shadow-sm dark:bg-neutral-900">
            <h2 className="mb-3 flex items-center gap-2">
                <span
                    className={`rounded-lg px-3 py-1 font-titulo text-lg ${alerta ? "bg-erro text-white" : "bg-info text-carvao"
                        }`}
                >
                    {titulo}
                </span>
                <span className="text-sm text-neutral-500 dark:text-neutral-400">({tarefas.length})</span>
            </h2>

            {tarefas.length === 0 ? (
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{mensagemVazia}</p>
            ) : (
                <ul className="flex flex-col gap-1">
                    {tarefas.map((tarefa) => {
                        const prioridade = PRIORIDADES[tarefa.prioridade];

                        return (
                            <li key={tarefa.id}>
                                <Link
                                    href={`/${workspaceId}/projetos/${tarefa.projetoId}`}
                                    className="flex items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-primary/10 dark:hover:bg-primary/30"
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-medium text-carvao dark:text-gray-100">
                                            {tarefa.titulo}
                                        </p>
                                        <p className="truncate text-sm text-neutral-500 dark:text-neutral-400">
                                            {projetosPorId.get(tarefa.projetoId)?.nome}
                                        </p>
                                    </div>

                                    {prioridade && (
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${prioridade.cor}`}>
                                            {prioridade.rotulo}
                                        </span>
                                    )}

                                    <span className={`text-sm ${alerta ? "font-medium text-erro" : "text-neutral-500 dark:text-neutral-400"}`}>
                                        {formatarData(tarefa.dataVencimento)}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
}