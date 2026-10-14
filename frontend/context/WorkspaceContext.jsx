"use client";

import { createContext, useContext, useState } from "react";
import { useParams } from "next/navigation";
import { projetosMock } from "@/lib/mock";

const WorkspaceContext = createContext();

export function WorkspaceProvider({ children }) {
    const params = useParams();
    const [workspaces, setWorkspaces] = useState([
        { id: 1, nome: "Equipe de Desenvolvimento" },
        { id: 2, nome: "Equipe de Design" },
        { id: 3, nome: "Equipe de Marketing" },
    ]);
    const [projetos, setProjetos] = useState(projetosMock);
    const [workspaceLembrado, setWorkspaceLembrado] = useState(null);

    const workspaceUrl = workspaces.find((w) => String(w.id) === params.workspaceId);
    const workspaceAtual = workspaceUrl ?? workspaceLembrado ?? workspaces[0];
    
    function criarProjeto(workspaceId, dados) {
        const novo = { id: Date.now(), workspaceId, ...dados };
        setProjetos((anteriores) => [...anteriores, novo]);
        return novo;
    }

    function editarProjeto(id, mudancas) {
        setProjetos((anteriores) =>
            anteriores.map((p) => (p.id === id ? { ...p, ...mudancas } : p))
        );
    }

    function criarWorkspace(nome) {
        const novo = { id: Date.now(), nome };
        setWorkspaces((anteriores) => [...anteriores, novo]);
        return novo;
    }

    return (
        <WorkspaceContext.Provider value={{ workspaceAtual, setWorkspaceLembrado, workspaces, setWorkspaces, projetos, criarProjeto, editarProjeto, criarWorkspace }}>
            {children}
        </WorkspaceContext.Provider>
    );
}

export function useWorkspace() {
    return useContext(WorkspaceContext);
}