"use client";

import { X } from "lucide-react";
import Button from '@/components/ui/Button';

export default function Modal({ aoFechar, largura = "max-w-2xl", children }) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) aoFechar();
            }}
        >
            <div className={`relative w-full ${largura} rounded-lg bg-white p-6 dark:bg-gray-900`}>
                <Button
                    variant="icone"
                    onClick={aoFechar}
                    aria-label="Fechar"
                    className="absolute top-4 right-4"
                >
                    <X size={20} />
                </Button>
                {children}
            </div>
        </div>
    )
}