
import express from 'express';
import Interview from '../models/Interview.js';
import JobSeeker from '../models/JobSeeker.js';
import Job from '../models/Job.js';
import Recruiter from '../models/Recruiter.js';
import verifyToken from '../middleware/authMiddleware.js';
import sendEmail from '../utils/sendEmail.js';
import mongoose from 'mongoose';



const router = express.Router();

router.post('/schedule', verifyToken, async (req, res) => {
  try {
    const { jobSeekerId, jobId, date, platform, link, notes } = req.body;
    const recruiterId = req.user.userId;

    // ✅ Check if all fields are present
    if (!jobSeekerId || !jobId || !date || !platform || !link) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const interviewDate = new Date(date);
    const now = new Date();

    // ✅ Check if interview is scheduled at least 2 hours later
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    if (interviewDate < twoHoursLater) {
      return res.status(400).json({ message: 'Interview must be scheduled at least 2 hours in the future' });
    }

    // ✅ Check if an interview already exists for same job + jobSeeker
    const existingInterview = await Interview.findOne({ jobSeekerId, jobId });
    if (existingInterview) {
      return res.status(400).json({ message: 'Interview already scheduled for this candidate and job.' });
    }

    // ✅ Create and save interview
    const interview = new Interview({
      recruiterId,
      jobSeekerId,
      jobId,
      date: interviewDate,
      platform,
      link,
      notes,
    });
    await interview.save();

    // ✅ Get all related data
    const [jobSeeker, job, recruiter] = await Promise.all([
      JobSeeker.findById(jobSeekerId),
      Job.findById(jobId),
      Recruiter.findById(recruiterId),
    ]);

    if (!jobSeeker || !job || !recruiter) {
      return res.status(404).json({ message: 'Job, Recruiter, or JobSeeker not found' });
    }

    // ✅ Compose email
    const formattedDate = interviewDate.toLocaleString();
    const html = `
      <h2>Interview Scheduled</h2>
      <p>Dear ${jobSeeker.name},</p>
      <p>You have been scheduled for an interview for the job role: <strong>${job.title}</strong>.</p>
      <p><strong>Recruiter:</strong> ${recruiter.name} (${recruiter.email})</p>
      <ul>
        <li><strong>Date & Time:</strong> ${formattedDate}</li>
        <li><strong>Platform:</strong> ${platform}</li>
        <li><strong>Meeting Link:</strong> <a href="${link}">${link}</a></li>
        <li><strong>Notes:</strong> ${notes}</li>
      </ul>
      <p><em>Please join the interview at least 5 minutes before the scheduled time.</em></p>
      <p>Best of luck!<br/>– Job Portal Team</p>
    `;

    await sendEmail(jobSeeker.email, 'Interview Scheduled', html);

    res.status(201).json({
      message: 'Interview scheduled successfully and email sent',
      interview,
      readableDate: formattedDate, // for frontend display
    });
  } catch (error) {
    console.error('❌ Error scheduling interview:', error);
    res.status(500).json({ message: 'Failed to schedule interview' });
  }
});


// Get all interviews scheduled by recruiter
router.get('/scheduled', verifyToken, async (req, res) => {
  try {
    const recruiterId = req.user.userId;

    const interviews = await Interview.find({ recruiterId })
      .populate('jobId', 'title')
      .populate('jobSeekerId', 'name email');

    
    const formatted = interviews.map(int => ({
      _id: int._id, // ✅ REQUIRED
      jobTitle: int.jobId.title,
      jobSeekerName: int.jobSeekerId.name,
      jobSeekerEmail: int.jobSeekerId.email,
      date: int.date,
      platform: int.platform,
      link: int.link,
      notes: int.notes
    }));
    

    res.json(formatted);
  } catch (error) {
    console.error('Error fetching interviews:', error);
    res.status(500).json({ message: 'Failed to fetch scheduled interviews' });
  }
});



