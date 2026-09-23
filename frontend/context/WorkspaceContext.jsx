"use client";

import { createContext, useContext, useState } from 'react';

const WorkspaceContext = createContext();


export function WorkspaceProvider({ children }) {
    const [workspaceAtual, setWorkspaceAtual] = useState(null);
    const [workspaces, setWorkspaces] = useState([
    { id: 1, nome: 'Equipe de Desenvolvimento' },
    { id: 2, nome: 'Equipe de Design' },
    { id: 3, nome: 'Equipe de Marketing' }
]);

    return (
        <WorkspaceContext.Provider value={{ workspaceAtual, setWorkspaceAtual, workspaces, setWorkspaces }}>
            {children}
        </WorkspaceContext.Provider>
    )
}

export function useWorkspace() {
    return useContext(WorkspaceContext);
}