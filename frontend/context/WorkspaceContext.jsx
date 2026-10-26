"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { projetosMock, statusMock } from "@/lib/mock";
import { STATUS_PADRAO } from "@/lib/status";
import { listarWorkspaces } from "@/lib/api";

const WorkspaceContext = createContext();

export function WorkspaceProvider({ children }) {
    const params = useParams();
    const [workspaces, setWorkspaces] = useState([]);
    const [carregandoWorkspaces, setCarregandoWorkspaces] = useState(true);
    const [erroWorkspaces, setErroWorkspaces] = useState(null);
    useEffect(() => {
        listarWorkspaces()
            .then(setWorkspaces)
            .catch(() => setErroWorkspaces("Não foi possível carregar os workspaces."))
            .finally(() => setCarregandoWorkspaces(false));
    }, []);

    const [projetos, setProjetos] = useState(projetosMock);
    const [workspaceLembrado, setWorkspaceLembrado] = useState(null);
    const [statusProjetos, setStatusProjetos] = useState(statusMock);
    const workspaceUrl = workspaces.find((w) => String(w.id) === params.workspaceId);
    const workspaceAtual = workspaceUrl ?? workspaceLembrado ?? workspaces[0];
    const projetosAtivos = projetos.filter((p) => !p.arquivado);

    function criarProjeto(workspaceId, dados) {
        const novo = { id: Date.now(), workspaceId, ...dados };
        const statusNovo = STATUS_PADRAO.map((s, i) => ({ ...s, projetoId: novo.id, id: novo.id + i + 1 }));
        setProjetos((anteriores) => [...anteriores, novo]);
        setStatusProjetos((anteriores) => [...anteriores, ...statusNovo]);
        return novo;
    }

    function editarProjeto(id, mudancas) {
        setProjetos((anteriores) => anteriores.map((p) => (p.id === id ? { ...p, ...mudancas } : p)));
    }

    function criarWorkspace(nome) {
        const novo = { id: Date.now(), nome };
        setWorkspaces((anteriores) => [...anteriores, novo]);
        return novo;
    }

    function arquivarProjeto(id) {
        editarProjeto(id, { arquivado: true });
    }

    function excluirProjeto(id) {
        setProjetos((anteriores) => anteriores.filter((p) => p.id !== id));
        setStatusProjetos((anteriores) => anteriores.filter((s) => s.projetoId !== id));
    }

    return (
        <WorkspaceContext.Provider
            value={{
                workspaceAtual, setWorkspaceLembrado, workspaces, setWorkspaces, projetos, criarProjeto,
                editarProjeto, criarWorkspace, statusProjetos, projetosAtivos, arquivarProjeto, excluirProjeto,
                carregandoWorkspaces, erroWorkspaces
            }}
        >
            {children}
        </WorkspaceContext.Provider>
    );
}

export function useWorkspace() {
    return useContext(WorkspaceContext);
}