// PUT /api/interviews/:id
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const interviewId = req.params.id;
    const recruiterId = req.user.userId;
    const { date, platform, link, notes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(interviewId)) {
      return res.status(400).json({ message: 'Invalid interview ID' });
    }

    // Fetch existing interview with details
    const interview = await Interview.findById(interviewId)
      .populate('jobSeekerId', 'name email')
      .populate('jobId', 'title');

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (interview.recruiterId.toString() !== recruiterId) {
      return res.status(403).json({ message: 'Unauthorized to edit this interview' });
    }

    // 📌 Save previous data before update
    const prevDate = interview.date;
    const prevPlatform = interview.platform;
    const prevLink = interview.link;
    const prevNotes = interview.notes;

    // ✅ Update allowed fields
    if (date) interview.date = new Date(date);
    if (platform) interview.platform = platform;
    if (link !== undefined) interview.link = link;
    if (notes !== undefined) interview.notes = notes;

    await interview.save();

    // ✅ Compose email with previous vs updated details
    const oldDate = new Date(prevDate).toLocaleString();
    const newDate = new Date(interview.date).toLocaleString();

    const html = `
      <h2>Interview Rescheduled</h2>
      <p>Dear ${interview.jobSeekerId.name},</p>
      <p>Your interview for the job role <strong>${interview.jobId.title}</strong> has been updated. Please find the changes below:</p>
      
      <table border="1" cellpadding="8" cellspacing="0">
        <thead>
          <tr>
            <th>Field</th>
            <th>Previous</th>
            <th>Updated</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Date & Time</td>
            <td>${oldDate}</td>
            <td>${newDate}</td>
          </tr>
          <tr>
            <td>Platform</td>
            <td>${prevPlatform || 'N/A'}</td>
            <td>${interview.platform || 'N/A'}</td>
          </tr>
          <tr>
            <td>Meeting Link</td>
            <td>${prevLink || 'N/A'}</td>
            <td>${interview.link || 'N/A'}</td>
          </tr>
          <tr>
            <td>Notes</td>
            <td>${prevNotes || 'N/A'}</td>
            <td>${interview.notes || 'N/A'}</td>
          </tr>
        </tbody>
      </table>

      <p>Make sure you’re available at the new scheduled time.</p>
      <p>– Job Portal Team</p>
    `;

    await sendEmail(interview.jobSeekerId.email, 'Interview Updated', html);

    res.json({ message: 'Interview updated and notification sent', interview });
  } catch (error) {
    console.error('Error updating interview:', error);
    res.status(500).json({ message: 'Failed to update interview' });
  }
});


// DELETE /api/interviews/:id
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const interviewId = req.params.id;
    const recruiterId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(interviewId)) {
      return res.status(400).json({ message: 'Invalid interview ID' });
    }

    // 🔄 Populate job & job seeker before deletion
    const interview = await Interview.findById(interviewId)
      .populate('jobSeekerId', 'name email')
      .populate('jobId', 'title');

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (interview.recruiterId.toString() !== recruiterId) {
      return res.status(403).json({ message: 'Unauthorized to delete this interview' });
    }

    // 🗑️ Delete the interview
    await Interview.findByIdAndDelete(interviewId);

    // ✉️ Send email to job seeker about cancellation
    const formattedDate = new Date(interview.date).toLocaleString();
    const html = `
      <h2>Interview Cancelled</h2>
      <p>Dear ${interview.jobSeekerId.name},</p>
      <p>We regret to inform you that your interview for the job role <strong>${interview.jobId.title}</strong> scheduled on <strong>${formattedDate}</strong> has been cancelled by the recruiter.</p>
      <p>If you have any questions, please reach out to the recruiter directly.</p>
      <p>Regards,<br/>Job Portal Team</p>
    `;

    await sendEmail(interview.jobSeekerId.email, 'Interview Cancelled', html);

    res.json({ message: 'Interview deleted and notification email sent' });
  } catch (error) {
    console.error('Error deleting interview:', error);
    res.status(500).json({ message: 'Failed to delete interview' });
  }
});




export default router;
