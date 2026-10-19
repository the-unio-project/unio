"use client";

import { useState } from "react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useRouter } from "next/navigation";
import ModalProjeto from "@/components/projects/ModalProjeto";
import Button from "@/components/ui/Button";

export default function SemProjeto() {
    const { criarProjeto, workspaceAtual } = useWorkspace();
    const [modalAberto, setModalAberto] = useState(false);
    const router = useRouter();

    function salvarNovoProjeto(dados) {
        const novo = criarProjeto(workspaceAtual.id, dados);
        setModalAberto(false);
        router.push(`/${workspaceAtual.id}/projetos/${novo.id}`);
    }

    return (
        <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Esse workspace ainda não possui projetos.
            </p>
            <Button 
                variant="primary"
                onClick={() => setModalAberto(true)}
                >
                    Criar um Projeto
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
