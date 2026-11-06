import { useState, useEffect } from "react";
import { toast } from "sonner";
import { listarMembros, removerMembroApi, criarConviteApi } from "@/lib/api";

export function useMembros(workspaceId) {
    const [membros, setMembros] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        let ignorarResposta = false;

        listarMembros(workspaceId)
            .then((lista) => {
                if (!ignorarResposta) setMembros(lista);
            })
            .catch(() => {
                if (!ignorarResposta) setErro("Não foi possível carregar os membros.");
            })
            .finally(() => {
                if (!ignorarResposta) setCarregando(false);
            });

        return () => {
            ignorarResposta = true;
        };
    }, [workspaceId]);

    async function removerMembro(usuarioId) {
        try {
            await removerMembroApi(workspaceId, usuarioId);
        } catch {
            toast.error("Não foi possível remover o membro.");
            return false;
        }
        setMembros((anteriores) => anteriores.filter((m) => m.id !== usuarioId));
        toast.success("Membro removido.");
        return true;
    }
    
    async function gerarLinkConvite() {
        try {
            const token = await criarConviteApi(workspaceId);
            return `${window.location.origin}/convite/${token}`;
        } catch {
            toast.error("Não foi possível gerar o link de convite.");
            return null;
        }
    }

    return { membros, carregando, erro, removerMembro, gerarLinkConvite };
}