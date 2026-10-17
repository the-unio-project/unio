"use client";

import { useState } from "react";
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { PRIORIDADES } from "@/lib/prioridades";

const coresStatus = {
    "A fazer": "bg-gray-200 text-gray-700",
    "Em andamento": "bg-yellow-100 text-yellow-700",
    "Concluída": "bg-green-100 text-green-700",
};

const COLUNAS = "grid grid-cols-[minmax(0,1fr)_8rem_7rem_7rem] items-center gap-4";

export default function SecaoStatus({ status, tarefas, aoAdicionar, aoSelecionar }) {
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
                        <span className="text-sm text-gray-600 truncate">
                            {tarefa.responsavel || "-"}
                        </span>
                        <span className={`justify-self-start text-xs px-2 py-1 rounded ${PRIORIDADES[tarefa.prioridade]?.cor}`}>
                            {PRIORIDADES[tarefa.prioridade]?.rotulo}
                        </span>
                        <span className="text-sm text-gray-600">
                            {tarefa.dataVencimento}
                        </span>
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