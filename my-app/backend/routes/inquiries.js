import express from 'express'
import jwt from 'jsonwebtoken'
import Inquiry from '../models/Inquiry.js'
import { protect } from '../middleware/auth.js'
import { adminOnly } from '../middleware/admin.js'
import { sendAdminNotification, sendCustomerApprovalNotification } from '../utils/email.js'

const router = express.Router()

// Public: create an inquiry
router.post('/', async (req, res) => {
  try {
    const { service, name, email, phone, pickup, drop, date, message } = req.body
    if (!service || !name || !email) {
      return res.status(400).json({ message: 'Please provide service, name, and email' })
    }

    let createdBy = undefined;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        createdBy = decoded.id;
      } catch (err) {
        // Just ignore if token is invalid, it's a public route 
      }
    }

    const inquiry = await Inquiry.create({ service, name, email, phone, pickup, drop, date, message, createdBy })

    // Asynchronously send notification to the admin without blocking the client response
    sendAdminNotification({ service, name, email, phone, pickup, drop, date, message })

    res.status(201).json(inquiry)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Protected: list inquiries (admin sees all, customer sees only their own)
router.get('/', protect, async (req, res) => {
  try {
    const query = req.user.role === 'admin'
      ? {}
      : { $or: [{ createdBy: req.user._id }, { email: req.user.email }] };

    const inquiries = await Inquiry.find(query).sort({ createdAt: -1 })
    res.json(inquiries)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Protected: update inquiry status (admin only)
router.put('/:id', adminOnly, async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' })

    // Check if the status was just updated to 'approved' and it's coming from the body
    if (req.body.status === 'approved' && inquiry.email) {
      sendCustomerApprovalNotification({ service: inquiry.service, name: inquiry.name, email: inquiry.email })
    }

    res.json(inquiry)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Protected: delete inquiry (admin only)
router.delete('/:id', adminOnly, async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id)
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' })
    await Inquiry.findByIdAndDelete(req.params.id)
    res.json({ message: 'Inquiry deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

export default router
