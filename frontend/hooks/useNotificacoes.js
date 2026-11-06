"use client";

import { useState, useEffect } from "react";
import {
    listarNotificacoes,
    notificacaoLidaApi,
    todasLidasApi,
} from "@/lib/api";

export default function useNotificacoes() {
    const [notificacoes, setNotificacoes] = useState([]);
    const [erro, setErro] = useState("");

    useEffect(() => {
        listarNotificacoes()
            .then(setNotificacoes)
            .catch(() => setErro("Não foi possível carregar as notificações."));
    }, []);

    async function recarregar() {
        try {
            setNotificacoes(await listarNotificacoes());
            setErro("");
        } catch {
            setErro("Não foi possível carregar as notificações.");
        }
    }

    async function marcarComoLida(id) {
        try {
            await notificacaoLidaApi(id);
            setErro("");
            setNotificacoes((atuais) =>
                atuais.map((n) => (n.id === id ? { ...n, lida: true } : n))
            );
        } catch {
            setErro("Não foi possível marcar como lida.");
        }
    }

    async function marcarTodasComoLidas() {
        try {
            await todasLidasApi();
            setErro("");
            setNotificacoes((atuais) => atuais.map((n) => ({ ...n, lida: true })));
        } catch {
            setErro("Não foi possível marcar todas como lidas.");
        }
    }

    const naoLidas = notificacoes.filter((n) => !n.lida).length;

    return { notificacoes, naoLidas, erro, recarregar, marcarComoLida, marcarTodasComoLidas };
}