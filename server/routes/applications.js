
import express from 'express';
import Application from '../models/Application.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/jobseekers', verifyToken, async (req, res) => {
  try {
    const recruiterId = req.user.userId;

    const applications = await Application.find({ recruiterId }).populate('jobSeekerId');

    // Get unique job seekers
    const uniqueJobSeekersMap = new Map();
    applications.forEach(app => {
      if (app.jobSeekerId && app.jobSeekerId._id) {
        uniqueJobSeekersMap.set(app.jobSeekerId._id.toString(), app.jobSeekerId);
      }
    });

    const uniqueJobSeekers = Array.from(uniqueJobSeekersMap.values());

    res.json({ jobSeekers: uniqueJobSeekers });
  } catch (err) {
    console.error('Error fetching job seekers:', err);
    res.status(500).json({ message: 'Failed to fetch job seekers' });
  }
});

export default router;
