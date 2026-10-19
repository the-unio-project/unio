export const projetosMock = [
  { id: 1, workspaceId: 1, nome: "Site Institucional" },
  { id: 2, workspaceId: 1, nome: "App Mobile" },
  { id: 3, workspaceId: 2, nome: "UX/UI" },
];

export const membrosMock = [
  { id: 1, workspaceId: 1, nome: "João" },
  { id: 2, workspaceId: 1, nome: "Maria" },
  { id: 1, workspaceId: 2, nome: "João" },
  { id: 3, workspaceId: 2, nome: "Ana" },
];

export const tagsMock = [
  { id: 1, projetoId: 1, nome: "Frontend", cor: "bg-green-100 text-green-700" },
  { id: 2, projetoId: 1, nome: "Infra", cor: "bg-blue-100 text-blue-700" },
  { id: 3, projetoId: 1, nome: "Conteúdo", cor: "bg-yellow-100 text-yellow-700" },
  { id: 4, projetoId: 3, nome: "Design", cor: "bg-purple-100 text-purple-700" },
  { id: 5, projetoId: 3, nome: "Pesquisa", cor: "bg-red-100 text-red-700" },
];

export const tarefasMock = [
  { id: 1, projetoId: 3, titulo: "Criar wireframes", status: "A fazer", prioridade: "alta", responsaveis: [1], dataVencimento: "2026-10-10", tags: [4] },
  {
    id: 2,
    projetoId: 1,
    titulo: "Configurar deploy",
    status: "Em andamento",
    prioridade: "normal",
    responsaveis: [2],
    dataVencimento: "2026-10-12",
    subtarefas: [
      { id: 101, titulo: "Criar conta na Vercel" },
      { id: 102, titulo: "Configurar variáveis de ambiente" },
    ],
    tags: [1, 2],
  },
  { id: 3, projetoId: 1, titulo: "Revisar textos", status: "Concluída", prioridade: "baixa", responsaveis: [1], dataVencimento: "2026-10-08", tags: [3] },
];