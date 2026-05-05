import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/sharda-transport'
    console.log('Attempting to connect to MongoDB...')
    console.log(`MongoDB URI: ${mongoURI.replace(/\/\/.*@/, '//***:***@')}`) // Hide credentials in logs
    
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    })
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
    console.log(`📊 Database: ${conn.connection.name}`)
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`)
    console.error('⚠️  Server will continue but database operations will fail.')
    console.error('💡 Make sure MongoDB is running or check your MONGODB_URI in .env file')
    console.error('💡 For MongoDB Atlas, check your connection string and IP whitelist')
    // Don't exit - let server start so user can see the error
  }
}

export default connectDB

