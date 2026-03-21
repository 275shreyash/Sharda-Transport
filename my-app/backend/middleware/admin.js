import { protect } from './auth.js'

// Middleware to check if user is admin
export const adminOnly = async (req, res, next) => {
  // First check authentication
  await protect(req, res, () => {
    // Then check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Access denied. Admin privileges required.' 
      })
    }
    next()
  })
}

