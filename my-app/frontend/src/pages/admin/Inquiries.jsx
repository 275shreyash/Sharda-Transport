import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { inquiriesAPI, bookingsAPI, adminAPI } from '../../utils/api';
import { Search, Filter, Trash2, CheckCircle, XCircle, Download } from 'lucide-react';

export default function Inquiries() {
    const navigate = useNavigate();
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        loadInquiries();
    }, []);

    const loadInquiries = async () => {
        try {
            setLoading(true);
            const data = await inquiriesAPI.getAll();
            setInquiries(data);
        } catch (err) {
            console.error('Failed to load inquiries:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (id, status, inquiry = null) => {
        try {
            await inquiriesAPI.update(id, { status });
        } catch (err) {
            console.error(err);
            alert('Failed to update inquiry status');
            return; // Stop if status update fails
        }

        // If approved, create a corresponding booking
        if (status === 'approved' && inquiry) {
            try {
                const bookingPayload = {
                    customerName: inquiry.name || 'Unknown Customer',
                    customerEmail: inquiry.email || '',
                    customerPhone: inquiry.phone || '',
                    serviceType: (inquiry.service || '').toLowerCase().includes('car') ? 'car-rental' : 'movers-packers',
                    date: new Date().toISOString().split('T')[0],
                    status: 'confirmed',
                    amount: 0,
                    cost: 0,
                    notes: `Created from inquiry: ${inquiry.message || ''}`,
                    createdBy: inquiry.createdBy || undefined
                };

                const response = await bookingsAPI.create(bookingPayload);

                alert('Inquiry approved and Booking created successfully! Redirecting to Bookings...');
                navigate('/admin/bookings');
            } catch (err) {
                console.error('Booking Creation Error:', err);
                alert(`Inquiry approved, but Booking creation failed: ${err.message}`);
            }
        }

        await loadInquiries();
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this inquiry?')) return;
        try {
            await inquiriesAPI.delete(id);
            await loadInquiries();
        } catch (err) {
            alert('Failed to delete inquiry');
        }
    };

    const filteredInquiries = inquiries.filter((inq) => {
        const matchesSearch =
            inq.name.toLowerCase().includes(search.toLowerCase()) ||
            inq.message.toLowerCase().includes(search.toLowerCase()) ||
            inq.service.toLowerCase().includes(search.toLowerCase());

        const matchesStatus = statusFilter === 'all' || inq.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateString;
        }
    };

    return (
        <div className="inquiries-page">
            <div className="adminPageHeader">
                <h1 className="adminPageTitle">Inquiries</h1>
                <button
                    onClick={() => adminAPI.exportCSV('inquiries')}
                    className="btn"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <Download size={18} /> Export CSV
                </button>
            </div>

            <div className="card">
                <div className="filters-bar">
                    <div className="search-wrapper">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search inquiries..."
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
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="loading-container"><div className="spinner"></div></div>
                ) : filteredInquiries.length === 0 ? (
                    <div className="empty-state">
                        <p className="muted">No inquiries found matching your filters.</p>
                    </div>
                ) : (
                    <div className="adminTableWrapper">
                        <table className="adminTable">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Customer</th>
                                    <th>Service</th>
                                    <th>Message</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInquiries.map((inq) => (
                                    <tr key={inq._id}>
                                        <td style={{ fontSize: '0.85rem' }}>{formatDate(inq.createdAt)}</td>
                                        <td>
                                            <div style={{ fontWeight: 500 }}>{inq.name}</div>
                                            <div className="muted" style={{ fontSize: '0.8rem' }}>{inq.phone}</div>
                                        </td>
                                        <td><span className="service-tag">{inq.service}</span></td>
                                        <td style={{ maxWidth: 300 }}>
                                            <div className="message-preview" title={inq.message}>
                                                {inq.message}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`status-badge status-${inq.status}`}>
                                                {inq.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                {inq.status !== 'approved' && (
                                                    <button
                                                        className="btn-icon approve"
                                                        onClick={() => handleUpdate(inq._id, 'approved', inq)}
                                                        title="Approve"
                                                    >
                                                        <CheckCircle size={16} />
                                                    </button>
                                                )}
                                                {inq.status !== 'rejected' && (
                                                    <button
                                                        className="btn-icon reject"
                                                        onClick={() => handleUpdate(inq._id, 'rejected')}
                                                        title="Reject"
                                                    >
                                                        <XCircle size={16} />
                                                    </button>
                                                )}
                                                <button
                                                    className="btn-icon delete"
                                                    onClick={() => handleDelete(inq._id)}
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
