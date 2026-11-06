import AceitarConvite from "@/components/members/AceitarConvite";

export default async function ConvitePage({ params }) {
    const { token } = await params;

    return <AceitarConvite token={token} />;
}