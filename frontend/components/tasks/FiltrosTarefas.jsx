import { PRIORIDADES } from "@/lib/prioridades";

const ESTILO_SELECT =
    "rounded-full border border-carvao bg-transparent px-3 py-1 text-sm text-carvao focus:outline-none focus:ring-2 focus:ring-primary dark:border-neutral-500 dark:bg-neutral-900 dark:text-neutral-200";

export default function FiltrosTarefas({
    membros,
    filtroPrioridade,
    aoMudarPrioridade,
    filtroResponsavel,
    aoMudarResponsavel,
}) {
    return (
        <div className="flex gap-2">
            <select
                value={filtroPrioridade}
                onChange={(e) => aoMudarPrioridade(e.target.value)}
                className={ESTILO_SELECT}
            >
                <option value="todas">Prioridade</option>
                {Object.entries(PRIORIDADES).map(([valor, { rotulo }]) => (
                    <option key={valor} value={valor}>{rotulo}</option>
                ))}
            </select>

            <select
                value={filtroResponsavel}
                onChange={(e) => aoMudarResponsavel(e.target.value)}
                className={ESTILO_SELECT}
            >
                <option value="todos">Responsável</option>
                {membros.map((m) => (
                    <option key={m.id} value={m.id}>{m.nome}</option>
                ))}
            </select>
        </div>
    );
}