"use client";

import { createContext, useContext, useState } from "react";
import { useParams } from "next/navigation";
import { projetosMock, statusMock } from "@/lib/mock";
import { STATUS_PADRAO } from "@/lib/status";

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
    const [statusProjetos, setStatusProjetos] = useState(statusMock);
    const workspaceUrl = workspaces.find((w) => String(w.id) === params.workspaceId);
    const workspaceAtual = workspaceUrl ?? workspaceLembrado ?? workspaces[0];
    
    function criarProjeto(workspaceId, dados) {
        const novo = { id: Date.now(), workspaceId, ...dados };
        const statusNovo = STATUS_PADRAO.map((s, i) => ({ ...s, projetoId: novo.id, id: novo.id + i + 1 }));
        setProjetos((anteriores) => [...anteriores, novo]);
        setStatusProjetos((anteriores) => [...anteriores, ...statusNovo]);
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
        <WorkspaceContext.Provider value={{ workspaceAtual, setWorkspaceLembrado, workspaces, setWorkspaces, projetos, criarProjeto, editarProjeto, criarWorkspace, statusProjetos }}>
            {children}
        </WorkspaceContext.Provider>
    );
}

export function useWorkspace() {
    return useContext(WorkspaceContext);
}