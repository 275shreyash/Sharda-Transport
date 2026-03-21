import express from 'express'
import { protect } from '../middleware/auth.js'
import { adminOnly as admin } from '../middleware/admin.js'
import User from '../models/User.js'
import Booking from '../models/Booking.js'
import Inquiry from '../models/Inquiry.js'
import { Parser } from 'json2csv'

const router = express.Router()

// All active export endpoints require normal auth middleware + admin middleware
router.use(protect, admin)

// @route   GET /api/admin/export/:type
// @desc    Export data to CSV
// @access  Private (Admin only)
router.get('/export/:type', async (req, res) => {
    try {
        const { type } = req.params;
        let data;
        let fields;

        // Choose what to export based on type
        switch (type) {
            case 'users':
                data = await User.find({}).select('-password').lean();
                fields = ['_id', 'name', 'email', 'role', 'createdAt'];
                break;
            case 'bookings':
                data = await Booking.find({}).populate('createdBy', 'name email').lean();
                // Flatten fields for CSV
                data = data.map(b => ({
                    id: b._id,
                    serviceType: b.serviceType,
                    date: b.date ? new Date(b.date).toISOString().split('T')[0] : '',
                    customerName: b.customerName,
                    customerPhone: b.customerPhone || '',
                    customerEmail: b.customerEmail || '',
                    amount: b.amount,
                    cost: b.cost,
                    profit: (b.amount || 0) - (b.cost || 0),
                    status: b.status,
                    notes: b.notes || '',
                    createdBy: b.createdBy ? b.createdBy.name : 'Unknown',
                    createdAt: b.createdAt
                }));
                fields = ['id', 'serviceType', 'date', 'customerName', 'customerPhone', 'customerEmail', 'amount', 'cost', 'profit', 'status', 'notes', 'createdBy', 'createdAt'];
                break;
            case 'inquiries':
                data = await Inquiry.find({}).lean();
                fields = ['_id', 'name', 'email', 'phone', 'serviceType', 'origin', 'destination', 'message', 'status', 'createdAt'];
                break;
            default:
                return res.status(400).json({ message: 'Invalid export type. Valid types are users, bookings, inquiries.' });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ message: 'No data to export' });
        }

        // Convert to CSV
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(data);

        // Send the CSV file
        res.header('Content-Type', 'text/csv');
        res.attachment(`sharda_transport_${type}_${new Date().toISOString().split('T')[0]}.csv`);
        return res.send(csv);

    } catch (error) {
        console.error(`Export Error: ${error.message}`);
        res.status(500).json({ message: 'Server error during export', error: error.message });
    }
})

export default router
