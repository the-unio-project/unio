"use client";

import { useWorkspace } from "@/context/WorkspaceContext";
import SemWorkspace from "@/components/workspaces/SemWorkspace";
import SemProjeto from "@/components/projects/SemProjeto";
import PainelDashboard from "@/components/dashboard/PainelDashboard";

export default function Dashboard() {
  const { workspaces, workspaceAtual, projetosAtivos, carregandoWorkspaces, erroWorkspaces, carregandoProjetos, erroProjetos } = useWorkspace();
  const projetosDoWorkspace = workspaceAtual ? projetosAtivos.filter((projeto) => projeto.workspaceId === workspaceAtual.id) : [];

  if (carregandoWorkspaces) {
    return <p className="p-4 text-gray-500">Carregando...</p>;
  }
  if (erroWorkspaces) {
    return <p className="p-4 text-red-500">{erroWorkspaces}</p>;
  }

  if (workspaces.length === 0) {
    return <SemWorkspace />;
  }
  if (carregandoProjetos) {
    return <p className="p-4 text-gray-500">Carregando...</p>;
  }
  if (erroProjetos) {
    return <p className="p-4 text-red-500">{erroProjetos}</p>;
  }
  if (projetosDoWorkspace.length === 0) {
    return <SemProjeto />;
  }
  return <PainelDashboard />;
}