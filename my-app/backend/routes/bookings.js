import express from 'express'
import Booking from '../models/Booking.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// All routes require authentication
router.use(protect)

// @route   GET /api/bookings
// @desc    Get all bookings (admin sees all, customer sees only their own)
// @access  Private
router.get('/', async (req, res) => {
  try {
    // Admin can see all bookings, customers only see their own
    const query = req.user.role === 'admin'
      ? {}
      : { createdBy: req.user._id }

    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email role')

    res.json(bookings)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// @route   GET /api/bookings/stats
// @desc    Get booking statistics (admin sees all, customer sees only their own)
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    // Admin can see all bookings stats, customers only see their own
    const query = req.user.role === 'admin'
      ? {}
      : { createdBy: req.user._id }

    const bookings = await Booking.find(query)

    const totalBookings = bookings.length
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.amount, 0)
    const totalCost = bookings.reduce((sum, booking) => sum + (booking.cost || 0), 0)
    const totalProfit = totalRevenue - totalCost

    res.json({
      totalBookings,
      totalRevenue,
      totalCost,
      totalProfit
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { serviceType, date, customerName, customerPhone, customerEmail, amount, cost, status, notes } = req.body

    // Validation - handled by Mongoose schema
    // if (!serviceType || !date || !customerName || amount === undefined) {
    //   return res.status(400).json({ message: 'Please provide required fields' })
    // }

    const booking = await Booking.create({
      serviceType,
      date,
      customerName,
      customerPhone,
      customerEmail,
      amount,
      cost: cost || 0,
      status: status || 'pending',
      notes,
      createdBy: (req.user.role === 'admin' && req.body.createdBy) ? req.body.createdBy : req.user._id
    })

    if (req.io && req.user.role === 'admin' && req.body.createdBy) {
      req.io.to(req.body.createdBy.toString()).emit('notification', {
        type: 'booking_created',
        message: 'An admin has created/approved a booking for you! Please check your dashboard.',
        bookingId: booking._id
      })
    }

    res.status(201).json(booking)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// @route   PUT /api/bookings/:id
// @desc    Update a booking
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    // Admin can update any booking, customers can only update their own
    if (req.user.role !== 'admin' && booking.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (req.io && updatedBooking.createdBy) {
      req.io.to(updatedBooking.createdBy.toString()).emit('notification', {
        type: 'booking_update',
        message: `Your booking status was updated to ${updatedBooking.status}!`,
        bookingId: updatedBooking._id
      })
    }

    res.json(updatedBooking)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// @route   DELETE /api/bookings/:id
// @desc    Delete a booking
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    // Admin can update any booking, customers can only update their own
    if (req.user.role !== 'admin' && booking.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    await Booking.findByIdAndDelete(req.params.id)

    res.json({ message: 'Booking deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// @route   PATCH /api/bookings/:id/rate
// @desc    Submit a customer rating for a completed booking
// @access  Private
router.patch('/:id/rate', async (req, res) => {
  try {
    const { rating, review } = req.body

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Please provide a valid rating between 1 and 5' })
    }

    const booking = await Booking.findById(req.params.id)

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    // Customers can only rate their own bookings
    if (booking.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to rate this booking' })
    }

    // Only allow rating if the sprint is completed
    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'Can only rate completed bookings' })
    }

    booking.rating = rating;
    if (review !== undefined) booking.review = review;
    const updatedBooking = await booking.save()

    res.json(updatedBooking)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

export default router

