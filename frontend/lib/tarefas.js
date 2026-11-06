export const SEM_STATUS = { id: null, nome: "Sem status", cor: "#6b7280" };

export function agruparPorStatus(tarefas) {
    const grupos = tarefas.reduce((acc, tarefa) => {
        acc[tarefa.statusId] = acc[tarefa.statusId] || [];
        acc[tarefa.statusId].push(tarefa);
        return acc;
    }, {});

    Object.values(grupos).forEach((lista) => {
        lista.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
    });

    return grupos;
}