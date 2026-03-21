import express from 'express'
import Booking from '../models/Booking.js'

const router = express.Router()

// @route   GET /api/reviews
// @desc    Get top/recent reviews for public display
// @access  Public
router.get('/', async (req, res) => {
    try {
        // Top recent reviews that have a 4 or 5 star rating
        const topReviews = await Booking.find({
            status: 'completed',
            rating: { $gte: 4 },
            review: { $exists: true, $ne: '' }
        })
            .sort({ createdAt: -1 })
            .limit(6)
            .populate('createdBy', 'name')
            .lean();

        // Map the response to be cleaner
        const formattedReviews = topReviews.map(b => ({
            _id: b._id,
            name: b.customerName || (b.createdBy && b.createdBy.name) || 'Anonymous',
            rating: b.rating,
            comment: b.review,
            serviceType: b.serviceType === 'movers-packers' ? 'Movers & Packers' : 'Car Rental',
            date: b.date
        }));

        res.json(formattedReviews);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching reviews', error: error.message })
    }
})

export default router
