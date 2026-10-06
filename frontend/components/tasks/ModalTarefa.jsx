"use client";

export default function ModalTarefa({ tarefa, aoFechar }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-2xl rounded-lg bg-white p-6 dark:bg-gray-900">
                <h2 className="text-xl font-bold mb-4">{tarefa.titulo}</h2>
                <p className="mb-2"><strong>Status:</strong> {tarefa.status}</p>
                <p className="mb-2"><strong>Prioridade:</strong> {tarefa.prioridade}</p>
                <button onClick={aoFechar} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Fechar
                </button>
            </div>
        </div>
    )
}