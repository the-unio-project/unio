"use client"

export default function Button({ children, onClick, variant = "primary", type = "button", className = "", ...resto }) {
    const estilos = {
    primary: "px-4 py-2 bg-violet-700 text-white hover:bg-violet-800",
    secondary: "px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300",
    task: "px-4 py-2 bg-gray-100 text-gray-800 hover:bg-gray-200",
    icone: "p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800",
    contorno: "px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800",
    };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`rounded-md font-medium transition ${estilos[variant]} ${className}`}
      {...resto}
    >
      {children}
    </button>
  );
}