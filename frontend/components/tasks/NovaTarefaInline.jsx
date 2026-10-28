"use client";

import { useState } from "react";
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function NovaTarefaInline({ aoAdicionar }) {
    const [titulo, setTitulo] = useState("");
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");

    async function confirmar() {
        const novoTitulo = titulo.trim();
        if (novoTitulo === "" || salvando) return;
        setSalvando(true);
        setErro("");
        try {
            await aoAdicionar(novoTitulo);
            setTitulo(""); // só limpa se deu certo
        } catch {
            setErro("Não foi possível adicionar a tarefa.");
        }
        setSalvando(false);
    }

    return (
        <div className="mt-2">
            <div className="flex gap-2">
                <Input
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") confirmar();
                    }}
                    placeholder="+ Adicionar tarefa"
                    className="border p-2 rounded flex-1 min-w-0 text-sm"
                />
                <Button
                    onClick={confirmar}
                    disabled={salvando}
                    variant="task"
                    className="text-sm px-3 py-1 border rounded disabled:opacity-50"
                >
                    Adicionar
                </Button>
            </div>
            {erro && <p className="mt-1 text-sm text-red-500">{erro}</p>}
        </div>
    )
}