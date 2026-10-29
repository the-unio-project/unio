"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function ModalWorkspace({ aoSalvar, aoFechar }) {
    const [nome, setNome] = useState("");
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");

    async function salvar() {
        if (nome.trim() === "" || salvando) return;
        setSalvando(true);
        setErro("");
        try {
            await aoSalvar(nome.trim());
        } catch {
            setErro("Não foi possível criar o workspace.");
            setSalvando(false);
        }
    }

    return (
        <Modal aoFechar={aoFechar} largura="max-w-lg">
            <h2 className="mb-4 pr-10 text-xl font-bold">
                Criar Workspace
            </h2>

            <Input
                placeholder="Digite o nome do workspace"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") salvar();
                }}
                className="mb-4 w-full border p-2 rounded"
            />

            {erro && <p className="mb-4 text-sm text-red-500">{erro}</p>}

            <div className="flex justify-end gap-2">
                <Button onClick={aoFechar} variant="secondary">
                    Cancelar
                </Button>
                <Button
                    onClick={salvar}
                    disabled={nome.trim() === "" || salvando}
                    className="disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Salvar
                </Button>
            </div>
        </Modal>
    )
}