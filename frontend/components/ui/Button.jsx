"use client"

export default function Button({ children, onClick, variant="primary", type="button" }) {
    const estilos = {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    }

  return (
    <button 
    type={type}
    onClick={onClick}
    className={`px-4 py-2 rounded-md font-medium transition ${estilos[variant]}`}>
      {children}
    </button>
  );
}