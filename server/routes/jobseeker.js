  import express from 'express';
  import Job from '../models/Job.js';  // import your Job model
  import verifyToken from '../middleware/authMiddleware.js';
  import JobSeeker from '../models/JobSeeker.js';
  import multer from 'multer';
  const router = express.Router();
  import generalUpload from '../middleware/UploadGeneral.js';
  import mongoose from 'mongoose';
  import Recruiter from '../models/Recruiter.js';



  import bcrypt from 'bcryptjs';
  import fs from 'fs';
import path from 'path';

const uploadDir = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


  // ✅ GET /api/jobseeker/profile
  router.get('/profile', verifyToken, async (req, res) => {
      try {
        const userId = req.user.userId;
        const jobSeeker = await JobSeeker.findById(userId).select('-password');
        if (!jobSeeker) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json(jobSeeker);
      } catch (err) {
        console.error('Error fetching user info:', err);
        res.status(500).json({ message: 'Server error' });
      }
    });
    


  router.get('/all-jobs', async (req, res) => {
    try {
      const today = new Date();

      const jobs = await Job.find()
        .populate('recruiterId', 'name email  companyName') 
        .sort({ createdAt: -1 });

      const jobsWithStatus = jobs.map(job => {
        let status = 'Open';
        if (job.applicationDeadline && new Date(job.applicationDeadline) < today) {
          status = 'Expired';
        }

        return {
          ...job.toObject(),
          status,
        };
      });

      res.status(200).json(jobsWithStatus);
    } catch (error) {
      console.error('Error fetching all jobs:', error);
      res.status(500).json({ message: 'Error fetching jobs' });
    }
  });




  // Save a job
  router.post('/save', verifyToken, async (req, res) => {
    try {
      const jobSeekerId = req.user.userId || req.user.id || req.user._id;

      const { jobId } = req.body;

      if (!jobId) return res.status(400).json({ message: 'Job ID is required' });

      const jobSeeker = await JobSeeker.findById(jobSeekerId);
      if (!jobSeeker) return res.status(404).json({ message: 'Job Seeker not found' });

      // Prevent duplicate saves
      if (jobSeeker.savedJobs.includes(jobId)) {
        return res.status(400).json({ message: 'Job already saved' });
      }

      jobSeeker.savedJobs.push(jobId);
      await jobSeeker.save();

      res.json({ message: 'Job saved successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });



  // Configure multer storage and file filter
  // const storage = multer.diskStorage({
  //   destination: function (req, file, cb) {
  //     cb(null, 'uploads/');  // folder to save files, make sure it exists
  //   },
  //   filename: function (req, file, cb) {
  //     // e.g. jobseekerId-timestamp-originalfilename
  //     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  //     cb(null, req.user.userId + '-' + uniqueSuffix + '-' + file.originalname);
  //   },
  // });
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) =>
      cb(null, `${req.user.userId}-${Date.now()}-${file.originalname}`)
  });

  // File filter to validate file types for cover letter and resume separately
  const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'coverLetter') {
      // Accept pdf, jpg, png for coverLetter
      if (
        file.mimetype === 'application/pdf' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'application/msword' ||
        file.mimetype ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      ) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type for cover letter. Only PDF, JPG, PNG ,DOC ,DOCX allowed.'));
      }
    } else if (file.fieldname === 'resume') {
      // Accept pdf, doc, docx for resume
      if (
        file.mimetype === 'application/pdf' ||
        file.mimetype === 'application/msword' ||
        file.mimetype ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png'
      ) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type for resume. Only PDF, DOC, DOCX ,PNG , JPEG allowed.'));
      }
    }
    else if (file.fieldname === 'profileImage') {
      // ✅ Allow profile image types
      if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg'
      ) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type for profile image. Only JPG and PNG allowed.'));
      }
    } else {
      cb(new Error('Unexpected field'));
    }
  };

  const upload = multer({ storage, fileFilter });


  import Application from '../models/Application.js'; // make sure this import exists in your route file

  router.post(
    '/apply',
    verifyToken,
    upload.fields([
      { name: 'coverLetter', maxCount: 1 },
      { name: 'resume', maxCount: 1 },
    ]),
    async (req, res) => {
      try {
        const jobSeekerId = req.user.userId;
        const { jobId, customMessage, linkedin, github, programmingProfiles, skills, graduation, yearOfPassing } = req.body;

        if (!jobId) return res.status(400).json({ message: 'Job ID is required' });

        const jobSeeker = await JobSeeker.findById(jobSeekerId);
        if (!jobSeeker) return res.status(404).json({ message: 'Job Seeker not found' });

        // Check if already applied
        const alreadyApplied = jobSeeker.applications.some(app => app.jobId.toString() === jobId);
        if (alreadyApplied) {
          return res.status(400).json({ message: 'You already applied to this job' });
        }

        const coverLetterFile = req.files?.['coverLetter'] ? req.files['coverLetter'][0].path : null;
        const resumeFile = req.files?.['resume'] ? req.files['resume'][0].path : null;
        

        const job = await Job.findById(jobId);
  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }
        // 1. Create and save Application document in Application collection
        const applicationDoc = new Application({
          jobSeekerId,
          jobId,
          recruiterId: job.recruiterId,  
          status: 'Pending',
          appliedAt: new Date(),
        });
        await applicationDoc.save();

        // 2. Push application object in embedded array inside JobSeeker document
        jobSeeker.applications.push({
          jobId,
          coverLetterFile,
          resumeFile,
          additionalDetails: customMessage,
          linkedin,
          github,
          programmingProfiles,
          skills,
          graduation,
          yearOfPassing,
          status: 'Pending',
          appliedAt: new Date(),
        });

        // Optional: keep appliedJobs in sync
        if (!jobSeeker.appliedJobs.includes(jobId)) {
          jobSeeker.appliedJobs.push(jobId);
        }

        await jobSeeker.save();

        res.json({ message: 'Applied to job successfully' });
      } catch (err) {
        console.error(err);
        if (err instanceof multer.MulterError) {
          return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: 'Server error' });
      }
    }
  );



  router.get('/saved', verifyToken, async (req, res) => {
    try {
      const jobSeekerId = req.user.userId || req.user.id || req.user._id;

      const jobSeeker = await JobSeeker.findById(jobSeekerId)
        .populate({
          path: 'savedJobs',
          populate: {
            path: 'recruiterId',
            select: 'name email'
          }
        });

      if (!jobSeeker) return res.status(404).json({ message: 'Job Seeker not found' });

      res.status(200).json(jobSeeker.savedJobs);
    } catch (err) {
      console.error('Error fetching saved jobs:', err);
      res.status(500).json({ message: 'Server Error' });
    }
  });

  // POST /api/jobseeker/unsave
  router.post('/unsave', verifyToken, async (req, res) => {
    try {
      const { jobId } = req.body;
      const jobSeekerId = req.user.userId || req.user.id || req.user._id;



      const jobSeeker = await JobSeeker.findById(jobSeekerId);
      if (!jobSeeker) return res.status(404).json({ message: 'Job Seeker not found' });

      jobSeeker.savedJobs = jobSeeker.savedJobs.filter(id => id.toString() !== jobId);
      await jobSeeker.save();

      res.status(200).json({ message: 'Job unsaved' });
    } catch (err) {
      console.error('Error unsaving job:', err);
      res.status(500).json({ message: 'Server Error' });
    }
  });




  router.get('/applied', verifyToken, async (req, res) => {
    try {
      const jobSeekerId = req.user.userId;
      const jobSeeker = await JobSeeker.findById(jobSeekerId).lean();

      if (!jobSeeker) {
        return res.status(404).json({ message: 'Job seeker not found' });
      }

      // console.log('Applications:', jobSeeker.applications);  // Step 1 - add this line

      const appliedJobsWithDetails = await Promise.all(
        (jobSeeker.applications || []).map(async (application) => {
          const job = await Job.findById(application.jobId)
            .populate('recruiterId', 'name email')
            .lean();

          if (!job) return null;

          const today = new Date();
          const status =
            job.applicationDeadline && new Date(job.applicationDeadline) < today
              ? 'Expired'
              : 'Open';

          return {
            job: { ...job, status },
            application: application,
          };
        })
      );

      res.json(appliedJobsWithDetails.filter(Boolean));
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.post(
    '/upload-documents',
    verifyToken,
    generalUpload.fields([
      { name: 'resumeFile', maxCount: 1 },
      { name: 'coverLetterFile', maxCount: 1 },
      { name: 'portfolioFile', maxCount: 1 }
    ]),
    async (req, res) => {
      try {
        const jobSeekerId = req.user.userId;

        const jobSeeker = await JobSeeker.findById(jobSeekerId);
        if (!jobSeeker) {
          return res.status(404).json({ message: 'Job seeker not found' });
        }

        // Extract file paths
        const resumePath = req.files['resumeFile']?.[0]?.path || null;
        const coverLetterPath = req.files['coverLetterFile']?.[0]?.path || null;
        const portfolioPath = req.files['portfolioFile']?.[0]?.path || null;

        // Save paths to the database
        if (resumePath) jobSeeker.resumeFile = resumePath;
        if (coverLetterPath) jobSeeker.coverLetterFile = coverLetterPath;
        if (portfolioPath) jobSeeker.portfolioFile = portfolioPath;

        await jobSeeker.save();

        res.json({
          message: 'Documents uploaded successfully',
          files: {
            resume: resumePath,
            coverLetter: coverLetterPath,
            portfolio: portfolioPath
          }
        });
      } catch (error) {
        console.error('Error uploading documents:', error);
        res.status(500).json({ message: 'Upload failed' });
      }
    }
  );



  router.put(
    '/update-profile',
    verifyToken,
    // upload.fields([{ name: 'profileImage', maxCount: 1 }]),
    upload.single("profileImage"),
    async (req, res) => {
      try {
        const userId = req.user.userId;

        // Build update object from body fields
        const updateFields = {
          address: req.body.address,
          dob: req.body.dob ? new Date(req.body.dob) : undefined,
          gender: req.body.gender,
          education: req.body.education,
          skills: req.body.skills,
          experience: req.body.experience,
          currentRole: req.body.currentRole,
          linkedin: req.body.linkedin,
          github: req.body.github,
          portfolio: req.body.portfolio,
          languages: req.body.languages,
          careerObjective: req.body.careerObjective,
          bio: req.body.bio,
          yearOfPassing: req.body.yearOfPassing ? parseInt(req.body.yearOfPassing) : undefined,
        };

        // ✅ Handle uploaded profile image
        // if (req.files && req.files['profileImage']) {
        //   updateFields.profileImage = req.files['profileImage'][0].path;
        // }
        if (req.file) {
          updateFields.profileImage = `/uploads/${req.file.filename}`;
        }
        
        

        // Remove undefined fields
        Object.keys(updateFields).forEach(
          (key) => updateFields[key] === undefined && delete updateFields[key]
        );

        const updatedUser = await JobSeeker.findByIdAndUpdate(userId, updateFields, {
          new: true,
        });

        if (!updatedUser) {
          return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Profile updated successfully', user: updatedUser });
      } catch (err) {
        console.error('Error updating profile:', err);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  );


  // ✅ POST /api/jobseeker/change-password
  router.post('/change-password', verifyToken, async (req, res) => {
    try {
      const userId = req.user.userId;
      const { newPassword } = req.body;

      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await JobSeeker.findByIdAndUpdate(userId, { password: hashedPassword });

      res.json({ message: 'Password changed successfully' });
    } catch (err) {
      console.error('Error changing password:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


  router.post('/change-password', verifyToken, async (req, res) => {
    try {
      const userId = req.user.userId; // assuming your middleware sets req.user
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Please provide current and new passwords' });
      }

      const user = await JobSeeker.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      // Check current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(401).json({ message: 'Current password is incorrect' });

      // Hash new password and update
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);

      await user.save();

      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });



  // ✅ GET /api/jobseeker/documents
  router.get('/documents', verifyToken, async (req, res) => {
    try {
      const jobSeekerId = req.user.userId;

      const jobSeeker = await JobSeeker.findById(jobSeekerId).select('resumeFile coverLetterFile portfolioFile');

      if (!jobSeeker) {
        return res.status(404).json({ message: 'Job seeker not found' });
      }

      res.json({
        resumeFile: jobSeeker.resumeFile || null,
        coverLetterFile: jobSeeker.coverLetterFile || null,
        portfolioFile: jobSeeker.portfolioFile || null,
      });
    } catch (err) {
      console.error('Error fetching uploaded documents:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });


  router.get('/recommended-jobs', verifyToken, async (req, res) => {
    try {
      const jobSeeker = await JobSeeker.findById(req.user.userId);
      if (!jobSeeker) {
        return res.status(404).json({ message: 'Job seeker not found' });
      }

      // Normalize skills into an array
      let seekerSkills = [];

  if (Array.isArray(jobSeeker.skills)) {
    seekerSkills = jobSeeker.skills.flatMap(s =>
      s.split(',').map(skill => skill.toLowerCase().trim())
    );
  } else if (typeof jobSeeker.skills === 'string') {
    seekerSkills = jobSeeker.skills.split(',').map(s => s.toLowerCase().trim());
  }


      if (seekerSkills.length === 0) {
        return res.status(400).json({ message: 'No skills found for job seeker' });
      }

      // Get only applied job IDs to exclude
      const appliedJobIds = jobSeeker.applications?.map(app => new mongoose.Types.ObjectId(app.jobId)) || [];

      // Build query: match skills and exclude applied jobs only
      const query = {
        status: 'Open',
        _id: { $nin: appliedJobIds },
        skills: { $in: seekerSkills },
      };

      // Fetch and return jobs
      const recommendedJobs = await Job.find(query)
        .limit(10)
        .populate('recruiterId', 'name email');

      res.json(recommendedJobs);
    } catch (err) {
      console.error('Error fetching recommended jobs:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });



router.get('/analytics', verifyToken, async (req, res) => {
  try {
    const jobSeekerId = req.user.userId;

    const totalJobs = await Job.countDocuments();
    const jobsApplied = await Application.countDocuments({ jobSeekerId });
    const pendingApplications = await Application.countDocuments({ jobSeekerId, status: 'Pending' });
    const acceptedApplications = await Application.countDocuments({ jobSeekerId, status: 'Accepted' });
    const rejectedApplications = await Application.countDocuments({ jobSeekerId, status: 'Rejected' });

    const totalJobSeekers = await JobSeeker.countDocuments();
    const totalRecruiters = await Recruiter.countDocuments();

    res.json({
      totalJobs,
      jobsApplied,
      pendingApplications,
      acceptedApplications,
      rejectedApplications,
      totalJobSeekers,
      totalRecruiters,
    });
  } catch (err) {
    console.error('Analytics route error:', err); // <--- log full error
    res.status(500).json({ message: 'Server error' });
  }
});



  export default router;