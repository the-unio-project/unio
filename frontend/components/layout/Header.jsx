import WorkspaceSelector from "@/components/layout/WorkspaceSelector";

export default function Header() {
    return (
        <header className="flex justify-between p-4">
            <div className="flex items-center gap-4">
                <WorkspaceSelector />
                <input type="text" placeholder="Buscar..." className="border p-2 rounded"/>
            </div>
            <div className="flex items-center gap-4">
                <span>Notificações</span>
                <span>Perfil</span>
            </div>
        </header>
    )
}