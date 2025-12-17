import mongoose from 'mongoose';

const jobSeekerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, match: /^\d{10}$/ },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: String,
  dob: Date,
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },

  profileImage: String, // store path or base64 string or URL

  education: String,
  // skills: String,
  skills: [String],
  experience: String,
  currentRole: String, // e.g., 'Student', 'Employee', etc.

  linkedin: String,
  github: String,
  portfolio: String,
  yearOfPassing: {
    type: Number,
  },
  
  languages: String,
  careerObjective: String,
  bio: String,
  resumeFile: String,
coverLetterFile: String,
portfolioFile: String,

  // add other job seeker specific fields here
  savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  active: { type: Boolean, default: true },
    resetOtp: Number,
otpExpiry: Date,
  applications: [
    {
      jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
      },
      coverLetterFile: String,
      resumeFile: String,
      additionalDetails: String,
      linkedin: String,
      github: String,
      programmingProfiles: String,
    

      skills: [String],
      graduation: String,
      yearOfPassing: String,
      status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending',
      },
      appliedAt: {
        type: Date,
        default: Date.now,
      },
      
    }
  ],
    
}, { timestamps: true });
const JobSeeker = mongoose.model('JobSeeker', jobSeekerSchema);
export default JobSeeker;
