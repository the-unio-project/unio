"use client";

import { useWorkspace } from "@/context/WorkspaceContext";
import SemWorkspace from "@/components/workspaces/SemWorkspace";
import SemProjeto from "@/components/projects/SemProjeto";

export default function Dashboard() {
  const { workspaces, workspaceAtual, projetos } = useWorkspace();
  const projetosDoWorkspace = workspaceAtual ? projetos.filter((projeto) => projeto.workspaceId === workspaceAtual.id) : [];

  if (workspaces.length === 0) {
    return <SemWorkspace />;
  }
  if (projetosDoWorkspace.length === 0) {
    return <SemProjeto />;
  }
  return <h1>Dashboard</h1>;
}