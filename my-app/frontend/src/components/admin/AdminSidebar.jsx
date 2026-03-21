import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, CalendarDays, Car, MessageSquare, LogOut, Globe, X } from 'lucide-react';

export default function AdminSidebar({ isOpen, onClose }) {
  const { pathname } = useLocation();
  const { logout } = useAuth();

  const isActive = (path) => pathname === path || pathname.startsWith(`${path}/`);

  const links = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Bookings', path: '/admin/bookings', icon: CalendarDays },
    { name: 'Fleet', path: '/admin/fleet', icon: Car },
    { name: 'Inquiries', path: '/admin/inquiries', icon: MessageSquare },
  ];

  return (
    <aside className={`adminSidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebarHeader">
        <h2>Admin Panel</h2>
        <button className="sidebar-close-btn" onClick={onClose}>
          <X size={24} />
        </button>
      </div>

      <nav className="sidebarNav">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`sidebarLink ${isActive(link.path) ? 'active' : ''}`}
              onClick={onClose}
            >
              <span className="icon">
                <Icon size={20} />
              </span>
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="sidebarFooter">
        <Link to="/" className="sidebarLink" style={{ marginBottom: '8px', color: 'var(--muted)' }}>
          <span className="icon"><Globe size={20} /></span>
          Back to Website
        </Link>
        <button onClick={logout} className="logoutBtn">
          <span className="icon">
            <LogOut size={20} />
          </span>
          Logout
        </button>
      </div>
    </aside>
  );
}
