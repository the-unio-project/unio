const ABAS = [
    { id: "lista", rotulo: "Lista" },
    { id: "kanban", rotulo: "Kanban" },
];

export default function ModosVisualizacao({ visaoAtual, aoMudar }) {
    return (
        <div className="flex gap-6 mb-4">
            {ABAS.map((aba) => (
                <button
                    key={aba.id}
                    type="button"
                    onClick={() => aoMudar(aba.id)}
                    className={`pb-2 text-sm font-medium border-b-2 transition ${visaoAtual === aba.id
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-800"
                        }`}
                >
                    {aba.rotulo}
                </button>
            ))}
        </div>
    );
}