import PaginaMembros from "@/components/members/PaginaMembros";

export default async function MembrosPage({ params }) {
    const { workspaceId } = await params;

    return <PaginaMembros key={workspaceId} workspaceId={workspaceId} />;
}