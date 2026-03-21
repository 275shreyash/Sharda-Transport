import mongoose from 'mongoose'

const carSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, trim: true },
  image: { type: String, trim: true },
  features: [{ type: String, trim: true }],
  capacity: { type: String, trim: true },
  price: { type: String, trim: true },
  description: { type: String, trim: true },
  available: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
})

const Car = mongoose.model('Car', carSchema)

export default Car
