import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter', required: true },
  jobSeekerId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobSeeker', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  date: { type: Date, required: true },
  platform: { type: String, required: true },
  link: { type: String },
  notes: { type: String },
}, { timestamps: true });

export default mongoose.model('Interview', interviewSchema);
