export const projetosMock = [
  { id: 1, workspaceId: 1, nome: "Site Institucional" },
  { id: 2, workspaceId: 1, nome: "App Mobile" },
  { id: 3, workspaceId: 2, nome: "UX/UI" },
];

export const tarefasMock = [
  { id: 1, projetoId: 3, titulo: "Criar wireframes", status: "A fazer", prioridade: "alta", responsavel: "João", dataVencimento: "2026-10-10" },
  { id: 2, projetoId: 1, titulo: "Configurar deploy", status: "Em andamento", prioridade: "média", responsavel: "Maria", dataVencimento: "2026-10-12" },
  { id: 3, projetoId: 1, titulo: "Revisar textos", status: "Concluída", prioridade: "baixa", responsavel: "João", dataVencimento: "2026-10-08" },
];