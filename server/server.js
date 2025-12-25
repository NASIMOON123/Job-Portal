
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
  import path from 'path';

  import fs from 'fs';

  const uploadDir = path.join(process.cwd(), 'uploads');
  
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  

  

  // import multer from 'multer';

  dotenv.config();
  const app = express();
  // const upload = multer();
  const allowedOrigins = [
    "http://localhost:5173",
    "https://job-portal.vercel.app",
    "https://job-portal-nine-tawny.vercel.app",
    "https://job-portal-project-virid.vercel.app",
  ];
  connectDB();

  // app.use(cors());
  // app.use(cors({
  //   origin: [
  //     "http://localhost:5173",
  //     "https://job-portal.vercel.app",
  //     "https://job-portal-nine-tawny.vercel.app",
  //     "https://job-portal-project-virid.vercel.app"
  //   ],
    
  //   credentials: true ,
  //   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  //   allowedHeaders: ["Content-Type", "Authorization"],
  // }));
  // app.options("*", cors());

  app.use(cors({
    origin: function (origin, callback) {
      // allow requests with no origin (Postman, mobile apps)
      if (!origin) return callback(null, true);
  
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }));
  
 
  
  
  app.use(express.json());

  // Routes without file upload
  app.use('/api/auth', authRoutes);



  // Static folder for uploaded images
  // app.use('/uploads', express.static('uploads'));

  app.use('/uploads', express.static(uploadDir));

  app.use('/api/quiz', quizRoutes);
  app.use('/api/interviews', interviewRoutes);
  app.use('/api/recruiter', recruiterRoutes);
  app.use('/api/jobseeker', jobseekerRoutes);
  app.use('/api/admin', AdminRoutes);
  app.use('/api/applications', applicationRoutes);
  const PORT = process.env.PORT || 5000;
  app.get("/", (req, res) => {
    res.send("Job Portal Backend is running 🚀");
  });
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
