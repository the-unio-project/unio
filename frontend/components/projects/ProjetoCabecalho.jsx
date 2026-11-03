"use client";

import { useParams } from "next/navigation";
import { useWorkspace } from "@/context/WorkspaceContext";

export default function ProjetoCabecalho() {
    const params = useParams();
    const { projetos } = useWorkspace();

    const projeto = projetos.find((p) => String(p.id) === params.projectId);

    if (!projeto) return null;

    return (
        <div className="px-4 pt-4">
            <h1 className="font-titulo text-3xl">{projeto.nome}</h1>
            {projeto.descricao && (
                <p className="mt-1 text-neutral-600 dark:text-neutral-400">{projeto.descricao}</p>
            )}
        </div>
    );
}