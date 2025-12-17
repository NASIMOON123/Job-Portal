import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import JobSeeker from '../models/JobSeeker.js';
import Recruiter from '../models/Recruiter.js';
import Admin from '../models/Admin.js';

export const registerUser = async (req, res) => {
  const { name, phone, role, email, password } = req.body;

  try {
    const normalizedRole = role.toLowerCase();

    
    const emailExists =
  (await JobSeeker.findOne({ email })) ||
  (await Recruiter.findOne({ email })) ||
  (await Admin.findOne({ email }));

if (emailExists) {
  return res.status(400).json({ message: 'User already exists' });
}
  const existingPhone =
      (await JobSeeker.findOne({ phone })) ||
      (await Recruiter.findOne({ phone })) ||
      (await Admin.findOne({ phone }));

    if (existingPhone) {
      return res.status(400).json({ message: "Phone number already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser;
    if (normalizedRole === 'jobseeker') {
      newUser = new JobSeeker({ name, phone, email, password: hashedPassword });
    } else if (normalizedRole === 'recruiter') {
      newUser = new Recruiter({ name, phone, email, password: hashedPassword });
    } else if (normalizedRole === 'admin') {
      newUser = new Admin({ name, phone, email, password: hashedPassword });
    }

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const normalizedRole = role.toLowerCase();

    let user;
    if (normalizedRole === 'jobseeker') user = await JobSeeker.findOne({ email });
    else if (normalizedRole === 'recruiter') user = await Recruiter.findOne({ email });
    else if (normalizedRole === 'admin') user = await Admin.findOne({ email });
    else return res.status(400).json({ message: 'Invalid role' });

    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    if (!user.active) {
      return res.status(403).json({ message: "Your account has been disabled. Contact admin." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user._id, role: normalizedRole },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: normalizedRole
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
