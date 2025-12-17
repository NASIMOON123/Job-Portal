import express from 'express';
import verifyToken from '../middleware/authMiddleware.js';
import Application from '../models/Application.js';  // adjust path as needed
import upload from '../middleware/upload.js';
import Recruiter from '../models/Recruiter.js';
import JobSeeker from '../models/JobSeeker.js';
import nodemailer from 'nodemailer';
import Job from '../models/Job.js'; // Create Job model
import stream from 'stream';
import PDFDocument from 'pdfkit';
import { generateOfferLetterPDF } from '../utils/generateOfferLetterPDF.js';
import bcrypt from 'bcryptjs';
import Interview from '../models/Interview.js';
const router = express.Router();
import mongoose from 'mongoose';

router.get('/profile', verifyToken, async (req, res) => {
    try {
      const userId = req.user.userId || req.user.id || req.user._id;
      if (!userId) return res.status(400).json({ message: 'Invalid token payload' });
      
      const recruiter = await Recruiter.findById(userId).select('-password');
      if (!recruiter) return res.status(404).json({ message: 'Recruiter not found' });
      res.json(recruiter);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  

  
  router.put('/profile', verifyToken, upload.single('profileImage'), async (req, res) => {
    try {
      const updateFields = {};
      const unsetFields = {};
  
      const fields = [
        'name',
        'phone',
        'companyName',
        'companyWebsite',
        'industry',
        'designation',
        'address',
        'bio',
        'linkedin',
        // add more fields if needed
      ];
  
      fields.forEach((field) => {
        const rawValue = req.body[field];
        if (typeof rawValue === 'string') {
          const val = rawValue.trim();
          if (val === '') {
            unsetFields[field] = "";
          } else {
            updateFields[field] = val;
          }
        }
      });
  
      // Handle profile image upload
      if (req.file) {
        updateFields.profileImage = `/uploads/${req.file.filename}`;
      }
  
      const updatedRecruiter = await Recruiter.findByIdAndUpdate(
        req.user.userId,
        {
          $set: updateFields,
          $unset: unsetFields,
        },
        { new: true, runValidators: true }
      );
  
      if (!updatedRecruiter) {
        return res.status(404).json({ message: 'Recruiter not found' });
      }
  
      res.json(updatedRecruiter);
    } catch (err) {
      console.error('Error in PUT /profile:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  


  router.post('/change-password', verifyToken, async (req, res) => {
    try {
      const userId = req.user.userId; // assuming your middleware sets req.user
      const { currentPassword, newPassword } = req.body;
  
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Please provide current and new passwords' });
      }
  
      const user = await Recruiter.findById(userId);
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
  
  
  router.post('/jobs', verifyToken, async (req, res) => {
    try {
      const { title, description, location, salary, skills, type, openings , applicationDeadline,
        experienceLevel,
        educationRequirements,
        workMode, } = req.body;
      const recruiterId = req.user.userId;
  
      const job = new Job({
        title,
        description,
        location,
        salary,
        skills: skills.split(',').map(skill => skill.trim()),
        type,
       
        applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : null,
      experienceLevel,
      educationRequirements,
      openings: Number(openings) || 1,
      workMode: workMode || undefined,
      recruiterId,
      });
    
      await job.save();
      res.status(201).json({ message: 'Job posted successfully', job });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error posting job' });
    }
  });
  

router.get('/jobs', verifyToken, async (req, res) => {
  try {
    console.log("Authenticated user:", req.user);
    const recruiterId = req.user.userId;

    const jobs = await Job.find({ recruiterId }).sort({ createdAt: -1 });

    const today = new Date();

    // Map jobs and add 'status' field dynamically
    const jobsWithStatus = jobs.map(job => {
      let status = 'Open';

      if (job.applicationDeadline && new Date(job.applicationDeadline) < today) {
        status = 'Expired';
      }

      return {
        ...job.toObject(), // convert mongoose doc to plain object
        status,
      };
    });

    res.status(200).json(jobsWithStatus);
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    res.status(500).json({ message: 'Failed to fetch jobs' });
  }
});

// DELETE /api/recruiter/jobs/:id - Delete job
router.delete('/jobs/:id', verifyToken, async (req, res) => {
  try {
    const jobId = req.params.id;
    const recruiterId = req.user.userId;

    const job = await Job.findOneAndDelete({ _id: jobId, recruiterId });

    if (!job) {
      return res.status(404).json({ message: 'Job not found or not authorized' });
    }

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ message: 'Failed to delete job' });
  }
});

// GET single job by ID
router.get('/jobs/:id', verifyToken, async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ message: 'Failed to fetch job' });
  }
});


router.put('/jobs/:id', verifyToken, async (req, res) => {
  try {
    const jobId = req.params.id;
    const recruiterId = req.user.userId;
    const updateData = req.body;

    // Find the job and check if it belongs to the logged-in recruiter
    const job = await Job.findOne({ _id: jobId, recruiterId });
    if (!job) return res.status(404).json({ message: 'Job not found or unauthorized' });

    // If skills present, convert string to array
    if (updateData.skills) {
      updateData.skills = updateData.skills.split(',').map(skill => skill.trim());
    }

    // Update the job
    const updatedJob = await Job.findByIdAndUpdate(jobId, updateData, { new: true, runValidators: true });

    res.json({ message: 'Job updated successfully', job: updatedJob });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating job' });
  }
});


router.get('/applications', verifyToken, async (req, res) => {
  try {
    const recruiterId = req.user.userId;
    if (!recruiterId) {
      return res.status(401).json({ message: 'Unauthorized: recruiter ID missing' });
    }

    const jobs = await Job.find({ recruiterId }).select('_id title');
    if (!jobs.length) return res.json({ applications: [] });

    const jobIds = jobs.map(job => job._id);

    const jobSeekers = await JobSeeker.find({
      'applications.jobId': { $in: jobIds }
    }).select('name email phone applications');

    const applicationsList = [];

    for (const js of jobSeekers) {
      for (const app of js.applications) {
        // safer check for matching ObjectIds:
        if (jobIds.some(id => id.toString() === app.jobId.toString())) {
          const job = jobs.find(j => j._id.toString() === app.jobId.toString());
          applicationsList.push({
            applicantId: js._id,
            applicantName: js.name,
            applicantEmail: js.email,
            applicantPhone: js.phone,
            jobId: app.jobId,
            jobTitle: job ? job.title : '',
            coverLetterFile: app.coverLetterFile,
            resumeFile: app.resumeFile,
            additionalDetails: app.additionalDetails,
            linkedin: app.linkedin,
            github: app.github,
            programmingProfiles: app.programmingProfiles,
            skills: app.skills,
            graduation: app.graduation,
            yearOfPassing: app.yearOfPassing,
            status: app.status,
            appliedAt: app.appliedAt,
          });
        }
      }
    }

    res.json({ applications: applicationsList });

  } catch (err) {
    console.error('Error fetching applications:', err);
    res.status(500).json({ message: 'Server error' });
  }
});




router.post('/applications/:applicantId/:jobId/status-and-offer', verifyToken, async (req, res) => {
  const { applicantId, jobId } = req.params;
  const { status } = req.body;

  console.log('Route hit with params:', { applicantId, jobId }, 'and body:', req.body);

  try {
    // Validate status
    if (!['Accepted', 'Rejected'].includes(status)) {
      console.log('Invalid status received:', status);
      return res.status(400).json({ message: 'Invalid status' });
    }
    console.log('Status is valid:', status);

    // Fetch related documents
    const applicant = await JobSeeker.findById(applicantId);
    console.log('Applicant fetched:', applicant ? applicant.name : 'NOT FOUND');

    const job = await Job.findById(jobId);
    console.log('Job fetched:', job ? job.title : 'NOT FOUND');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const recruiter = await Recruiter.findById(job.recruiterId);
    console.log('Recruiter fetched:', recruiter ? recruiter.name : 'NOT FOUND');
    if (!applicant || !recruiter) {
      return res.status(404).json({ message: 'Applicant or recruiter not found' });
    }

    // Update application status in Application collection
    console.log('Looking for application with jobSeekerId and jobId');
    const application = await Application.findOneAndUpdate(
      { jobSeekerId: applicantId, jobId },
      { status },
      { new: true }
    );

    if (!application) {
      console.log('Application NOT found for jobSeekerId and jobId:', { applicantId, jobId });
      return res.status(404).json({ message: 'Application not found' });
    }
    console.log('Application found and updated:', application);

    // Update embedded application status inside JobSeeker document
    const embeddedApp = applicant.applications.find(app => app.jobId.toString() === jobId);
    if (embeddedApp) {
      embeddedApp.status = status;
      await applicant.save();
      console.log('Embedded application status updated inside JobSeeker document');
    } else {
      console.log('Embedded application NOT found in JobSeeker document');
    }

    // Prepare email content
    const subject = `Application ${status} for ${job.title}`;
    const bodyText =
      status === 'Accepted'
        ? `Dear ${applicant.name},\n\nCongratulations! Your application for "${job.title}" at ${recruiter.company} has been accepted.\nPlease find your offer letter attached.\n\nBest regards,\n${recruiter.name}`
        : `Dear ${applicant.name},\n\nThank you for applying to "${job.title}" at ${recruiter.company}. We regret to inform you that your application was not selected.\n\nWe wish you the best in your job search.\n\nSincerely,\n${recruiter.name}`;

    // Setup email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // your email
        pass: process.env.GMAIL_APP_PASSWORD, // app password
      },
    });

    const mailOptions = {
      from: `"${recruiter.name}" <${recruiter.email}>`,
      to: applicant.email,
      subject,
      text: bodyText,
    };

    // Attach offer letter if accepted
    if (status === 'Accepted') {
      console.log('Generating offer letter PDF...');
      const pdfBuffer = await generateOfferLetterPDF(applicant.name, job.title, recruiter.company, recruiter.name);
      mailOptions.attachments = [
        {
          filename: 'OfferLetter.pdf',
          content: pdfBuffer,
        },
      ];
      console.log('PDF offer letter generated and attached');
    }

    // Send email
    console.log('Sending email...');
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');

    res.status(200).json({ message: 'Status updated and email sent (offer letter attached if accepted).' });
  } catch (err) {
    console.error('Error in status update + email:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



router.get('/search-jobseekers', verifyToken, async (req, res) => {
  try {
    const { name, skills, education, yearOfPassing } = req.query;

    const query = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    if (skills) {
      const skillArray = skills.split(',').map((skill) => skill.trim());
      query.skills = { $in: skillArray };
    }

    if (req.query.education) {
      query.education = { $regex: req.query.education, $options: 'i' };
    }
    
    if (yearOfPassing) {
      query.yearOfPassing = yearOfPassing;
    }

    const jobSeekers = await JobSeeker.find(query).select('-password');
    res.json(jobSeekers);
  } catch (err) {
    console.error('Error searching job seekers:', err);
    res.status(500).json({ message: 'Server error' });
  }
});




router.post('/send-job-email', verifyToken, async (req, res) => {
  try {
    const { jobSeekerId, jobId } = req.body;

    const jobSeeker = await JobSeeker.findById(jobSeekerId);
    const job = await Job.findById(jobId);
    const recruiter = await Recruiter.findById(req.user.userId);

    if (!jobSeeker || !job || !recruiter) {
      return res.status(404).json({ message: 'Missing data for email' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // stored in .env
        pass: process.env.GMAIL_APP_PASSWORD, // app password in .env
      },
    });

    const mailOptions = {
      from: `"${recruiter.name}" <${process.env.GMAIL_USER}>`,
      to: jobSeeker.email,
      subject: `Opportunity: ${job.title} at ${recruiter.company}`,
      html: `
        <p>Hi ${jobSeeker.name},</p>
        <p>We found your profile on our Job Seeker Portal and were impressed by your skills.</p>
        <p>We believe you might be a great fit for the <strong>${job.title}</strong> role at <strong>${recruiter.company}</strong>.</p>
        <p>If you’re interested, please reply or apply directly.</p>
        <p>Best regards,<br>${recruiter.name}<br>${recruiter.company}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
});




// GET /api/recruiter/analytics/:recruiterId
router.get('/analytics/:recruiterId', async (req, res) => {
  try {
    const { recruiterId } = req.params;

    // Total applications for this recruiter
    const totalApplications = await Application.countDocuments({ recruiterId });

    // Applications by status
    const applicationStatus = {
      pending: await Application.countDocuments({ recruiterId, status: 'Pending' }),
      accepted: await Application.countDocuments({ recruiterId, status: 'Accepted' }),
      rejected: await Application.countDocuments({ recruiterId, status: 'Rejected' }),
    };

    // Top 5 jobs with most applicants
    const jobsByApplicants = await Application.aggregate([
      { $match: { recruiterId: new mongoose.Types.ObjectId(recruiterId) } },
      { $group: { _id: '$jobId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'jobs',
          localField: '_id',
          foreignField: '_id',
          as: 'job',
        },
      },
      { $unwind: '$job' },
      { $project: { title: '$job.title', count: 1 } },
    ]);

    // Total jobs posted by recruiter
    const jobsPosted = await Job.countDocuments({ recruiterId });

    // Total scheduled interviews for this recruiter
    const scheduledInterviews = await Interview.countDocuments({ recruiterId });

    // Total job seekers in the system
    const totalUsers = await JobSeeker.countDocuments();
    
       // Total recruiters in the system
    const totalRecruiters = await Recruiter.countDocuments();

    // Total jobs posted by all recruiters
    const totalJobsPosted = await Job.countDocuments();

    res.json({
      totalApplications,
      applicationStatus,
      jobsByApplicants,
      jobsPosted,
      scheduledInterviews,
      totalUsers,
      totalRecruiters,
      totalJobsPosted,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch recruiter analytics', error: err.message });
  }
});

export default router;
