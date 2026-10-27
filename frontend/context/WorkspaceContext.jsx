"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { listarWorkspaces, listarProjetos, criarWorkspaceApi, criarProjetoApi } from "@/lib/api";

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

    const [projetos, setProjetos] = useState([]);
    const [projetosDeWorkspace, setProjetosDeWorkspace] = useState(null);
    const [workspaceComErro, setWorkspaceComErro] = useState(null);
    const [workspaceLembrado, setWorkspaceLembrado] = useState(null);
    const workspaceUrl = workspaces.find((w) => String(w.id) === params.workspaceId);
    const workspaceAtual = workspaceUrl ?? workspaceLembrado ?? workspaces[0];
    const workspaceAtualId = workspaceAtual?.id;
    const erroProjetos = workspaceComErro === workspaceAtualId ? "Não foi possível carregar os projetos." : null;
    const carregandoProjetos = Boolean(workspaceAtualId) && projetosDeWorkspace !== workspaceAtualId && !erroProjetos;
    const projetosAtivos = projetos.filter((p) => !p.arquivado);

    useEffect(() => {
        if (!workspaceAtualId) return;
        let ignorarResposta = false;

        listarProjetos(workspaceAtualId)
            .then((lista) => {
                if (ignorarResposta) return;
                setProjetos(lista);
                setProjetosDeWorkspace(workspaceAtualId);
                setWorkspaceComErro(null);
            })
            .catch(() => {
                if (!ignorarResposta) setWorkspaceComErro(workspaceAtualId);
            });

        return () => {
            ignorarResposta = true;
        };
    }, [workspaceAtualId]);

    async function criarProjeto(workspaceId, dados) {
        const novo = await criarProjetoApi(workspaceId, dados);
        setProjetos((anteriores) => [...anteriores, novo]);
        return novo;
    }

    function editarProjeto(id, mudancas) {
        setProjetos((anteriores) => anteriores.map((p) => (p.id === id ? { ...p, ...mudancas } : p)));
    }

    async function criarWorkspace(nome) {
        const novo = await criarWorkspaceApi(nome);
        setWorkspaces((anteriores) => [...anteriores, novo]);
        return novo;
    }

    function arquivarProjeto(id) {
        editarProjeto(id, { arquivado: true });
    }

    function excluirProjeto(id) {
        setProjetos((anteriores) => anteriores.filter((p) => p.id !== id));
    }

    return (
        <WorkspaceContext.Provider
            value={{
                workspaceAtual, setWorkspaceLembrado, workspaces, setWorkspaces, projetos, criarProjeto,
                editarProjeto, criarWorkspace, projetosAtivos, arquivarProjeto, excluirProjeto,
                carregandoWorkspaces, erroWorkspaces, carregandoProjetos, erroProjetos
            }}
        >
            {children}
        </WorkspaceContext.Provider>
    );
}

export function useWorkspace() {
    return useContext(WorkspaceContext);
}