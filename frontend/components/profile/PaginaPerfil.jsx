"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { atualizarPerfilApi, baixarFotoAtual } from "@/lib/api";
import Avatar from "@/components/ui/Avatar";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function PaginaPerfil({ usuario }) {
    const { recarregarUsuario } = useAuth();
    const [nickname, setNickname] = useState(usuario.nickname ?? "");
    const [bio, setBio] = useState(usuario.bio ?? "");
    const [fotoNova, setFotoNova] = useState(null);
    const [previa, setPrevia] = useState(null);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");

    const alterado =
        nickname.trim() !== (usuario.nickname ?? "") ||
        bio.trim() !== (usuario.bio ?? "") ||
        fotoNova !== null;

    function escolherFoto(e) {
        const arquivo = e.target.files[0];
        if (!arquivo) return;
        setFotoNova(arquivo);
        setPrevia(URL.createObjectURL(arquivo));
    }

    async function salvar(e) {
        e.preventDefault();
        if (salvando) return;
        if (!fotoNova && !usuario.profile_picture) {
            setErro("Você precisa escolher uma foto de perfil.");
            return;
        }

        setSalvando(true);
        setErro("");
        try {
            const foto = fotoNova ?? (await baixarFotoAtual(usuario.profile_picture));
            await atualizarPerfilApi({ nickname: nickname.trim(), bio: bio.trim(), foto });
            await recarregarUsuario();
            setFotoNova(null);
            setPrevia(null);
            toast.success("Perfil atualizado.");
        } catch {
            setErro("Não foi possível atualizar o perfil.");
        } finally {
            setSalvando(false);
        }
    }

    return (
        <form onSubmit={salvar} className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <Avatar nome={nickname} src={previa ?? usuario.profile_picture} tamanho="lg" />
                <label
                    htmlFor="foto-perfil"
                    className="cursor-pointer rounded-md bg-gray-200 px-4 py-2 font-medium text-gray-800 transition hover:bg-gray-300"
                >
                    Trocar foto
                </label>
                <input
                    id="foto-perfil"
                    type="file"
                    accept="image/*"
                    onChange={escolherFoto}
                    className="sr-only"
                />
            </div>

            <Input
                label="Nome"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={50}
            />

            <Input label="E-mail" value={usuario.email} disabled className="opacity-60" />

            <div className="flex flex-col gap-1.5">
                <label htmlFor="bio" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Biografia
                </label>
                <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700"
                    rows={3}
                />
            </div>

            {erro && <p className="text-sm text-red-500">{erro}</p>}

            <div className="flex justify-end">
                <Button
                    type="submit"
                    disabled={!alterado || nickname.trim() === "" || salvando}
                    className="disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {salvando ? "Salvando..." : "Salvar edições"}
                </Button>
            </div>
        </form>
    );
}