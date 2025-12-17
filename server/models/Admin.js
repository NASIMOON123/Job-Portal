import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, match: /^\d{10}$/ },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
  resetOtp: Number,
otpExpiry: Date,
  isSuperAdmin: { type: Boolean, default: false }

}, { timestamps: true });

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
