
import React, { useState, useEffect } from 'react';
import './css/ApplyModal.css';
import API from '../../api/api';
const ApplyModal = ({ jobId, isOpen, onClose, jobTitle, applyJob, setAppliedJobIds ,  onApplySuccess }) => {
  const [userInfo, setUserInfo] = useState({ name: '', email: '', phone: '' });
  const [coverLetterFile, setCoverLetterFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [programmingProfiles, setProgrammingProfiles] = useState('');
  const [skills, setSkills] = useState('');
  const [graduation, setGraduation] = useState('');
  const [yearOfPassing, setYearOfPassing] = useState(''); // Added separate state for year of passing
  const [confirmChecked, setConfirmChecked] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        // const res = await API.get('/api/jobseeker/profile');
        const res = await API.get('/api/jobseeker/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // const data = await res.json();
        const data = res.data;
        setUserInfo({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
        });
      } catch {
        setError('Failed to fetch user info');
      }
    };
    fetchUserInfo();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e, setter, allowedTypes, fileDesc) => {
    const file = e.target.files[0];
    if (!file) {
      setter(null);
      return;
    }
    if (!allowedTypes.includes(file.type)) {
      setError(`Only ${fileDesc} files are allowed`);
      setter(null);
      return;
    }
    setError('');
    setter(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!coverLetterFile) {
      setError('Cover letter file is required');
      return;
    }
    if (!resumeFile) {
      setError('Resume file is required');
      return;
    }
    if (!confirmChecked) {
      alert('Please confirm the information provided is correct.');
      return;
    }
    setError('');
    setIsSubmitting(true);

    try {
     
      const token = localStorage.getItem('token');
      const formData = new FormData();

      formData.append('jobId', jobId);
      formData.append('coverLetter', coverLetterFile);
      formData.append('resume', resumeFile);
      formData.append('customMessage', customMessage);
      formData.append('linkedin', linkedin);
      formData.append('github', github);
      formData.append('programmingProfiles', programmingProfiles);
      formData.append('skills', skills);
      formData.append('graduation', graduation);
      formData.append('yearOfPassing', yearOfPassing);

      // const response = await fetch('http://localhost:5000/api/jobseeker/apply', {
      //   method: 'POST',
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: formData,
      // });
      const response = await API.post('/api/jobseeker/apply', formData);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit application');
      }

      setSuccessMsg('Application submitted successfully!');
      setCoverLetterFile(null);
      setResumeFile(null);
      setCustomMessage('');
      setLinkedin('');
      setGithub('');
      setProgrammingProfiles('');
      setSkills('');
      setGraduation('');
      setYearOfPassing('');
      setConfirmChecked(false);

   
if (typeof onApplySuccess === 'function') {
  onApplySuccess();
}

      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 2000);
    }      catch (err) {
      const msg = err.message;

      if (msg.toLowerCase().includes('already applied')) {
        setError('You already applied to this job.');

        // ✅ Trigger parent update
        if (typeof onApplySuccess === 'function') {
          onApplySuccess(); // This updates appliedJobIds in ViewJobs
        }

        // Optional: Close modal after delay
        setTimeout(() => {
          setError('');
          onClose();
        }, 2000);
      } else {
        setError(err.message || 'Failed to submit application');
      }
    } finally {
      setIsSubmitting(false);
    }

  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
      <button
  className="modal-close-button"
  onClick={onClose}
  aria-label="Close modal"
  type="button"
>
  &times;
</button>

        <h2>Apply for: <span>{jobTitle}</span></h2>

        {error && <p className="error-message">{error}</p>}
        {successMsg && <p className="success-message">{successMsg}</p>}

        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input type="text" value={userInfo.name} readOnly style={{ cursor: 'not-allowed' }} />
          </label>

          <label>
            Email:
            <input type="email" value={userInfo.email} readOnly style={{ cursor: 'not-allowed' }} />
          </label>

          <label>
            Phone:
            <input type="text" value={userInfo.phone} readOnly style={{ cursor: 'not-allowed' }} />
          </label>
          <label>
            Upload Cover Letter (PDF, JPG, PNG, DOC, DOCX) <span className="required">*</span>:
            <input
              type="file"
              accept=".pdf,image/jpeg,image/png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(e) =>
                handleFileChange(
                  e,
                  setCoverLetterFile,
                  [
                    'application/pdf',
                    'image/jpeg',
                    'image/png',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                  ],
                  'PDF, JPG, PNG, DOC or DOCX'
                )
              }
              disabled={isSubmitting}
              required
            />
          </label>

          <label>
            Upload Resume (PDF, DOC, DOCX, PNG, JPEG) <span className="required">*</span>:
            <input
              type="file"
              accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png"
              onChange={(e) =>
                handleFileChange(
                  e,
                  setResumeFile,
                  [
                    'application/pdf',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'image/jpeg',
                    'image/png',
                  ],
                  'PDF, DOC, DOCX, PNG or JPEG'
                )
              }
              disabled={isSubmitting}
              required
            />
          </label>

          <label>
            Why are you interested in this job? (optional)
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Mention why this job excites you..."
            />
          </label>

          <label>
            LinkedIn or GitHub Profile (comma separated):
            <input
              type="text"
              value={linkedin}
              onChange={e => setLinkedin(e.target.value)}
              placeholder="https://linkedin.com/in/yourprofile,https://github.com/yourusername"  required
            />
          </label>

          <label>
            Other Programming Profiles (HackerRank, LeetCode, etc.) (comma separated):
            <input
              type="text"
              value={programmingProfiles}
              onChange={e => setProgrammingProfiles(e.target.value)}
              placeholder="https://www.hackerrank.com/yourprofile, https://leetcode.com/yourprofile"
            />
          </label>

          <label>
            Skills (comma separated):
            <input
              type="text"
              value={skills}
              onChange={e => setSkills(e.target.value)}
              placeholder="JavaScript, Python, React, Node.js"  required
            />
          </label>

          <label>
            Graduation / Degree:
            <input
              type="text"
              value={graduation}
              onChange={e => setGraduation(e.target.value)}
              placeholder="B.Tech in Computer Science"   required
            />
          </label>

          <label>
            Year of Passing:
            <select
              value={yearOfPassing}
              onChange={e => setYearOfPassing(e.target.value)}
            >
              <option value="" disabled>
                Select Year
              </option>
              {Array.from({ length: 30 }, (_, i) => 2000 + i).map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={confirmChecked}
              onChange={() => setConfirmChecked(!confirmChecked)}
              required
            />
            I confirm that the information provided is correct.
          </label>

          <div className="button-group">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>

            <button type="button" onClick={onClose} className="cancel-button" disabled={isSubmitting}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyModal;
