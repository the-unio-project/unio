import Link from "next/link";
import { PRIORIDADES } from "@/lib/prioridades";
import { formatarData } from "@/lib/datas";

export default function SecaoDashboard({ titulo, tarefas, projetosPorId, workspaceId, mensagemVazia, alerta = false, }) {
    return (
        <section className="rounded-lg bg-white p-4 shadow-sm dark:bg-neutral-900">
            <h2 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-100">
                {titulo}{" "}
                <span className="text-sm font-normal text-gray-500">({tarefas.length})</span>
            </h2>

            {tarefas.length === 0 ? (
                <p className="text-sm text-gray-500">{mensagemVazia}</p>
            ) : (
                <ul className="flex flex-col gap-1">
                    {tarefas.map((tarefa) => {
                        const prioridade = PRIORIDADES[tarefa.prioridade];

                        return (
                            <li key={tarefa.id}>
                                <Link
                                    href={`/${workspaceId}/projetos/${tarefa.projetoId}`}
                                    className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-primary/10 transition dark:hover:bg-gray-700"
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-medium text-gray-800 dark:text-gray-100">
                                            {tarefa.titulo}
                                        </p>
                                        <p className="truncate text-sm text-gray-500">
                                            {projetosPorId.get(tarefa.projetoId)?.nome}
                                        </p>
                                    </div>

                                    {prioridade && (
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${prioridade.cor}`}>
                                            {prioridade.rotulo}
                                        </span>
                                    )}

                                    <span className={`text-sm ${alerta ? "text-red-500" : "text-gray-500"}`}>
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