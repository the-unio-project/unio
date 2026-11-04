"use client";

import { useState } from "react";
import { aceitarConviteApi } from "@/lib/api";
import Button from "@/components/ui/Button";

export default function AceitarConvite({ token }) {
    const [aceitando, setAceitando] = useState(false);
    const [erro, setErro] = useState("");

    async function aceitar() {
        if (aceitando) return;
        setAceitando(true);
        setErro("");
        try {
            const workspaceId = await aceitarConviteApi(token);
            window.location.assign(`/${workspaceId}/membros`);
        } catch {
            setErro("Não foi possível aceitar o convite. Ele pode ser inválido ou você já participa deste workspace.");
            setAceitando(false);
        }
    }

    return (
        <div className="p-4">
            <div className="flex max-w-md flex-col gap-4 rounded-xl bg-white p-6 shadow-sm dark:bg-neutral-900">
                <h1 className="font-titulo text-3xl">Convite de Workspace</h1>
                <p className="text-neutral-600 dark:text-neutral-400">
                    Você foi convidado para participar de um workspace. Deseja entrar?
                </p>
                {erro && <p className="text-sm text-erro">{erro}</p>}
                <div>
                    <Button onClick={aceitar} disabled={aceitando}>
                        {aceitando ? "Entrando..." : "Aceitar convite"}
                    </Button>
                </div>
            </div>
        </div>
    );
}