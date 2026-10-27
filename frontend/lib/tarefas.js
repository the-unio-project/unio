export const SEM_STATUS = { id: null, nome: "Sem status", cor: "#6b7280" };

export function agruparPorStatus(tarefas) {
    return tarefas.reduce((acc, tarefa) => {
        acc[tarefa.statusId] = acc[tarefa.statusId] || [];
        acc[tarefa.statusId].push(tarefa);
        return acc;
    }, {});
}