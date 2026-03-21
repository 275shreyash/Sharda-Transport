import express from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import User from '../models/User.js'

const router = express.Router()

// Helper to normalize email
const normalizeEmail = (email) => {
  if (!email) return ''
  return email.trim().toLowerCase()
}

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key-change-in-production', {
    expiresIn: '30d'
  })
}

// @route   POST /api/auth/signup
// @desc    Register a new user (defaults to customer role)
// @access  Public
router.post('/signup', async (req, res) => {
  try {
    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        message: 'Database not connected. Please check MongoDB connection and try again.'
      })
    }

    const { name, email, password, role } = req.body
    const normalizedEmail = normalizeEmail(email)

    // Validation
    if (!name || !normalizedEmail || !password) {
      return res.status(400).json({ message: 'Please provide all fields' })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }

    // Only allow 'customer' role for public signup (admin accounts must be created by existing admins)
    const userRole = role === 'admin' ? 'customer' : (role || 'customer')

    // Check if user exists
    const userExists = await User.findOne({ email: normalizedEmail })
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Create user
    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      role: userRole

    })

    // Send Welcome Email
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      })

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: normalizedEmail,
        subject: 'Welcome to Sharda Transport! 🚚',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #FF5722;">Welcome to Sharda Transport, ${name}!</h2>
            <p>We are thrilled to have you on board.</p>
            <p>Whether you need to move your home, rent a luxury car, or transport goods, we are here to make it smooth and hassle-free.</p>
            <br>
            <p><strong>Your Account Details:</strong></p>
            <ul>
              <li>Email: ${normalizedEmail}</li>
              <li>Role: ${userRole}</li>
            </ul>
            <br>
            <p>Explore our services now: <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" style="color: #FF5722;">Visit Website</a></p>
            <br>
            <p>Best Regards,<br>The Sharda Transport Team</p>
          </div>
        `
      }

      // Send email asynchronously (don't await to avoid blocking response)
      transporter.sendMail(mailOptions).catch(err => console.error('Welcome email failed:', err.message))

    } catch (emailSetupError) {
      console.error('Email setup failed:', emailSetupError.message)
    }

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      })
    } else {
      res.status(400).json({ message: 'Invalid user data' })
    }
  } catch (error) {
    console.error('Signup error:', error)

    // Duplicate key (e.g., email already exists)
    if (error?.code === 11000) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Mongoose validation error
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message).join(', ')
      return res.status(400).json({ message: messages })
    }

    // Mongoose connection error
    if (error.name === 'MongoServerError' || error.message?.includes('MongoServerError')) {
      return res.status(500).json({ message: 'Database connection error. Please check MongoDB connection.' })
    }

    // Network/connection errors
    if (error.message?.includes('connect') || error.message?.includes('ECONNREFUSED')) {
      return res.status(500).json({ message: 'Cannot connect to database. Make sure MongoDB is running.' })
    }

    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'An error occurred during signup'
    })
  }
})

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const normalizedEmail = normalizeEmail(email)

    // Validation
    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: 'Please provide email and password' })
    }

    // Check user and password
    const user = await User.findOne({ email: normalizedEmail })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ message: 'Not authorized' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production')
    const user = await User.findById(decoded.id).select('-password')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    })
  } catch (error) {
    res.status(401).json({ message: 'Not authorized', error: error.message })
  }
})

import nodemailer from 'nodemailer'

// Configure Nodemailer
// Nodemailer configuration moved inside the route to ensure env vars are loaded

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body
    const normalizedEmail = normalizeEmail(email)

    if (!normalizedEmail) {
      return res.status(400).json({ message: 'Please provide an email address' })
    }

    console.log(`Reset request for: ${normalizedEmail}`)

    const user = await User.findOne({ email: normalizedEmail })
    if (!user) {
      // Security: Do not reveal if user exists or not, but for UX maybe okay here
      return res.status(404).json({ message: 'User with this email does not exist' })
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' })

    // Construct reset link
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: normalizedEmail,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2>Password Reset Request</h2>
          <p>You requested a password reset. Click the link below to reset your password:</p>
          <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
          <p>This link is valid for 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `
    }

    try {
      // Configure Nodemailer (Lazy load to ensure env vars are ready)
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      })

      await transporter.sendMail(mailOptions)
      res.json({ message: 'Password reset link sent to your email' })
    } catch (emailError) {
      if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
        console.log('---------------------------------------------------')
        console.log('⚠️  Email sending failed. logging link for Dev Mode:')
        console.error('❌ Nodemailer Error:', emailError?.message || emailError)
        console.log(resetLink)
        console.log('---------------------------------------------------')
        return res.json({ message: 'Dev Mode: Email failed, but link is logged in server terminal' })
      }
      throw emailError
    }
  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(500).json({ message: 'Error sending email', error: error.message })
  }
})

// @route   POST /api/auth/reset-password
// @desc    Reset password
// @access  Public
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body

    if (!token || !password) {
      return res.status(400).json({ message: 'Please provide token and new password' })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')
      const user = await User.findById(decoded.id)

      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      // Update password
      user.password = password
      await user.save()

      res.json({ message: 'Password updated successfully' })
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(400).json({ message: 'Token has expired. Please request a new reset link.' })
      }
      return res.status(400).json({ message: 'Invalid token' })
    }
  } catch (error) {
    console.error('Reset password error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

export default router
