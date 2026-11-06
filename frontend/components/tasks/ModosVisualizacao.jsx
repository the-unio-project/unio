import { LayoutList, Columns3 } from "lucide-react";

const ABAS = [
    { id: "lista", rotulo: "Lista", Icone: LayoutList },
    { id: "kanban", rotulo: "Kanban", Icone: Columns3 },
];

export default function ModosVisualizacao({ visaoAtual, aoMudar }) {
    return (
        <div className="flex gap-2">
            {ABAS.map(({ id, rotulo, Icone }) => {
                const ativa = visaoAtual === id;
                return (
                    <button
                        key={id}
                        type="button"
                        onClick={() => aoMudar(id)}
                        aria-pressed={ativa}
                        className={`flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium hover:cursor-pointer transition ${ativa
                            ? "border-primary bg-primary/20 text-primary dark:bg-primary/50 dark:text-white"
                            : "border-carvao text-carvao hover:bg-primary/20 dark:border-neutral-500 dark:text-neutral-200"
                            }`}
                    >
                        <Icone size={16} />
                        {rotulo}
                    </button>
                );
            })}
        </div>
    );
}