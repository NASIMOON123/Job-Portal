import express from 'express';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import JobSeeker from '../models/JobSeeker.js';
import Recruiter from '../models/Recruiter.js';
import Job from '../models/Job.js';
import verifyToken from "../middleware/authMiddleware.js"; 
import jwt from "jsonwebtoken"; 

import Application from '../models/Application.js'



const router = express.Router();

// REGISTER ADMIN
router.post('/register', async (req, res) => {
  const { name, phone, email, password, role } = req.body;

  try {
    // Check if admin exists
    const existingAdmin = await Admin.findOne({ email: email.trim() });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({
      name,
      phone,
      email: email.trim(),
      password: hashedPassword,
      role
    });

    await newAdmin.save();
    res.status(201).json({ message: 'Admin registered successfully', admin: newAdmin });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// LOGIN ADMIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const admin = await Admin.findOne({ email: email.trim() });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

    res.status(200).json({ message: 'Login successful', admin });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});




// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const totalAdmins = await Admin.countDocuments();
    const totalUsers = await JobSeeker.countDocuments();
    const totalRecruiters = await Recruiter.countDocuments();
    const totalJobPosts = await Job.countDocuments();

    res.json({ totalAdmins, totalUsers, totalRecruiters, totalJobPosts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});



// Get all admins
router.get('/all', async (req, res) => {
  try {
    const admins = await Admin.find({}, '-password'); // exclude passwords
    res.json(admins);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching admins' });
  }
});

// Update admin
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, password } = req.body;

  try {
    const admin = await Admin.findById(id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    admin.name = name || admin.name;
    admin.email = email || admin.email;
    admin.phone = phone || admin.phone;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(password, salt);
    }

    await admin.save();
    res.json({ message: 'Admin updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating admin' });
  }
});

// Delete admin
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const admin = await Admin.findByIdAndDelete(id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    res.json({ message: 'Admin deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error deleting admin' });
  }
});


/// Fetch all Job Seekers (no auth)
router.get("/jobseekers", async (req, res) => {
  try {
    const jobSeekers = await JobSeeker.find({}, "name email phone resume active"); 
    res.json(jobSeekers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching job seekers", error });
  }
});

// Fetch all Recruiters (no auth)
router.get("/recruiters", async (req, res) => {
  try {
    const recruiters = await Recruiter.find({}, "name email company phone active"); 
    res.json(recruiters);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recruiters", error });
  }
});

// Get single Job Seeker
// GET single job seeker (with populated appliedJobs)
router.get("/jobseekers/:id", async (req, res) => {
  try {
    const jobSeeker = await JobSeeker.findById(req.params.id)
      .populate({
        path: "appliedJobs",      // populate job IDs
        model: "Job",
        select: "title"           // only return job title
      });

    if (!jobSeeker) {
      return res.status(404).json({ message: "Job seeker not found" });
    }

    // pick only required fields
    const response = {
      name: jobSeeker.name,
      email: jobSeeker.email,
      phone: jobSeeker.phone,
      gender: jobSeeker.gender,
      currentRole: jobSeeker.currentRole,
      education: jobSeeker.education,
      appliedJobs: jobSeeker.appliedJobs.map(job => job.title) // replace IDs with titles
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching job seeker:", error);
    res.status(500).json({ message: "Server error" });
  }
});




// GET single recruiter profile with posted jobs
router.get("/recruiters/:id", async (req, res) => {
  try {
    const recruiter = await Recruiter.findById(req.params.id)
      .select(
        "name email phone designation companyName industry companyWebsite linkedin"
      )
      .lean(); // convert to plain object for adding postedJobs

    if (!recruiter) {
      return res.status(404).json({ message: "Recruiter not found" });
    }

    // Get posted jobs by this recruiter
    const postedJobs = await Job.find({ recruiterId: req.params.id }).select(
      "title"
    );

    // Add postedJobs to the recruiter object
    recruiter.postedJobs = postedJobs.map(job => job.title);

    res.json(recruiter);
  } catch (err) {
    console.error("Error fetching recruiter profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Disable or enable a JobSeeker
router.put("/jobseekers/:id/status", async (req, res) => {
  const { id } = req.params;
  const { active } = req.body;

  try {
    const user = await JobSeeker.findByIdAndUpdate(id, { active }, { new: true });
    if (!user) return res.status(404).json({ message: "Job Seeker not found" });
    res.json({ message: `User ${active ? "enabled" : "disabled"} successfully`, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Disable or enable a Recruiter
router.put("/recruiters/:id/status", async (req, res) => {
  const { id } = req.params;
  const { active } = req.body;

  try {
    const user = await Recruiter.findByIdAndUpdate(id, { active }, { new: true });
    if (!user) return res.status(404).json({ message: "Recruiter not found" });
    res.json({ message: `User ${active ? "enabled" : "disabled"} successfully`, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/jobs", async (req, res) => {
  try {
    const jobs = await Job.find().populate("recruiterId", "name email").lean();

    // Add applicant count to each job
    const jobsWithApplicants = await Promise.all(
      jobs.map(async (job) => {
        const applicantCount = await Application.countDocuments({ jobId: job._id });
        return { ...job, applicantCount }; // jobs are already plain objects because of .lean()
      })
    );

    res.json(jobsWithApplicants); // send only once
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ message: "Error fetching jobs", error: err });
  }
});





// ✅ Update a job
router.put("/jobs/:id", async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Error updating job", error: err });
  }
});

// ✅ Delete a job
router.delete("/jobs/:id", async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting job", error: err });
  }
});

// ✅ Enable/Disable job
router.patch("/jobs/:id/toggle", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    job.active = !job.active;  // flip status
    await job.save();

    res.json({ message: `Job ${job.active ? "enabled" : "disabled"}`, job });
  } catch (err) {
    res.status(500).json({ message: "Error toggling job status", error: err });
  }
});

// ✅ Get applicants for a specific job
router.get("/jobs/:jobId/applications", async (req, res) => {
  try {
    const applications = await Application.find({ jobId: req.params.jobId })
      .populate("jobSeekerId", "name email phone"); // populate applicant info
    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch applicants" });
  } 
});

router.get("/analytics", async (req, res) => {
  try {
    const totalApplications = await Application.countDocuments();
    const applicationStatus = {
      pending: await Application.countDocuments({ status: "Pending" }),
      accepted: await Application.countDocuments({ status: "Accepted" }),
      rejected: await Application.countDocuments({ status: "Rejected" }),
    };

    const jobsByApplicants = await Application.aggregate([
      { $group: { _id: "$jobId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "jobs",
          localField: "_id",
          foreignField: "_id",
          as: "job",
        },
      },
      { $unwind: "$job" },
      { $project: { title: "$job.title", count: 1 } },
    ]);

    const newUsers = await JobSeeker.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { date: "$_id", count: 1, _id: 0 } },
    ]);

    res.json({ totalApplications, applicationStatus, jobsByApplicants, newUsers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch analytics", error: err });
  }
});

export default router;
