"use client";

import { useState } from "react";
import { Archive, Trash2 } from "lucide-react";
import ModalConfirmacao from "@/components/ui/ModalConfirmacao";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function ModalProjeto({ projeto, aoSalvar, aoFechar, aoArquivar, aoExcluir }) {
    const projetoExistente = Boolean(projeto);
    const [nome, setNome] = useState(projeto?.nome ?? "");
    const [descricao, setDescricao] = useState(projeto?.descricao ?? "");
    const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");

    const acoes = projetoExistente && (
        <>
            <Button
                variant="icone"
                onClick={() => executar(aoArquivar, "Não foi possível arquivar o projeto.")}
                aria-label="Arquivar projeto"
                title="Arquivar projeto"
            >
                <Archive size={18} />
            </Button>
            <Button
                variant="icone"
                onClick={() => setConfirmandoExclusao(true)}
                aria-label="Excluir projeto"
                title="Excluir projeto"
                className="hover:bg-red-500 hover:text-gray-50 dark:hover:bg-red-500 dark:hover:text-gray-50"
            >
                <Trash2 size={18} />
            </Button>
        </>
    )

    async function executar(acao, mensagemErro) {
        if (salvando) return;
        setSalvando(true);
        setErro("");
        try {
            await acao();
        } catch {
            setErro(mensagemErro);
            setSalvando(false);
            setConfirmandoExclusao(false);
        }
    }

    function salvar() {
        if (nome.trim() === "") return;
        executar(
            () => aoSalvar({ nome: nome.trim(), descricao: descricao.trim() }),
            "Não foi possível salvar o projeto."
        );
    }

    return (
        <>
            <Modal aoFechar={aoFechar} largura="max-w-lg" acoes={acoes}>
                <h2 className="mb-4 pr-24 text-xl font-bold">
                    {projetoExistente ? "Editar Projeto" : "Criar Projeto"}
                </h2>

                <Input
                    label="Nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    onKeyDown={(e) => {
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
                        {projetoExistente ? "Atualizar" : "Salvar"}
                    </Button>
                </div>
            </Modal>

            {confirmandoExclusao && (
                <ModalConfirmacao
                    titulo="Excluir projeto"
                    mensagem={`O projeto “${projeto.nome}” e suas tarefas serão excluidos e não poderão ser recuperados.`}
                    aoConfirmar={() => executar(aoExcluir, "Não foi possível excluir o projeto.")}
                    aoCancelar={() => setConfirmandoExclusao(false)}
                />
            )}
        </>
    )

}