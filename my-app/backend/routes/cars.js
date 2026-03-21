import express from 'express'
import Car from '../models/Car.js'
import { protect } from '../middleware/auth.js'
import { adminOnly } from '../middleware/admin.js'

const router = express.Router()

// List all cars (admin or authenticated)
router.get('/', protect, async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 })
    res.json(cars)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Create a car (admin only)
router.post('/', adminOnly, async (req, res) => {
  try {
    const { name, category, image, features, capacity, price, description, available } = req.body

    if (!name) {
      return res.status(400).json({ message: 'Name is required' })
    }

    const car = await Car.create({
      name,
      category,
      image,
      features: Array.isArray(features) ? features : (features ? String(features).split(',').map(f => f.trim()) : []),
      capacity,
      price,
      description,
      available: available === undefined ? true : !!available,
      createdBy: req.user._id
    })

    res.status(201).json(car)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Update car (admin only)
router.put('/:id', adminOnly, async (req, res) => {
  try {
    const update = { ...req.body }
    if (update.features && !Array.isArray(update.features)) {
      update.features = String(update.features).split(',').map(f => f.trim())
    }

    const car = await Car.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true })

    if (!car) return res.status(404).json({ message: 'Car not found' })

    res.json(car)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Delete car (admin only)
router.delete('/:id', adminOnly, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id)
    if (!car) return res.status(404).json({ message: 'Car not found' })

    await Car.findByIdAndDelete(req.params.id)
    res.json({ message: 'Car deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

export default router
