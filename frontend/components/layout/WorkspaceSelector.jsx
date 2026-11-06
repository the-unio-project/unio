"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Check, Plus, Trash2 } from "lucide-react";
import { FUNCOES } from "@/lib/funcoes";
import { useWorkspace } from "@/context/WorkspaceContext";
import ModalConfirmacao from "@/components/ui/ModalConfirmacao";
import ModalWorkspace from "@/components/workspaces/ModalWorkspace";
import Button from "@/components/ui/Button";

export default function WorkspaceSelector() {
    const { workspaceAtual, setWorkspaceLembrado, workspaces, projetosAtivos, criarWorkspace, excluirWorkspace } = useWorkspace();
    const [aberto, setAberto] = useState(false);
    const [modalAberto, setModalAberto] = useState(false);
    const [confirmando, setConfirmando] = useState(false);
    const [excluindo, setExcluindo] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!aberto) return;

        function aoPressionar(e) {
            if (e.key === "Escape") setAberto(false);
        }

        document.addEventListener("keydown", aoPressionar);
        return () => document.removeEventListener("keydown", aoPressionar);
    }, [aberto]);

    if (!workspaceAtual) return null;

    const ehProprietario = workspaceAtual.funcao === FUNCOES.PROPRIETARIO;

    function trocarWorkspace(workspace) {
        setWorkspaceLembrado(workspace);
        const primeiroProjeto = projetosAtivos.find((p) => p.workspaceId === workspace.id);
        router.push(
            primeiroProjeto
                ? `/${workspace.id}/projetos/${primeiroProjeto.id}`
                : "/dashboard"
        );
        setAberto(false);
    }

    async function salvarNovoWorkspace(nome) {
        const novo = await criarWorkspace(nome);
        setModalAberto(false);
        trocarWorkspace(novo);
    }

    async function excluirWorkspaceAtual() {
        if (excluindo) return;
        setExcluindo(true);
        const excluido = await excluirWorkspace(workspaceAtual.id);
        setExcluindo(false);
        setConfirmando(false);
        if (excluido) router.push("/dashboard");
    }

    return (
        <div className="relative inline-block">
            <button
                type="button"
                onClick={() => setAberto(!aberto)}
                aria-expanded={aberto}
                className="flex max-w-xs items-center gap-2 rounded-md p-2 text-lg font-bold text-white hover:bg-white/10 transition-colors hover:cursor-pointer"
            >
                <span className="truncate">{workspaceAtual.nome}</span>
                <ChevronDown size={16} className="shrink-0 text-white/80" />
            </button>

            {aberto && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setAberto(false)} />
                    <ul className="absolute left-0 z-20 mt-2 flex w-max min-w-full max-w-xs flex-col rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
                        {workspaces.map((workspace) => (
                            <li key={workspace.id}>
                                <button
                                    type="button"
                                    onClick={() => trocarWorkspace(workspace)}
                                    className="flex w-full hover:cursor-pointer items-center justify-between gap-2 rounded-md p-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-neutral-800 transition-colors"
                                >
                                    <span className="truncate">{workspace.nome}</span>
                                    {workspace.id === workspaceAtual.id && <Check size={16} className="text-primary" />}
                                </button>
                            </li>
                        ))}
                        <li className="mt-1 pt-1 border-t border-gray-100 dark:border-neutral-800">
                            <Button
                                variant="task"
                                onClick={() => {
                                    setModalAberto(true);
                                    setAberto(false);
                                }}
                                className="flex w-full items-center gap-2 text-sm hover:cursor-pointer"
                            >
                                <Plus size={16} />
                                Criar Workspace
                            </Button>
                        </li>
                        {ehProprietario && (
                            <li>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setConfirmando(true);
                                        setAberto(false);
                                    }}
                                    className="flex w-full items-center gap-2 rounded-md p-2 text-left text-sm text-erro transition-colors hover:cursor-pointer hover:bg-erro/10"
                                >
                                    <Trash2 size={16} />
                                    Excluir workspace
                                </button>
                            </li>
                        )}
                    </ul>
                </>
            )}
            {modalAberto && (
                <ModalWorkspace
                    aoSalvar={salvarNovoWorkspace}
                    aoFechar={() => setModalAberto(false)}
                />
            )}
            {confirmando && (
                <ModalConfirmacao
                    titulo="Excluir workspace"
                    mensagem={`Tem certeza que deseja excluir "${workspaceAtual.nome}"? Os projetos e tarefas dele serão perdidos. Esta ação não pode ser desfeita.`}
                    aoConfirmar={excluirWorkspaceAtual}
                    aoCancelar={() => setConfirmando(false)}
                />
            )}
        </div>
    );
}