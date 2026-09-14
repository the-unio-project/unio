export default function Header() {
    return (
        <header className="flex justify-between p-4">
            <div className="flex items-center gap-4">
                <span>Nome do Workspace</span>
                <input type="text" placeholder="Buscar..." className="border p-2 rounded"/>
            </div>
            <div className="flex items-center gap-4">
                <span>Notificações</span>
                <span>Perfil</span>
            </div>
        </header>
    )
}