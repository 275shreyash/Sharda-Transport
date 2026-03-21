import { useEffect, useState } from 'react';
import { bookingsAPI, adminAPI } from '../../utils/api';
import {
    Search,
    Filter,
    Plus,
    Edit2,
    Trash2,
    X,
    CheckCircle,
    AlertCircle,
    Download
} from 'lucide-react';

export default function Bookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBooking, setEditingBooking] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const initialFormState = {
        serviceType: 'movers-packers',
        date: new Date().toISOString().split('T')[0],
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        amount: '',
        cost: '',
        status: 'pending',
        notes: ''
    };
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        try {
            setLoading(true);
            const data = await bookingsAPI.getAll();
            // Sort by date descending (newest first)
            const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setBookings(sortedData);
        } catch (err) {
            console.error('Failed to load bookings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (booking = null) => {
        if (booking) {
            setEditingBooking(booking);
            setFormData({
                serviceType: booking.serviceType || 'movers-packers',
                date: booking.date?.split('T')[0] || new Date().toISOString().split('T')[0],
                customerName: booking.customerName || '',
                customerPhone: booking.customerPhone || '',
                customerEmail: booking.customerEmail || '',
                amount: booking.amount || '',
                cost: booking.cost || '',
                status: booking.status || 'pending',
                notes: booking.notes || ''
            });
        } else {
            setEditingBooking(null);
            setFormData(initialFormState);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingBooking(null);
        setFormData(initialFormState);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                ...formData,
                amount: parseFloat(formData.amount) || 0,
                cost: parseFloat(formData.cost) || 0
            };

            if (editingBooking) {
                await bookingsAPI.update(editingBooking._id, payload);
            } else {
                await bookingsAPI.create(payload);
            }

            await loadBookings();
            handleCloseModal();
        } catch (err) {
            alert('Failed to save booking: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this booking?')) return;
        try {
            await bookingsAPI.delete(id);
            await loadBookings();
        } catch (err) {
            alert('Failed to delete booking');
        }
    };

    const filteredBookings = bookings.filter((booking) => {
        const matchesSearch =
            booking.customerName.toLowerCase().includes(search.toLowerCase()) ||
            booking.customerEmail?.toLowerCase().includes(search.toLowerCase());

        const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
        const matchesDate = !dateFilter || booking.date.startsWith(dateFilter);

        return matchesSearch && matchesStatus && matchesDate;
    });

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    return (
        <div className="bookings-page">
            <div className="adminPageHeader">
                <h1 className="adminPageTitle">Bookings</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => adminAPI.exportCSV('bookings')}
                        className="btn btnSoft"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Download size={18} /> Export CSV
                    </button>
                    <button className="btn" onClick={() => handleOpenModal()}>
                        <Plus size={18} style={{ marginRight: 8 }} />
                        New Booking
                    </button>
                </div>
            </div>

            <div className="card">
                <div className="filters-bar">
                    <div className="search-wrapper">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search customer..."
                            className="adminSearch"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="filters-group">
                        <select
                            className="adminSearch"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        <input
                            type="date"
                            className="adminSearch"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="loading-container"><div className="spinner"></div></div>
                ) : (
                    <div className="adminTableWrapper">
                        <table className="adminTable">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Customer</th>
                                    <th>Service</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.map((booking) => {
                                    const profit = (booking.amount || 0) - (booking.cost || 0);
                                    return (
                                        <tr key={booking._id}>
                                            <td>{formatDate(booking.date)}</td>
                                            <td>
                                                <div style={{ fontWeight: 500 }}>{booking.customerName}</div>
                                                <div className="muted" style={{ fontSize: '0.8rem' }}>{booking.customerPhone}</div>
                                            </td>
                                            <td>
                                                <span className="service-tag">
                                                    {booking.serviceType === 'movers-packers' ? 'Movers' : 'Rental'}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`status-badge status-${booking.status}`}>
                                                    {booking.status}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="btn-icon"
                                                        onClick={() => handleOpenModal(booking)}
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        className="btn-icon delete"
                                                        onClick={() => handleDelete(booking._id)}
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="modalOverlay" onClick={handleCloseModal}>
                    <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                        <div className="modalHeader">
                            <h2 className="cardTitle">{editingBooking ? 'Edit Booking' : 'New Booking'}</h2>
                            <button className="close-btn" onClick={handleCloseModal}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="gridTwo">
                                <div className="field">
                                    <label className="fieldLabel">Service Type</label>
                                    <select
                                        value={formData.serviceType}
                                        onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                                    >
                                        <option value="movers-packers">Movers & Packers</option>
                                        <option value="car-rental">Car Rental</option>
                                    </select>
                                </div>
                                <div className="field">
                                    <label className="fieldLabel">Date</label>
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="field">
                                <label className="fieldLabel">Customer Name</label>
                                <input
                                    type="text"
                                    value={formData.customerName}
                                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="gridTwo">
                                <div className="field">
                                    <label className="fieldLabel">Phone</label>
                                    <input
                                        type="tel"
                                        value={formData.customerPhone}
                                        onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                                    />
                                </div>
                                <div className="field">
                                    <label className="fieldLabel">Email</label>
                                    <input
                                        type="email"
                                        value={formData.customerEmail}
                                        onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="gridTwo">
                                <div className="field">
                                    <label className="fieldLabel">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                                <div className="field"></div>
                            </div>

                            <div className="field">
                                <label className="fieldLabel">Notes</label>
                                <textarea
                                    rows="3"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>

                            <div className="formActions">
                                <button type="button" className="btn btnSoft" onClick={handleCloseModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn" disabled={submitting}>
                                    {submitting ? 'Saving...' : 'Save Booking'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
