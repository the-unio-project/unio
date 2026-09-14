import Link from 'next/link';

export default function Sidebar() {
    return (
        <nav className="w-64 h-screen p-4">
            <ul className="flex flex-col gap-4 list-none ">
                <li><Link href="/dashboard">Dashboard</Link></li>
                <li><Link href="/projetos">Projetos</Link></li>
                <li><Link href="/membros">Membros</Link></li>
                <li><Link href="/configuracoes">Configurações</Link></li>
            </ul>
        </nav>
    )
}