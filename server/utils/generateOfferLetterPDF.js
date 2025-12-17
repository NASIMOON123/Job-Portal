import PDFDocument from 'pdfkit';

/**
 * Generates an offer letter PDF with date and signature line.
 * @param {string} name - Job seeker's name
 * @param {string} jobTitle - Job title offered
 * @param {string} company - Company name
 * @param {string} recruiterName - Recruiter's name
 * @returns {Promise<Buffer>}
 */
export const generateOfferLetterPDF = (
  name = 'Candidate',
  jobTitle = 'Software Engineer',
  company = 'Your Company',
  recruiterName = 'HR Team'
) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const buffers = [];

      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      // Format current date
      const today = new Date();
      const formattedDate = today.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      // HEADER
      doc.fontSize(18).text('Offer Letter', { align: 'center', underline: true });
      doc.moveDown(1);
      doc.fontSize(12).text(`Date: ${formattedDate}`, { align: 'right' });
      doc.moveDown(2);

      // BODY
      doc.fontSize(12).text(`Dear ${name},`);
      doc.moveDown(1);
      doc.text(`We are pleased to offer you the position of "${jobTitle}" at ${company}.`);
      doc.moveDown(1);
      doc.text(`Please review the terms of this offer and confirm your acceptance.`);
      doc.moveDown(1);
      doc.text(`We believe you will be a valuable addition to our team.`);
      doc.moveDown(2);
      doc.text(`If you have any questions, please feel free to reach out.`);

      doc.moveDown(3);
      doc.text(`Sincerely,`);
      doc.text(`${recruiterName}`);
      doc.text(`${company}`);

      // Signature Line
      doc.moveDown(5);
      doc.text('_________________________', { continued: false });
      doc.text('Signature', { align: 'left' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
