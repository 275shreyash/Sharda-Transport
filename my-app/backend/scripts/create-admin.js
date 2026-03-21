import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../server/models/User.js'
import bcrypt from 'bcryptjs'

dotenv.config()

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sharda-transport'
    await mongoose.connect(mongoURI)
    console.log('✅ Connected to MongoDB')

    // Get admin details from command line arguments
    const args = process.argv.slice(2)
    const name = args[0] || 'Admin User'
    const email = args[1] || 'admin@shardatransport.com'
    const password = args[2] || 'admin123'

    if (!args[1] || !args[2]) {
      console.log('\n📝 Usage: node scripts/create-admin.js <name> <email> <password>')
      console.log('📝 Example: node scripts/create-admin.js "Admin Name" admin@example.com mypassword123\n')
    }

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: email.toLowerCase() })
    if (existingAdmin) {
      console.log(`❌ Admin with email ${email} already exists`)
      process.exit(1)
    }

    // Create admin user - hash password manually to avoid pre-save hook issues
    const hashedPassword = await bcrypt.hash(password, 12)
    
    // Use updateOne with upsert to bypass validation issues
    const admin = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'admin'
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    )

    console.log('\n✅ Admin user created successfully!')
    console.log(`   Name: ${admin.name}`)
    console.log(`   Email: ${admin.email}`)
    console.log(`   Role: ${admin.role}\n`)

    process.exit(0)
  } catch (error) {
    console.error('❌ Error creating admin:', error.message)
    process.exit(1)
  }
}

createAdmin()

