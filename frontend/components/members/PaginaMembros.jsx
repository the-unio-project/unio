"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useMembros } from "@/hooks/useMembros";
import { FUNCOES, podeRemoverMembro, podeConvidar } from "@/lib/funcoes";
import SecaoMembros from "@/components/members/SecaoMembros";
import ModalConfirmacao from "@/components/ui/ModalConfirmacao";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function PaginaMembros({ workspaceId }) {
    const { usuarioAtual } = useAuth();
    const { membros, carregando, erro, removerMembro, gerarLinkConvite } = useMembros(workspaceId);
    const [membroRemovendoId, setMembroRemovendoId] = useState(null);
    const [gerandoLink, setGerandoLink] = useState(false);
    const [linkConvite, setLinkConvite] = useState("");

    if (carregando) return <p className="p-4 text-neutral-500">Carregando...</p>;
    if (erro) return <p className="p-4 text-erro">{erro}</p>;

    const minhaFuncao = membros.find((m) => m.id === usuarioAtual?.id)?.funcao;
    const membroRemovendo = membros.find((m) => m.id === membroRemovendoId);

    function listaFuncao(funcao) {
        return membros.filter((m) => m.funcao === funcao);
    }

    async function gerarLink() {
        if (gerandoLink) return;
        setGerandoLink(true);
        const link = await gerarLinkConvite();
        if (link) {
            setLinkConvite(link);
            try {
                await navigator.clipboard.writeText(link);
                toast.success("Link de convite copiado.");
            } catch {
                toast.error("Não foi possível copiar. Copie o link abaixo.");
            }
        }
        setGerandoLink(false);
    }

    function secao(titulo, funcao, textoVazio) {
        return (
            <SecaoMembros
                titulo={titulo}
                membros={listaFuncao(funcao)}
                usuarioId={usuarioAtual?.id}
                textoVazio={textoVazio}
                podeRemover={(m) => podeRemoverMembro(minhaFuncao, m.funcao)}
                aoRemover={setMembroRemovendoId}
            />
        );
    }

    return (
        <div className="flex max-w-3xl flex-col gap-4 p-4">
            <div className="flex items-center justify-between">
                <h1 className="font-titulo text-3xl">Membros</h1>
                {podeConvidar(minhaFuncao) && (
                    <Button onClick={gerarLink} disabled={gerandoLink} className="hover:cursor-pointer">
                        {gerandoLink ? "Gerando..." : "Gerar link de convite"}
                    </Button>
                )}
            </div>

            {linkConvite && (
                <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-neutral-900">
                    <Input
                        variant="filled"
                        label="Link de convite"
                        value={linkConvite}
                        readOnly
                        onFocus={(e) => e.target.select()}
                    />
                </div>
            )}

            {secao("Proprietário", FUNCOES.PROPRIETARIO, "Nenhum proprietário.")}
            {secao("Administradores", FUNCOES.ADMINISTRADOR, "Nenhum administrador.")}
            {secao("Membros", FUNCOES.MEMBRO, "Nenhum membro.")}

            {membroRemovendo && (
                <ModalConfirmacao
                    titulo="Remover membro"
                    mensagem={`“${membroRemovendo.nome}” perderá o acesso a este workspace.`}
                    aoConfirmar={async () => {
                        await removerMembro(membroRemovendo.id);
                        setMembroRemovendoId(null);
                    }}
                    aoCancelar={() => setMembroRemovendoId(null)}
                />
            )}
        </div>
    );
}