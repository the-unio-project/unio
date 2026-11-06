"use client";

import { useState } from "react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";
import ModalWorkspace from "@/components/workspaces/ModalWorkspace";
import Button from "@/components/ui/Button";

export default function SemWorkspace() {
    const { criarWorkspace } = useWorkspace();
    const [modalAberto, setModalAberto] = useState(false);
    const router = useRouter();

    async function salvarNovoWorkspace(nome) {
        await criarWorkspace(nome);
        setModalAberto(false);
        router.push("/dashboard");
    }

    return (
        <div className="flex flex-col items-center gap-4 rounded-xl bg-white p-10 text-center text-carvao shadow-sm dark:bg-neutral-900 dark:text-gray-100">
            <div className="rounded-full bg-primary/10 p-4 text-primary">
                <Building2 size={32} />
            </div>
            <h2 className="text-xl font-semibold">Você ainda não tem um workspace</h2>
            <p className="max-w-sm text-sm text-neutral-600 dark:text-neutral-400">
                organize seus projetos agora mesmo.
            </p>
            <Button variant="primary" onClick={() => setModalAberto(true)}>
                Criar workspace
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
