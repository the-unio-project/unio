import { PRIORIDADES } from "@/lib/prioridades";

export default function FiltrosTarefas({
    membros,
    filtroPrioridade,
    aoMudarPrioridade,
    filtroResponsavel,
    aoMudarResponsavel,
}) {
    return (
        <div className="flex gap-4 mb-4">
            <select
                value={filtroPrioridade}
                onChange={(e) => aoMudarPrioridade(e.target.value)}
                className="border p-2 rounded text-sm"
            >
                <option value="todas">Prioridade</option>
                {Object.entries(PRIORIDADES).map(([valor, { rotulo }]) => (
                    <option key={valor} value={valor}>{rotulo}</option>
                ))}
            </select>

            <select
                value={filtroResponsavel}
                onChange={(e) => aoMudarResponsavel(e.target.value)}
                className="border p-2 rounded text-sm"
            >
                <option value="todos">Responsável</option>
                {membros.map((m) => (
                    <option key={m.id} value={m.id}>{m.nome}</option>
                ))}
            </select>
        </div>
    );
}