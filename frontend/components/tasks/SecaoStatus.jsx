"use client";

import { useState } from "react";
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const coresStatus = {
    "A fazer": "bg-gray-200 text-gray-700",
    "Em andamento": "bg-yellow-100 text-yellow-700",
    "Concluída": "bg-green-100 text-green-700",
};

const coresPrioridade = {
    alta: "bg-red-100 text-red-700",
    média: "bg-yellow-100 text-yellow-700",
    baixa: "bg-blue-100 text-blue-700",
};

export default function SecaoStatus({ status, tarefas, aoAdicionar }) {
    const [novoTitulo, setNovoTitulo] = useState("");

function confirmarNovaTarefa() {
    if (novoTitulo.trim() === "") return;
    aoAdicionar(status, novoTitulo);
    setNovoTitulo("");
}

    return (
        <section className="mb-6">
            <h2 className={`inline-block font-bold text-lg mb-2 p-1 rounded ${coresStatus[status]}`}>
                {status}
            </h2>
            <ul className="flex flex-col gap-2">
                {tarefas.map((tarefa) => (
                    <li key={tarefa.id} className="flex items-center gap-4 border p-2 rounded">
                        <span className="flex-1">{tarefa.titulo}</span>
                        <span className="text-sm text-gray-600">{tarefa.responsavel}</span>
                        <span className={`text-xs px-2 py-1 rounded ${coresPrioridade[tarefa.prioridade]}`}>
                            {tarefa.prioridade}
                        </span>
                        <span className="text-sm text-gray-600">{tarefa.dataVencimento}</span>

                    </li>
                ))}
            </ul>
            <div className="mt-2 flex gap-2">
                <Input
                    value={novoTitulo}
                    onChange={(e) => setNovoTitulo(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") confirmarNovaTarefa(); 
                    }}
                    placeholder="+ Adicionar tarefa"
                    className="border p-2 rounded flex-1 text-sm"
                />
                <Button onClick={confirmarNovaTarefa} variant="task" className="text-sm px-3 py-1 border rounded">
                    Adicionar
                </Button>
            </div>
        </section>
    )
}