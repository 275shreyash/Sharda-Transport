import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'
import { createServer } from 'http'
import { Server } from 'socket.io'
import connectDB from './config/db.js'
import authRoutes from './routes/auth.js'
import bookingRoutes from './routes/bookings.js'
import userRoutes from './routes/users.js'
import carRoutes from './routes/cars.js'
import adminRoutes from './routes/admin.js'
import reviewsRoutes from './routes/reviews.js'
import seedAdmin from './config/seedAdmin.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

// Initialize Socket.io Server
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
  }
})

io.on('connection', (socket) => {
  console.log('User connected to socket:', socket.id)

  socket.on('join', (userId) => {
    socket.join(userId)
    console.log(`User ${userId} joined their personal room`)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

// Attach io to the req object so routes can broadcast
app.use((req, res, next) => {
  req.io = io
  next()
})

// Connect to MongoDB
connectDB().then(() => {
  seedAdmin()
})

// Middleware
// Allow the configured frontend origin in production, but reflect the request origin
// during local development so Vite/hosts using 127.0.0.1 or different ports still work.
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)

    // In development, allow any localhost origin
    if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
      return callback(null, true)
    }

    // In production, match specific origins
    if (origin === process.env.FRONTEND_URL) {
      return callback(null, true)
    }

    callback(new Error('Not allowed by CORS'))
  },
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/users', userRoutes)
app.use('/api/cars', carRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/reviews', reviewsRoutes)
app.use('/api/inquiries', (await import('./routes/inquiries.js')).default)

// Health check
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState
  const dbStatusText = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  }[dbStatus] || 'unknown'

  res.json({
    status: 'OK',
    message: 'Server is running',
    database: {
      status: dbStatusText,
      connected: dbStatus === 1
    }
  })
})

// Serve static frontend files (added per user snippet)
app.use(express.static(path.join(__dirname, "../frontend/dist")))

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"))
})

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📡 API available at http://localhost:${PORT}/api`)
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`)
})

