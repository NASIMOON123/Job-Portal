


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/UploadDocuments.css';

const UploadDocuments = () => {
  // Files chosen locally for upload
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetterFile, setCoverLetterFile] = useState(null);
  const [portfolioFile, setPortfolioFile] = useState(null);

  // Preview URLs for files chosen locally (PDF only)
  const [resumePreview, setResumePreview] = useState(null);
  const [coverLetterPreview, setCoverLetterPreview] = useState(null);
  const [portfolioPreview, setPortfolioPreview] = useState(null);

  // Files uploaded previously, fetched from backend (URLs)
  const [existingDocs, setExistingDocs] = useState({
    resumeFile: null,
    coverLetterFile: null,
    portfolioFile: null,
  });

  const [message, setMessage] = useState('');

  // Base URL for backend file serving
  const baseUrl = 'http://localhost:5000/';

  // Fetch previously uploaded documents on mount
  useEffect(() => {
    const fetchUploadedDocs = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/jobseeker/documents', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExistingDocs(res.data);
      } catch (err) {
        console.error('Failed to fetch uploaded documents:', err);
      }
    };

    fetchUploadedDocs();
  }, []);

  // Handle local file selection and create preview if PDF
  const handleFileChange = (setterFile, setterPreview) => (e) => {
    const file = e.target.files[0];
    setterFile(file);

    if (file && file.type === 'application/pdf') {
      const fileURL = URL.createObjectURL(file);
      setterPreview(fileURL);
    } else {
      setterPreview(null);
    }
  };

  // Upload files to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resumeFile && !coverLetterFile && !portfolioFile) {
      setMessage('Please select at least one file to upload.');
      return;
    }

    const formData = new FormData();
    if (resumeFile) formData.append('resumeFile', resumeFile);
    if (coverLetterFile) formData.append('coverLetterFile', coverLetterFile);
    if (portfolioFile) formData.append('portfolioFile', portfolioFile);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/jobseeker/upload-documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(response.data.message);
      setExistingDocs(response.data.files);

      // Reset previews and chosen files after upload
      setResumeFile(null);
      setCoverLetterFile(null);
      setPortfolioFile(null);
      setResumePreview(null);
      setCoverLetterPreview(null);
      setPortfolioPreview(null);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to upload documents.');
    }
  };

  // Render inline PDF preview or file link
  const renderPreview = (fileUrl) => {
    if (!fileUrl) return null;
    const ext = fileUrl.split('.').pop().toLowerCase();

    if (ext === 'pdf') {
      return (
        <iframe
          src={`${baseUrl}${fileUrl}`}
          title="Document Preview"
          width="100%"
          height="300px"
          style={{ border: '1px solid #ccc', marginTop: '5px' }}
        />
      );
    }

    return (
      <p>
        <a href={`${baseUrl}${fileUrl}`} target="_blank" rel="noreferrer">
          View Document
        </a>
      </p>
    );
  };

  // Helper to show filename from a File object or URL string
  const getFileName = (fileOrUrl) => {
    if (!fileOrUrl) return '';
    if (typeof fileOrUrl === 'string') return fileOrUrl.split('/').pop();
    return fileOrUrl.name || '';
  };

  return (
    <div className="upload-container">
      <h2>Upload Your Documents</h2>
      <form onSubmit={handleSubmit}>
        {/* Resume */}
        <div>
          <label>Resume (PDF/DOC):</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange(setResumeFile, setResumePreview)}
          />
          {/* Show chosen file name */}
          {resumeFile && <p>Selected file: {getFileName(resumeFile)}</p>}
          {/* Show local preview for chosen file */}
          {resumePreview && (
            <div className="pdf-preview">
              <iframe src={resumePreview} title="Resume Preview" width="100%" height="200px" />
            </div>
          )}
          {/* Show previously uploaded file */}
          {!resumePreview && existingDocs.resumeFile && (
            <>
              <p>
                Previously uploaded:{" "}
                <a href={`${baseUrl}${existingDocs.resumeFile}`} target="_blank" rel="noreferrer">
                  {getFileName(existingDocs.resumeFile)}
                </a>
              </p>
              {renderPreview(existingDocs.resumeFile)}
            </>
          )}
        </div>

        {/* Cover Letter */}
        <div>
          <label>Cover Letter (PDF/DOC):</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange(setCoverLetterFile, setCoverLetterPreview)}
          />
          {coverLetterFile && <p>Selected file: {getFileName(coverLetterFile)}</p>}
          {coverLetterPreview && (
            <div className="pdf-preview">
              <iframe src={coverLetterPreview} title="Cover Letter Preview" width="100%" height="200px" />
            </div>
          )}
          {!coverLetterPreview && existingDocs.coverLetterFile && (
            <>
              <p>
                Previously uploaded:{" "}
                <a href={`${baseUrl}${existingDocs.coverLetterFile}`} target="_blank" rel="noreferrer">
                  {getFileName(existingDocs.coverLetterFile)}
                </a>
              </p>
              {renderPreview(existingDocs.coverLetterFile)}
            </>
          )}
        </div>

        {/* Portfolio */}
        <div>
          <label>Portfolio (PDF/DOC):</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange(setPortfolioFile, setPortfolioPreview)}
          />
          {portfolioFile && <p>Selected file: {getFileName(portfolioFile)}</p>}
          {portfolioPreview && (
            <div className="pdf-preview">
              <iframe src={portfolioPreview} title="Portfolio Preview" width="100%" height="200px" />
            </div>
          )}
          {!portfolioPreview && existingDocs.portfolioFile && (
            <>
              <p>
                Previously uploaded:{" "}
                <a href={`${baseUrl}${existingDocs.portfolioFile}`} target="_blank" rel="noreferrer">
                  {getFileName(existingDocs.portfolioFile)}
                </a>
              </p>
              {renderPreview(existingDocs.portfolioFile)}
            </>
          )}
        </div>

        <button type="submit">Upload</button>
      </form>

      {message && <p className="success-message">{message}</p>}
    </div>
  );
};

export default UploadDocuments;
