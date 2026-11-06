export default function Card({ children, className = "", ...resto }) {
    return (
        <div
            className={`bg-white border border-gray-300 rounded-md px-4 py-2 shadow-md dark:bg-neutral-900 dark:border-neutral-700 dark:text-gray-100 ${className}`}
            {...resto}
        >
            {children}
        </div>
    )
}