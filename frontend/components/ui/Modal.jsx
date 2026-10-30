"use client";

import { X } from "lucide-react";
import Button from '@/components/ui/Button';

export default function Modal({ aoFechar, largura = "max-w-2xl", acoes, children }) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) aoFechar();
            }}
        >
            <div className={`relative w-full ${largura} rounded-lg bg-white p-6 text-left dark:bg-gray-900`}>
                <div className="absolute top-4 right-4 flex items-center gap-1">
                    {acoes}
                    <Button variant="icone" onClick={aoFechar} aria-label="Fechar">
                        <X size={20} />
                    </Button>
                </div>
                {children}
            </div>
        </div>
    )
}