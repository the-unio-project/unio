export function agruparPorStatus(tarefas) {
    return tarefas.reduce((acc, tarefa) => {
        acc[tarefa.statusId] = acc[tarefa.statusId] || [];
        acc[tarefa.statusId].push(tarefa);
        return acc;
    }, {});
}