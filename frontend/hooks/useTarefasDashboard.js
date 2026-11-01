import { useState, useEffect } from "react";
import { listarMinhasTarefas, listarVencendoHoje, listarAtrasadas } from "@/lib/api";

export default function useTarefasDashboard() {
    const [dados, setDados] = useState({ minhas: [], hoje: [], atrasadas: [] });
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        let cancelado = false;

        async function carregar() {
            try {
                const [minhas, hoje, atrasadas] = await Promise.all([
                    listarMinhasTarefas(),
                    listarVencendoHoje(),
                    listarAtrasadas(),
                ]);
                if (!cancelado) setDados({ minhas, hoje, atrasadas });
            } catch {
                if (!cancelado) setErro("Não foi possível carregar suas tarefas.");
            } finally {
                if (!cancelado) setCarregando(false);
            }
        }

        carregar();
        return () => { cancelado = true; };
    }, []);

    return { ...dados, carregando, erro };
}