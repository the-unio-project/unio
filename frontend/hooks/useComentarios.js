import { useState, useEffect } from "react";
import { toast } from "sonner";
import { listarComentarios, criarComentarioApi, excluirComentarioApi } from "@/lib/api";

export function useComentarios(tarefaId) {
    const [comentarios, setComentarios] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        listarComentarios(tarefaId)
            .then(setComentarios)
            .catch(() => setErro("Não foi possível carregar os comentários."))
            .finally(() => setCarregando(false));
    }, [tarefaId]);

    async function enviarComentario(texto) {
        await criarComentarioApi(tarefaId, texto);

        try {
            setComentarios(await listarComentarios(tarefaId));
        } catch {
            toast.error("Comentário enviado, mas a lista não atualizou. Reabra a tarefa.");
        }
    }

    async function excluirComentario(id) {
        try {
            await excluirComentarioApi(id);
            setComentarios((anteriores) => anteriores.filter((c) => c.id !== id));
        } catch {
            toast.error("Não foi possível apagar o comentário.");
        }
    }

    return { comentarios, carregando, erro, enviarComentario, excluirComentario };
}