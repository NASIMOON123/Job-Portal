
  import express from 'express';
  import dotenv from 'dotenv';
  import cors from 'cors';
  import connectDB from './config/db.js';
  import authRoutes from './routes/authRoutes.js';
  import recruiterRoutes from './routes/recruiter.js';  // or recruiterProfile.js
  import jobseekerRoutes from './routes/jobseeker.js';
  import interviewRoutes from './routes/interview.js';
  import applicationRoutes from './routes/applications.js';
  import AdminRoutes from './routes/admin.js';

  import quizRoutes from './routes/quiz.js';




  import multer from 'multer';

  dotenv.config();
  const app = express();
  const upload = multer();

  connectDB();

  // app.use(cors());
  app.use(cors({
    origin: [
      "http://localhost:5173",
      "https://job-portal.vercel.app"
    ],
    credentials: true
  }));
  
  app.use(express.json());

  // Routes without file upload
  app.use('/api/auth', authRoutes);



  // Static folder for uploaded images
  app.use('/uploads', express.static('uploads'));
  app.use('/api/quiz', quizRoutes);
  app.use('/api/interviews', interviewRoutes);
  app.use('/api/recruiter', recruiterRoutes);
  app.use('/api/jobseeker', jobseekerRoutes);
  app.use('/api/admin', AdminRoutes);
  app.use('/api/applications', applicationRoutes);
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
