"use client";

import { X } from "lucide-react";
import Button from '@/components/ui/Button';

export default function Modal({ aoFechar, largura = "max-w-2xl", acoes, children }) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) aoFechar();
            }}
        >
            <div className={`relative w-full ${largura} rounded-lg bg-white text-left text-carvao dark:bg-neutral-900 dark:text-gray-100`}>
                <div className="absolute top-4 right-4 z-10 flex items-center gap-1">
                    {acoes}
                    <Button variant="icone" onClick={aoFechar} aria-label="Fechar">
                        <X size={20} />
                    </Button>
                </div>
                <div className="max-h-[90vh] overflow-y-auto rounded-lg p-6">
                    {children}
                </div>
            </div>
        </div>
    )
}