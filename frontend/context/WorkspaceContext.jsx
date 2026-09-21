"use client";

import { createContext, useContext, useState } from 'react';

const WorkspaceContext = createContext();


export function WorkspaceProvider({ children }) {
    const [workspaceAtual, setWorkspaceAtual] = useState(null);
    
    return (
        <WorkspaceContext.Provider value={{ workspaceAtual, setWorkspaceAtual }}>
            {children}
        </WorkspaceContext.Provider>
    )
}

export function useWorkspace() {
    return useContext(WorkspaceContext);
}