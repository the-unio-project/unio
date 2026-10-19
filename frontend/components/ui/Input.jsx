import { useId } from 'react';

export default function Input({ label, variant = "default", className = "", ...resto }) {
    const id = useId();
    const estilos = {
        default: "px-3 py-2 border border-gray-300 rounded-md bg-transparent dark:border-gray-700 dark:text-white",
        filled: "px-4 py-3 bg-gray-200 border border-transparent rounded-xl text-gray-900 placeholder:text-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400",
    };

    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && (
                <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                </label>
            )}
            <input
                id={id}
                // Classes base (largura, focus, transição) unidas à variante e classes extras
                className={`w-full focus:outline-none focus:ring-2 focus:ring-purple-600 transition-colors ${estilos[variant]} ${className}`}
                {...resto}
            />
        </div>
    );
}