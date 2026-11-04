"use client"

export default function Button({ children, onClick, variant = "primary", type = "button", className = "", ...resto }) {
  const estilos = {
    primary: "px-4 py-2 bg-primary text-white hover:bg-primary-hover hover:cursor-pointer",
    secondary: "px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-neutral-800 dark:text-gray-200 dark:hover:bg-neutral-700 hover:cursor-pointer",
    task: "px-4 py-2 bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-neutral-800 dark:text-gray-200 dark:hover:bg-neutral-700 hover:cursor-pointer",
    icone: "p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:cursor-pointer",
    contorno: "px-4 py-2 border border-carvao text-carvao hover:bg-gray-100 dark:border-neutral-500 dark:text-gray-200 dark:hover:bg-neutral-800",
    perigo: "px-4 py-2 bg-erro text-white hover:opacity-90 hover:cursor-pointer",
    claro: "px-4 py-2 text-white hover:bg-white/15",
    contornoClaro: "px-4 py-2 border border-white/30 text-white hover:bg-white/15",
    iconeClaro: "p-1 text-white hover:bg-white/15",
    iconePerigo: "p-1 text-neutral-500 hover:bg-erro hover:text-white dark:text-neutral-400",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${estilos[variant]} ${className}`}
      {...resto}
    >
      {children}
    </button>
  );
}