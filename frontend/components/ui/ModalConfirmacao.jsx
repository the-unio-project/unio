"use client";

import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

export default function ModalConfirmacao({ titulo, mensagem, aoConfirmar, aoCancelar, textoConfirmar = "Excluir" }) {
    return (
        <Modal aoFechar={aoCancelar} largura="max-w-md">
            <h2 className="mb-2 pr-10 font-titulo text-2xl">{titulo}</h2>
            <p className="mb-6 text-neutral-700 dark:text-neutral-300">{mensagem}</p>
            <div className="flex justify-end gap-2">
                <Button variant="contorno" onClick={aoCancelar}>Cancelar</Button>
                <Button variant="perigo" onClick={aoConfirmar}>{textoConfirmar}</Button>
            </div>
        </Modal>
    )
}