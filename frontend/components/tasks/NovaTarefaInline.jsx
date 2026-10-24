"use client";

import { useState } from "react";
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function NovaTarefaInline({ aoAdicionar }) {
    const [titulo, setTitulo] = useState("");

    function confirmar() {
        const novoTitulo = titulo.trim();
        if (novoTitulo === "") return;
        aoAdicionar(novoTitulo);
        setTitulo("");
    }

    return (
        <div className="mt-2 flex gap-2">
            <Input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") confirmar();
                }}
                placeholder="+ Adicionar tarefa"
                className="border p-2 rounded flex-1 min-w-0 text-sm"
            />
            <Button onClick={confirmar} variant="task" className="text-sm px-3 py-1 border rounded">
                Adicionar
            </Button>
        </div>
    )

}