
import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log('Decoded JWT payload:', decoded);
    req.user = decoded; // userId and role should be here
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is invalid or expired' });
  }
  
};

export default verifyToken;
