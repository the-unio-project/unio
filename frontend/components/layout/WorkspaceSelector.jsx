"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Check, Plus } from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import ModalWorkspace from "@/components/workspaces/ModalWorkspace";
import Button from "@/components/ui/Button";

export default function WorkspaceSelector() {
    const { workspaceAtual, setWorkspaceLembrado, workspaces, projetos, criarWorkspace } = useWorkspace();
    const [aberto, setAberto] = useState(false);
    const [modalAberto, setModalAberto] = useState(false);
    const router = useRouter();

    if (!workspaceAtual) return null;

    function trocarWorkspace(workspace) {
        setWorkspaceLembrado(workspace);
        const primeiroProjeto = projetos.find((p) => p.workspaceId === workspace.id);
        router.push(
            primeiroProjeto
                ? `/${workspace.id}/projetos/${primeiroProjeto.id}`
                : "/dashboard"
        );
        setAberto(false);
    }

    function salvarNovoWorkspace(nome) {
        const novo = criarWorkspace(nome);
        setModalAberto(false);
        trocarWorkspace(novo);
    }

    return (
        <div className="relative inline-block">
            <button
                type="button"
                onClick={() => setAberto(!aberto)}
                aria-expanded={aberto}
                className="flex max-w-xs items-center gap-2 rounded p-2 text-lg font-bold hover:bg-gray-100 dark:hover:bg-gray-800"
            >
                <span className="truncate">{workspaceAtual.nome}</span>
                <ChevronDown size={16} className="shrink-0" />
            </button>

            {aberto && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setAberto(false)} />
                    <ul className="absolute left-0 z-20 mt-1 flex w-max min-w-full max-w-xs flex-col rounded-lg border bg-white p-1 shadow-md dark:bg-gray-900">
                        {workspaces.map((workspace) => (
                            <li key={workspace.id}>
                                <button
                                    type="button"
                                    onClick={() => trocarWorkspace(workspace)}
                                    className="flex w-full items-center justify-between gap-2 rounded p-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    <span className="truncate">{workspace.nome}</span>
                                    {workspace.id === workspaceAtual.id && <Check size={16} />}
                                </button>
                            </li>
                        ))}
                        <li className="mt-1 pt-1">
                            <Button
                                variant="contorno"
                                onClick={() => {
                                    setModalAberto(true);
                                    setAberto(false);
                                }}
                                className="flex w-full items-center justify-center gap-2 text-sm"
                            >
                                <Plus size={16} />
                                Criar Workspace
                            </Button>
                        </li>
                    </ul>
                </>
            )}
            {modalAberto && (
                <ModalWorkspace
                    aoSalvar={salvarNovoWorkspace}
                    aoFechar={() => setModalAberto(false)}
                />
            )}
        </div>
    );
}