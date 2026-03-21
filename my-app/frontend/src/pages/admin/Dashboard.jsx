import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { bookingsAPI, inquiriesAPI, carsAPI } from '../../utils/api';
import { Link } from 'react-router-dom';
import {
    LayoutDashboard,
    CalendarCheck,
    IndianRupee,
    TrendingUp,
    Clock,
    Plus,
    Car,
    Users,
    ArrowRight,
    MessageSquare
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

function SummaryCard({ label, value, icon: Icon, color }) {
    return (
        <div className="card summary-card-creative" style={{ borderLeft: `4px solid ${color}` }}>
            <div className="summary-content-creative">
                <div>
                    <div className="summary-label-creative">{label}</div>
                    <div className="summary-value-creative" style={{ color: color }}>{value}</div>
                </div>
                <div className="summary-icon-creative" style={{ background: `${color}15`, color: color }}>
                    <Icon size={28} />
                </div>
            </div>
        </div>
    );
}

function QuickAction({ to, icon: Icon, label, color }) {
    return (
        <Link to={to} className="quick-action-card">
            <div className="quick-action-icon" style={{ background: `${color}15`, color: color }}>
                <Icon size={24} />
            </div>
            <span className="quick-action-label">{label}</span>
            <ArrowRight size={16} className="quick-action-arrow" style={{ color: color }} />
        </Link>
    );
}

export default function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalBookings: 0,
        totalInquiries: 0,
        totalFleet: 0
    });
    const [recentBookings, setRecentBookings] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const [bookingsData, inquiriesData, carsData] = await Promise.all([
                bookingsAPI.getAll(),
                inquiriesAPI.getAll(),
                carsAPI.getAll()
            ]);

            setStats({
                totalBookings: bookingsData.length,
                totalInquiries: inquiriesData.length,
                totalFleet: carsData.length
            });

            // Sort by date desc
            const sorted = bookingsData.sort((a, b) => new Date(b.date) - new Date(a.date));
            setRecentBookings(sorted.slice(0, 5));
            processChartData(bookingsData);
        } catch (err) {
            console.error('Failed to load dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    const processChartData = (bookings) => {
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        const data = last7Days.map(date => {
            const dayBookings = bookings.filter(b => b.date.startsWith(date)).length;
            return {
                date: new Date(date).toLocaleDateString('en-IN', { weekday: 'short' }),
                bookings: dayBookings
            };
        });

        setChartData(data);
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    if (loading) {
        return <div className="loading-container"><div className="spinner"></div></div>;
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header-creative">
                <div>
                    <h1 className="greeting-title">
                        {getGreeting()}, <span className="highlight-name">{user?.name || 'Admin'}</span> 👋
                    </h1>
                    <p className="greeting-subtitle">Here's what's happening with your business today.</p>
                </div>
                <div className="date-badge-creative">
                    <Clock size={16} />
                    {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid3 stats-grid-creative">
                <SummaryCard
                    label="Total Bookings"
                    value={stats.totalBookings}
                    icon={CalendarCheck}
                    color="#3b82f6"
                />
                <SummaryCard
                    label="Total Inquiries"
                    value={stats.totalInquiries}
                    icon={MessageSquare}
                    color="#8b5cf6"
                />
                <SummaryCard
                    label="Total Fleet"
                    value={stats.totalFleet}
                    icon={Car}
                    color="#10b981"
                />
            </div>

            <div className="dashboard-main-grid">
                {/* Left Column: Chart & Quick Actions */}
                <div className="dashboard-col-left">
                    <div className="card chart-card-creative">
                        <div className="card-header-flex">
                            <div className="cardTitle">Booking Trends</div>
                            <select className="chart-filter">
                                <option>Last 7 Days</option>
                            </select>
                        </div>
                        <div style={{ width: '100%', height: 320, marginTop: '1rem', minWidth: 0 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#94a3b8"
                                        tick={{ fontSize: 12 }}
                                        tickLine={false}
                                        axisLine={false}
                                        dy={10}
                                    />
                                    <YAxis
                                        stroke="#94a3b8"
                                        tick={{ fontSize: 12 }}
                                        tickLine={false}
                                        axisLine={false}
                                        allowDecimals={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1e293b',
                                            border: 'none',
                                            borderRadius: '12px',
                                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                                            padding: '12px'
                                        }}
                                        itemStyle={{ color: '#fff', fontWeight: 500 }}
                                        formatter={(value) => [value, 'Bookings']}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="bookings"
                                        stroke="#3b82f6"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorBookings)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="quick-actions-section">
                        <h3 className="section-title-small">Quick Actions</h3>
                        <div className="grid3 quick-actions-grid">
                            <QuickAction to="/admin/bookings" icon={Plus} label="New Booking" color="#3b82f6" />
                            <QuickAction to="/admin/fleet" icon={Car} label="Manage Fleet" color="#f59e0b" />
                            <QuickAction to="/admin/inquiries" icon={Users} label="View Inquiries" color="#ec4899" />
                        </div>
                    </div>
                </div>

                {/* Right Column: Recent Activity */}
                <div className="dashboard-col-right">
                    <div className="card activity-card">
                        <div className="cardTitle">Recent Activity</div>
                        <div className="activity-list">
                            {recentBookings.length === 0 ? (
                                <div className="empty-state">
                                    <p className="muted">No recent activity.</p>
                                </div>
                            ) : (
                                recentBookings.map((booking) => (
                                    <div key={booking._id} className="activity-item">
                                        <div className={`activity-icon-wrapper ${booking.serviceType === 'movers-packers' ? 'movers' : 'rental'}`}>
                                            {booking.serviceType === 'movers-packers' ? <Users size={16} /> : <Car size={16} />}
                                        </div>
                                        <div className="activity-content">
                                            <div className="activity-header">
                                                <span className="activity-customer">{booking.customerName}</span>
                                                <span className="activity-amount">
                                                    {booking.amount > 0 ? `+₹${booking.amount}` : '-'}
                                                </span>
                                            </div>
                                            <div className="activity-desc">
                                                {booking.serviceType === 'movers-packers' ? 'Movers request' : 'Car rental'}
                                                <span className="dot">•</span>
                                                {new Date(booking.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                                            </div>
                                            <span className={`status-pill ${booking.status}`}>{booking.status}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="view-all-link">
                            <Link to="/admin/bookings">View All Transactions <ArrowRight size={14} /></Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
