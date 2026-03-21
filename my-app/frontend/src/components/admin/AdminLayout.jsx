import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import '../../App.css';
import { Menu } from 'lucide-react';

export default function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    // Close sidebar on route change
    if (isSidebarOpen) {
        // This causes a re-render loop if done directly in body, better to use useEffect in Sidebar or Layout
        // But for simplicity, let's just pass a close handler to Sidebar links
    }

    return (
        <div className="adminLayout">
            <button
                className="admin-mobile-toggle"
                onClick={() => setIsSidebarOpen(true)}
            >
                <Menu size={24} />
            </button>

            <AdminSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {isSidebarOpen && (
                <div
                    className="admin-overlay"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <main className="adminContent">
                <Outlet />
            </main>
        </div>
    );
}
