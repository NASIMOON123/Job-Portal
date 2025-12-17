

import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import JobSeeker from '../models/JobSeeker.js';
import Recruiter from '../models/Recruiter.js';
import Admin from '../models/Admin.js';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// Check if email already exists
router.post('/check-email', async (req, res) => {
  const { email, role } = req.body;
  try {
    let user;
    if (role === 'jobseeker') user = await JobSeeker.findOne({ email });
    else if (role === 'recruiter') user = await Recruiter.findOne({ email });
    else if (role === 'admin') user = await Admin.findOne({ email });
    else return res.status(400).json({ message: 'Invalid role' });

    if (user) return res.json({ exists: true });
    else return res.json({ exists: false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});





const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // your email
    pass: process.env.GMAIL_APP_PASSWORD, // app password
  },
});


// Temporary in-memory OTP store (optional, can be saved in DB instead)
const otpStore = {};

// ----------------- FORGOT PASSWORD -----------------
router.post('/forgot-password', async (req, res) => {
  try {
    const { emailOrPhone } = req.body;

    if (!emailOrPhone) {
      return res.status(400).json({ message: 'Email or phone is required' });
    }

     const user =
  (await JobSeeker.findOne({ 
    $or: [{ email: emailOrPhone }, { phone: emailOrPhone }] 
  })) ||
  (await Recruiter.findOne({ 
    $or: [{ email: emailOrPhone }, { phone: emailOrPhone }] 
  })) ||
  (await Admin.findOne({ 
    $or: [{ email: emailOrPhone }, { phone: emailOrPhone }] 
  }));

    if (!user) {
      return res.status(404).json({ message: 'No user found with this email/phone' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    user.resetOtp = otp;
    user.otpExpiry = expiry;
    await user.save();

    // Send OTP via email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Your OTP for Password Reset',
      text: `Your OTP is ${otp}. It expires in 10 minutes.`,
    });

    res.json({ success: true, message: `OTP sent successfully. Expires at ${new Date(expiry).toLocaleTimeString()}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ----------------- VERIFY OTP -----------------
// Verify OTP
// ----------------- VERIFY OTP -----------------
router.post("/verify-otp", async (req, res) => {
  try {
    const { emailOrPhone, otp } = req.body;

    // Find user by email or phone in all collections
    const user =
      (await JobSeeker.findOne({
        $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
      })) ||
      (await Recruiter.findOne({
        $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
      })) ||
      (await Admin.findOne({
        $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
      }));

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!user.resetOtp || !user.otpExpiry) {
      return res
        .status(400)
        .json({ success: false, message: "No OTP requested" });
    }

    if (Date.now() > user.otpExpiry) {
      return res
        .status(400)
        .json({ success: false, message: "OTP expired" });
    }

    if (String(otp) !== String(user.resetOtp)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid OTP" });
    }

    res.json({ success: true, message: "OTP verified, you can reset password" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});





// ----------------- RESET PASSWORD -----------------
router.post('/reset-password', async (req, res) => {
  try {
    const { emailOrPhone, newPassword } = req.body;

    const user =
      (await JobSeeker.findOne({ email: emailOrPhone })) ||
      (await Recruiter.findOne({ email: emailOrPhone })) ||
      (await Admin.findOne({ email: emailOrPhone }));

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Clear OTP
    user.resetOtp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});





export default router;
