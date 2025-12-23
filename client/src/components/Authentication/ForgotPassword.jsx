
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "../../api/api";
const ForgotPassword = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [timeLeft, setTimeLeft] = useState(0); // OTP timer
  const navigate = useNavigate();

  // Countdown timer for OTP
  useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSendOtp = async () => {
    try {
      const res = await API.post("/api/auth/forgot-password", { emailOrPhone });
      if (res.data.success) {
        toast.success("OTP sent successfully!");
        setStep(2);
        setTimeLeft(600); // 10 minutes countdown
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error sending OTP");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await API.post("/api/auth/verify-otp", { emailOrPhone, otp });
      if (res.data.success) {
        toast.success("OTP verified successfully!");
        setStep(3);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const res = await API.post("/api/auth/reset-password", {
        emailOrPhone,
        newPassword,
      });
      if (res.data.success) {
        toast.success("Password updated successfully!");
        navigate("/combined-login");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating password");
    }
  };

  // Format seconds → mm:ss
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
      }}
    >
      <button onClick={() => navigate("/combined-login")} style={{ marginBottom: "20px" }}>
        Back
      </button>


        {step === 1 && (
  <>
    <h2>Forgot Password</h2>
    <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '10px' }}>
      Enter your registered email or phone number. OTP will be sent to your registered email associated with this account.
    </p>
    <input
      type="text"
      placeholder="Enter email or phone"
      value={emailOrPhone}
      onChange={(e) => setEmailOrPhone(e.target.value)}
      style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
    />
    <button onClick={handleSendOtp}>Send OTP</button>
  </>
)}

      {step === 2 && (
        <>
          <h2>Enter OTP</h2>
          <input
            type="text"
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
          />
          <button onClick={handleVerifyOtp}>Verify OTP</button>
          {timeLeft > 0 && <p style={{ marginTop: "10px" }}>OTP expires in: {formatTime(timeLeft)}</p>}
          {timeLeft <= 0 && <p style={{ color: "red" }}>OTP expired. Please request again.</p>}
        </>
      )}

      {step === 3 && (
        <>
          <h2>Reset Password</h2>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
          />
          <button onClick={handleResetPassword}>Update Password</button>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;
