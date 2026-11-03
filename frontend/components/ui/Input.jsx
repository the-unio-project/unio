"use client";

import { useId } from "react";

export default function Input({ label, variant = "default", id, className = "", ...resto }) {
    const idGerado = useId();
    const idFinal = id ?? idGerado;

    const estilos = {
        default: "px-3 py-2 border border-gray-300 rounded-md bg-transparent dark:border-neutral-700 dark:text-white",
        filled: "px-4 py-3 bg-campo border border-transparent rounded-xl text-carvao placeholder:text-neutral-500 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-400",
        contrast: "px-3 py-2 rounded-md bg-white/50 border border-black/30 text-carvao placeholder:text-carvao/60",
    };

    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && (
                <label htmlFor={idFinal} className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                </label>
            )}
            <input
                id={idFinal}
                className={`w-full focus:outline-none focus:ring-2 focus:ring-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${estilos[variant]} ${className}`}
                {...resto}
            />
        </div>
    );
}