import { useEffect, useState } from 'react';
import { carsAPI } from '../../utils/api';
import { Search, Plus, Edit2, Trash2, X, Car, Users, Fuel, IndianRupee } from 'lucide-react';

export default function Fleet() {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [editingCar, setEditingCar] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const initialFormState = {
        name: '',
        category: '',
        image: '',
        video: '',
        features: '',
        capacity: '',
        price: '',
        description: '',
        id: null
    };
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        loadCars();
    }, []);

    const loadCars = async () => {
        try {
            setLoading(true);
            const data = await carsAPI.getAll();
            setCars(data);
        } catch (err) {
            console.error('Failed to load cars:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                ...formData,
                features: formData.features.split(',').map(f => f.trim())
            };

            if (editingCar) {
                await carsAPI.update(editingCar._id, payload);
            } else {
                await carsAPI.create(payload);
            }

            closeModal();
            await loadCars();
        } catch (err) {
            alert('Failed to save car');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this car?')) return;
        try {
            await carsAPI.delete(id);
            await loadCars();
        } catch (err) {
            alert('Failed to delete car');
        }
    };

    const openModal = (car = null) => {
        if (car) {
            setEditingCar(car);
            setFormData({
                name: car.name,
                category: car.category,
                image: car.image,
                video: car.video || '',
                features: car.features.join(', '),
                capacity: car.capacity,
                price: car.price,
                description: car.description,
                id: car._id
            });
        } else {
            setIsCreating(true);
            setFormData(initialFormState);
        }
    };

    const closeModal = () => {
        setEditingCar(null);
        setIsCreating(false);
        setFormData(initialFormState);
    };

    const filteredCars = cars.filter(car =>
        car.name.toLowerCase().includes(search.toLowerCase()) ||
        car.category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="fleet-page">
            <div className="adminPageHeader">
                <div>
                    <h1 className="adminPageTitle">Fleet Management</h1>
                    <p className="text-muted" style={{ marginTop: 4 }}>Manage your vehicle inventory and pricing.</p>
                </div>
                <button className="btn btn-primary" onClick={() => openModal()}>
                    <Plus size={18} style={{ marginRight: 8 }} />
                    Add New Car
                </button>
            </div>

            <div className="card" style={{ border: 'none', boxShadow: 'var(--shadow-sm)' }}>
                <div className="filters-bar" style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '1.5rem' }}>
                    <div className="search-wrapper">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search cars by name or category..."
                            className="adminSearch"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
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
                                    <th style={{ paddingLeft: '24px' }}>Vehicle</th>
                                    <th>Category</th>
                                    <th>Capacity</th>
                                    <th>Price</th>
                                    <th style={{ paddingRight: '24px', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCars.map((car) => (
                                    <tr key={car._id}>
                                        <td style={{ paddingLeft: '24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div className="car-thumb" style={{
                                                    width: '60px',
                                                    height: '40px',
                                                    borderRadius: '8px',
                                                    overflow: 'hidden',
                                                    background: '#f1f5f9'
                                                }}>
                                                    {car.image ? (
                                                        <img
                                                            src={car.image}
                                                            alt={car.name}
                                                            style={{
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'cover'
                                                            }}
                                                        />
                                                    ) : (
                                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <Car size={20} className="muted" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600, color: '#1e293b' }}>{car.name}</div>
                                                    {car.features && car.features.length > 0 && (
                                                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
                                                            {car.features.slice(0, 2).join(', ')}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`category-badge ${car.category === 'Luxury' ? 'badge-purple' : 'badge-blue'}`}>
                                                {car.category}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#475569' }}>
                                                <Users size={16} />
                                                <span style={{ fontWeight: 500 }}>{car.capacity}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 600, color: '#0f172a' }}>{car.price}</div>
                                        </td>
                                        <td style={{ paddingRight: '24px', textAlign: 'right' }}>
                                            <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                                                <button
                                                    className="btn-icon approve"
                                                    onClick={() => openModal(car)}
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    className="btn-icon delete"
                                                    onClick={() => handleDelete(car._id)}
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

            {(isCreating || editingCar) && (
                <div className="modalOverlay" onClick={closeModal}>
                    <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                        <div className="modalHeader">
                            <div>
                                <h2 className="cardTitle" style={{ fontSize: '1.5rem' }}>
                                    {editingCar ? 'Edit Vehicle' : 'Add New Vehicle'}
                                </h2>
                                <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: 4 }}>
                                    Fill in the details below to {editingCar ? 'update' : 'create'} a fleet item.
                                </p>
                            </div>
                            <button className="close-btn" onClick={closeModal}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '2rem' }}>
                                {formData.image ? (
                                    <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', height: '200px', border: '1px solid var(--border)' }}>
                                        <img
                                            src={formData.image}
                                            alt="Preview"
                                            className="imagePreview"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', margin: 0, border: 'none' }}
                                            onError={(e) => e.target.style.display = 'none'}
                                        />
                                        <div style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                                            padding: '1rem',
                                            color: 'white',
                                            fontSize: '0.85rem'
                                        }}>
                                            Image Preview
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{
                                        height: '120px',
                                        background: '#f8fafc',
                                        border: '2px dashed #e2e8f0',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#94a3b8',
                                        flexDirection: 'column',
                                        gap: '8px'
                                    }}>
                                        <Car size={32} />
                                        <span>Image preview will appear here</span>
                                    </div>
                                )}
                            </div>

                            <div className="gridTwo">
                                <div className="field">
                                    <label className="fieldLabel">Vehicle Name</label>
                                    <input
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. Toyota Innova Crysta"
                                    />
                                </div>
                                <div className="field">
                                    <label className="fieldLabel">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Sedan">Sedan</option>
                                        <option value="SUV">SUV</option>
                                        <option value="MPV">MPV</option>
                                        <option value="Luxury">Luxury</option>
                                        <option value="Tempo Traveller">Tempo Traveller</option>
                                        <option value="Truck">Truck</option>
                                        <option value="Hatchback">Hatchback</option>
                                    </select>
                                </div>
                            </div>

                            <div className="gridTwo">
                                <div className="field">
                                    <label className="fieldLabel">Capacity</label>
                                    <div style={{ position: 'relative' }}>
                                        <Users size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                        <input
                                            value={formData.capacity}
                                            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                            placeholder="e.g. 4+1 Seater"
                                            style={{ paddingLeft: '36px' }}
                                        />
                                    </div>
                                </div>
                                <div className="field">
                                    <label className="fieldLabel">Price / Rates</label>
                                    <div style={{ position: 'relative' }}>
                                        <IndianRupee size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                        <input
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            placeholder="e.g. 18/km or 2500/day"
                                            style={{ paddingLeft: '36px' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="field">
                                <label className="fieldLabel">Image URL</label>
                                <input
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    placeholder="https://example.com/car-image.jpg"
                                />
                            </div>


                            <div className="field">
                                <label className="fieldLabel">Features</label>
                                <textarea
                                    rows="2"
                                    value={formData.features}
                                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                    placeholder="AC, Music System, GPS, Reclining Seats (comma separated)"
                                />
                                <span className="helper-text" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                    Separate features with commas
                                </span>
                            </div>

                            <div className="field">
                                <label className="fieldLabel">Description</label>
                                <textarea
                                    rows="3"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Brief description of the vehicle and its comfort level."
                                />
                            </div>

                            <div className="formActions" style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginTop: '1rem' }}>
                                <button type="button" className="btn btnSoft" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? 'Saving...' : (editingCar ? 'Update Vehicle' : 'Create Vehicle')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
