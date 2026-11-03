"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import Button from "@/components/ui/Button";
import useNotificacoes from "@/hooks/useNotificacoes";

const TEXTOS_NOTIFICACAO = {
    "assigned to task": "Você foi atribuído a uma tarefa",
};

export default function CentroNotificacoes() {
    const [aberto, setAberto] = useState(false);
    const { notificacoes, naoLidas, erro, recarregar, marcarComoLida, marcarTodasComoLidas } =
        useNotificacoes();

    function alternar() {
        if (!aberto) recarregar();
        setAberto(!aberto);
    }

    return (
        <div className="relative">
            <Button
                variant="iconeClaro"
                onClick={alternar}
                aria-label="Notificações"
                className="relative hover:cursor-pointer"
            >
                <Bell size={18} />
                {naoLidas > 0 && (
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-alerta" />
                )}
            </Button>

            {aberto && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setAberto(false)} />

                    <div className="absolute right-0 z-20 mt-2 w-80 rounded-md bg-white p-3 text-carvao shadow-lg dark:bg-neutral-900 dark:text-gray-100">
                        <div className="mb-2 flex items-center justify-between">
                            <h2 className="font-medium">Notificações</h2>
                            {naoLidas > 0 && (
                                <button
                                    onClick={marcarTodasComoLidas}
                                    className="text-sm text-primary hover:underline"
                                >
                                    Marcar todas como lidas
                                </button>
                            )}
                        </div>

                        {erro && <p className="mb-2 text-sm text-erro">{erro}</p>}

                        {notificacoes.length === 0 ? (
                            <p className="py-4 text-center text-sm text-gray-500">
                                Nenhuma notificação.
                            </p>
                        ) : (
                            <ul className="flex max-h-80 flex-col gap-1 overflow-y-auto">
                                {notificacoes.map((n) => (
                                    <li key={n.id}>
                                        <button
                                            onClick={() => !n.lida && marcarComoLida(n.id)}
                                            className={`flex w-full items-center gap-2 rounded-md p-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-neutral-800 ${n.lida ? "text-gray-500" : "font-medium"
                                                }`}
                                        >
                                            {!n.lida && (
                                                <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                                            )}
                                            {TEXTOS_NOTIFICACAO[n.tipo] ?? "Nova notificação"}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}