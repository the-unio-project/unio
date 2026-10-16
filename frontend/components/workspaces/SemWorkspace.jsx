"use client";

import { useState } from "react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useRouter } from "next/navigation";
import ModalWorkspace from "@/components/workspaces/ModalWorkspace";
import Button from "@/components/ui/Button";

export default function SemWorkspace() {
    const { criarWorkspace } = useWorkspace();
    const [modalAberto, setModalAberto] = useState(false);
    const router = useRouter();

    function salvarNovoWorkspace(nome) {
        criarWorkspace(nome);
        setModalAberto(false);
        router.push("/dashboard");
    }

    return (
        <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Ainda não há workspaces criados.
            </p>
            <Button 
                variant="primary"
                onClick={() => setModalAberto(true)}
                >
                    Criar um Workspace
            </Button>
            {modalAberto && (
                <ModalWorkspace
                    aoSalvar={salvarNovoWorkspace}
                    aoFechar={() => setModalAberto(false)}
                />
            )}
        </div>
    )
}
