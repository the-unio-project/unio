import TaskList from "@/components/tasks/TaskList";

export default async function ProjetoPage({ params }) {
    const { projectId } = await params;

    return <TaskList projetoId={Number(projectId)} />;
}