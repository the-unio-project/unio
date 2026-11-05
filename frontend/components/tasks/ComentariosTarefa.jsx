"use client";

import { useState, useEffect, useRef } from "react";
import { Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useComentarios } from "@/hooks/useComentarios";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ComentariosTarefa({ tarefaId, membros }) {
    const { usuarioAtual } = useAuth();
    const { comentarios, carregando, erro, enviarComentario, excluirComentario } =
        useComentarios(tarefaId);

    const [texto, setTexto] = useState("");
    const [enviando, setEnviando] = useState(false);
    const [erroEnvio, setErroEnvio] = useState("");
    const listaRef = useRef(null);

    useEffect(() => {
        if (listaRef.current) {
            listaRef.current.scrollTop = listaRef.current.scrollHeight;
        }
    }, [comentarios]);

    async function aoEnviar(e) {
        e.preventDefault();
        const textoLimpo = texto.trim();
        if (textoLimpo === "" || enviando) return;

        setEnviando(true);
        setErroEnvio("");
        try {
            await enviarComentario(textoLimpo);
            setTexto("");
        } catch {
            setErroEnvio("Não foi possível enviar o comentário.");
        } finally {
            setEnviando(false);
        }
    }

    return (
        <>
            <h3 className="mb-4 shrink-0 pr-8 text-lg font-semibold">Comentários</h3>

            <div ref={listaRef} className="mb-4 flex max-h-80 flex-col gap-4 overflow-y-auto pr-2">
                {carregando ? (
                    <p className="py-4 text-center text-sm text-neutral-500">Carregando...</p>
                ) : erro ? (
                    <p className="py-4 text-center text-sm text-erro">{erro}</p>
                ) : comentarios.length === 0 ? (
                    <p className="py-4 text-center text-sm text-neutral-500">Nenhum comentário ainda.</p>
                ) : (
                    comentarios.map((c) => {
                        const autor = membros.find((m) => m.id === c.autorId);
                        const meuComentario = c.autorId === usuarioAtual?.id;

                        return (
                            <div key={c.id} className="flex gap-3">
                                <div className="shrink-0">
                                    <Avatar nome={autor?.nome ?? "Ex-membro"} src={autor?.foto} tamanho="sm" />
                                </div>
                                <div className="min-w-0 flex-1 rounded-xl bg-neutral-100 p-3 dark:bg-neutral-800">
                                    <div className="mb-1 flex items-start justify-between gap-2">
                                        <span className="truncate text-sm font-semibold">
                                            {autor?.nome ?? "Ex-membro"}
                                        </span>
                                        {meuComentario && (
                                            <Button
                                                variant="iconePerigo"
                                                onClick={() => excluirComentario(c.id)}
                                                aria-label="Excluir comentário"
                                                title="Excluir comentário"
                                            >
                                                <Trash2 size={14} />
                                            </Button>
                                        )}
                                    </div>
                                    <p className="whitespace-pre-wrap wrap-break-word text-sm leading-relaxed">
                                        {c.texto}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <form
                onSubmit={aoEnviar}
                className="flex shrink-0 flex-col gap-2 border-t border-neutral-200 pt-4 dark:border-neutral-800"
            >
                <Input
                    variant="filled"
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    placeholder="Escreva um comentário..."
                />
                {erroEnvio && <p className="text-sm text-erro">{erroEnvio}</p>}
                <Button type="submit" disabled={enviando || texto.trim() === ""} className="w-full">
                    {enviando ? "Enviando..." : "Enviar"}
                </Button>
            </form>
        </>
    );
}