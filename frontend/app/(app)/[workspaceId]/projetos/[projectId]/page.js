import ProjetoCabecalho from "@/components/projects/ProjetoCabecalho";
import VisaoProjeto from "@/components/tasks/VisaoProjeto";

export default async function ProjetoPage({ params }) {
    const { projectId } = await params;

    return (
        <>
            <ProjetoCabecalho />
            <VisaoProjeto key={projectId} projetoId={projectId} />
        </>
    );
}