"use client";

import { useState } from "react";
import Input from '@/components/ui/Input';
import { X } from "lucide-react";

export default function ModalTarefa({ tarefa, aoFechar, aoAtualizar }) {
    const [titulo, setTitulo] = useState(tarefa.titulo);
    const [descricao, setDescricao] = useState(tarefa.descricao ?? "");

    function salvarTitulo() {
        if(titulo.trim() === "") {
            setTitulo(tarefa.titulo);
            return;
        }
        aoAtualizar(tarefa.id, { titulo: titulo.trim() });
    }

    function fechar() {
        const tituloFinal = titulo.trim() === "" ? tarefa.titulo : titulo.trim();
        aoAtualizar(tarefa.id, { titulo: tituloFinal, descricao });
        aoFechar();
}

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" 
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) fechar();
            }}
        >
            <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 dark:bg-gray-900">
                <button
                    type="button"
                    onClick={fechar}
                    aria-label="Fechar"
                    className="absolute top-4 right-4 p-1 rounded text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    <X size={20} />
                </button>

                <div className="pr-10 mb-4">
                    <Input
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        onBlur={salvarTitulo}
                        className="w-full mb-4 text-2xl font-bold"
                    />
                </div>
                <label htmlFor="status" className="block text-gray-700 dark:text-gray-300 mb-2">Status</label>
                <select
                    id="status"
                    value={tarefa.status}
                    onChange={(e) => aoAtualizar(tarefa.id, { status: e.target.value })}
                    className="border p-2 rounded mb-4"
                >
                    <option value="A fazer">A fazer</option>
                    <option value="Em andamento">Em andamento</option>
                    <option value="Concluída">Concluída</option>
                </select>

                <label htmlFor="prioridade" className="block text-gray-700 dark:text-gray-300 mb-2">Prioridade</label>
                <select
                    id="prioridade"
                    value={tarefa.prioridade}
                    onChange={(e) => aoAtualizar(tarefa.id, { prioridade: e.target.value })}
                    className="border p-2 rounded mb-4"
                >
                    <option value="alta">Alta</option>
                    <option value="média">Média</option>
                    <option value="baixa">Baixa</option>
                </select>
                
                <Input 
                    label="Data de vencimento"
                    type="date"
                    value={tarefa.dataVencimento}
                    onChange={(e) => aoAtualizar(tarefa.id, { dataVencimento: e.target.value })}
                    className="border p-2 rounded mb-4 block"
                />
                <label htmlFor="descricao" className="block text-gray-700 dark:text-gray-300 mb-2">Descrição</label>
                <textarea
                    id="descricao"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    onBlur={() => aoAtualizar(tarefa.id, { descricao })}
                    className="border p-2 rounded mb-4 block w-full"
                />
            </div>
        </div>
    )
}