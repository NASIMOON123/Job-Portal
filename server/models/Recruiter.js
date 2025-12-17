import mongoose from 'mongoose';

const recruiterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, match: /^\d{10}$/ },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  companyName: { type: String },
  // add recruiter specific fields here
  companyWebsite: String,
  industry: String,
  designation: String,
  address: String,
  bio: String,
  linkedin: String,
  resetOtp: Number,
otpExpiry: Date,

  active: { type: Boolean, default: true },
  profileImage: String // store filename or full URL
  
}, { timestamps: true });



const Recruiter = mongoose.model('Recruiter', recruiterSchema);
export default Recruiter;
