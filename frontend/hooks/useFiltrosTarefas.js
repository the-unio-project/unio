import { useState } from "react";

export function useFiltrosTarefas(tarefas) {
    const [filtroPrioridade, setFiltroPrioridade] = useState("todas");
    const [filtroResponsavel, setFiltroResponsavel] = useState("todos");

    const tarefasFiltradas = tarefas.filter((tarefa) => {
        const prioridadeValida =
            filtroPrioridade === "todas" || tarefa.prioridade === filtroPrioridade;
        const responsavelValido =
            filtroResponsavel === "todos" ||
            (tarefa.responsaveis ?? []).map(String).includes(filtroResponsavel);
        return prioridadeValida && responsavelValido;
    });

    return {
        filtroPrioridade,
        setFiltroPrioridade,
        filtroResponsavel,
        setFiltroResponsavel,
        tarefasFiltradas,
    };
}