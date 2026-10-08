"use client";

import { createContext, useContext, useState } from "react";
import { useParams } from "next/navigation";

const WorkspaceContext = createContext();

export function WorkspaceProvider({ children }) {
    const params = useParams();
    const [workspaces, setWorkspaces] = useState([
        { id: 1, nome: "Equipe de Desenvolvimento" },
        { id: 2, nome: "Equipe de Design" },
        { id: 3, nome: "Equipe de Marketing" },
    ]);
    const [workspaceLembrado, setWorkspaceAtual] = useState(null);

    const workspaceUrl = workspaces.find((w) => String(w.id) === params.workspaceId);
    const workspaceAtual = workspaceUrl ?? workspaceLembrado ?? workspaces[0];

    return (
        <WorkspaceContext.Provider value={{ workspaceAtual, setWorkspaceAtual, workspaces, setWorkspaces }}>
            {children}
        </WorkspaceContext.Provider>
    );
}

export function useWorkspace() {
    return useContext(WorkspaceContext);
}