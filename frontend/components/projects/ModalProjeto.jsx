"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function ModalProjeto({ projeto, aoSalvar, aoFechar }) {
    const projetoExistente = Boolean(projeto);
    const [nome, setNome] = useState(projeto?.nome ?? "");
    const [descricao, setDescricao] = useState(projeto?.descricao ?? "");

    function salvar() {
        if (nome.trim() === "") return;
        aoSalvar({ nome: nome.trim(), descricao: descricao.trim() });
    }

    return (
        <Modal aoFechar={aoFechar} largura="max-w-lg">
            <h2 className="mb-4 pr-10 text-xl font-bold">
                {projetoExistente ? "Editar Projeto" : "Criar Projeto"}
            </h2>

            <Input
                label="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                onKeyDown ={(e) => {
                    if (e.key === "Enter") salvar();
                }}
                placeholder="Digite o nome do projeto"
                className="mb-4 w-full border p-2 rounded"
            />

            <label htmlFor="descricao-projeto" className="mb-2 block text-gray-700 dark:text-gray-300">
                Descrição
            </label>
            <textarea
                id="descricao-projeto"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Digite a descrição do projeto"
                className="mb-4 block w-full border p-2 rounded"
            />

            <div className="flex justify-end gap-2">
                <Button onClick={aoFechar} variant="secondary">
                    Cancelar
                </Button>
                <Button 
                    onClick={salvar}
                    disabled={nome.trim() === ""}
                    className="disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {projetoExistente ? "Atualizar" : "Salvar"}
                </Button>
            </div>
        </Modal>
    )

}