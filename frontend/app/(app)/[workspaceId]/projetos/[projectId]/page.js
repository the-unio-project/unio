import ProjetoCabecalho from "@/components/projects/ProjetoCabecalho";
import TaskList from "@/components/tasks/TaskList";

export default async function ProjetoPage({ params }) {
    const { projectId } = await params;

    return (
        <>
            <ProjetoCabecalho />
            <TaskList projetoId={Number(projectId)} />
        </>
    );
}