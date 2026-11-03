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
            <h2 className="mb-4 pr-10 font-titulo text-2xl">Criar Workspace</h2>

            <div className="mb-4">
                <Input
                    variant="filled"
                    label="Nome"
                    placeholder="Digite o nome do workspace"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") salvar();
                    }}
                />
            </div>

            {erro && <p className="mb-4 text-sm text-erro">{erro}</p>}

            <div className="flex justify-end gap-2">
                <Button onClick={aoFechar} variant="contorno">
                    Cancelar
                </Button>
                <Button onClick={salvar} disabled={nome.trim() === "" || salvando}>
                    Salvar
                </Button>
            </div>
        </Modal>
    )
}