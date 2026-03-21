import mongoose from 'mongoose'

const inquirySchema = new mongoose.Schema({
  service: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  phone: { type: String, trim: true },
  pickup: { type: String, trim: true },
  drop: { type: String, trim: true },
  date: { type: String, trim: true },
  message: { type: String, trim: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

const Inquiry = mongoose.model('Inquiry', inquirySchema)

export default Inquiry
