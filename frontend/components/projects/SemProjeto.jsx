"use client";

import { useState } from "react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useRouter } from "next/navigation";
import { FolderKanban } from "lucide-react";
import ModalProjeto from "@/components/projects/ModalProjeto";
import Button from "@/components/ui/Button";

export default function SemProjeto() {
    const { criarProjeto, workspaceAtual } = useWorkspace();
    const [modalAberto, setModalAberto] = useState(false);
    const router = useRouter();

    async function salvarNovoProjeto(dados) {
        const novo = await criarProjeto(workspaceAtual.id, dados);
        setModalAberto(false);
        router.push(`/${workspaceAtual.id}/projetos/${novo.id}`);
    }

    return (
        <div className="flex flex-col items-center gap-4 rounded-xl bg-white p-10 text-center text-carvao shadow-sm dark:bg-neutral-900 dark:text-gray-100">
            <div className="rounded-full bg-primary/10 p-4 text-primary">
                <FolderKanban size={32} />
            </div>
            <h2 className="text-xl font-semibold">Seu workspace está vazio</h2>
            <p className="max-w-sm text-sm text-neutral-600 dark:text-neutral-400">
                Crie o primeiro projeto para começar a organizar as tarefas.
            </p>
            <Button variant="primary" onClick={() => setModalAberto(true)}>
                Criar projeto
            </Button>
            {modalAberto && (
                <ModalProjeto
                    aoSalvar={salvarNovoProjeto}
                    aoFechar={() => setModalAberto(false)}
                />
            )}
        </div>
    )
}
