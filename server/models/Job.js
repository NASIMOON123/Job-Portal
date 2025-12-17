import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: String,
  description: String,
  location: String,
  salary: String,
  skills: [String],
  type: String,
  
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recruiter'
  },
  
  openings: { type: Number, default: 1 }, 
  applicationDeadline: Date,                // new
  experienceLevel: String,                   // new (Entry, Mid, Senior)
  educationRequirements: String,             // new
  workMode: { type: String, enum: ['Remote', 'On-site', 'Hybrid'] }, 
  status: {
    type: String,
    enum: ['Open', 'Closed', 'Expired'],
    default: 'Open',
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Job', jobSchema);
