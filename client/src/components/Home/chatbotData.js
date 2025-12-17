const chatbotData = [
  {
    question: "how do i apply for a job?",
    answer: "Go to 'All Jobs', click on 'Apply' for the job you want, and upload your resume if required."
  },
  {
    question: "how can i reset my password?",
    answer: "Click on 'Forgot Password' on the login page, enter your registered email, and follow the instructions."
  },
  {
    question: "how do i update my profile?",
    answer: "Go to your Job Seeker Dashboard and click on 'Update Profile' to edit your details."
  },
  {
    question: "can i save jobs for later?",
    answer: "Yes! Click on 'Save Job' on any job listing, and it will appear in your 'Saved Jobs' section."
  },
  {
    question: "how do i see the jobs i applied for?",
    answer: "Go to your dashboard and click on 'Applied Jobs' to view all your applications."
  },
  {
    question: "who can post jobs?",
    answer: "Only recruiters can post and manage job listings on the portal."
  },
  {
    question: "what is a resume upload?",
    answer: "A resume is a document that highlights your skills, education, and experience; it helps recruiters evaluate your profile."
  },
  {
    question: "how do i receive job alerts?",
    answer: "Enable job alerts in your dashboard settings. You will receive notifications for new jobs matching your preferences."
  },
  {
    question: "can i update my uploaded documents?",
    answer: "Yes! Go to your profile and re-upload your resume, cover letter, or portfolio anytime."
  },
  {
    question: "is my personal information safe?",
    answer: "Absolutely. All your data is securely stored and only visible to recruiters you apply to."
  },
   {
    question: "hello",
    answer: "Hi there! 👋 How can I help you with your job search today?"
  },
  {
    question: "hi",
    answer: "Hello! How can I assist you with jobs or your profile?"
  },
  {
    question: "hey",
    answer: "Hey! Looking for a job or need help with your account?"
  },
  {
    question: "good morning",
    answer: "Good morning! Ready to explore some job opportunities?"
  },
  {
    question: "good afternoon",
    answer: "Good afternoon! How can I help you with your job applications?"
  },
  {
    question: "good evening",
    answer: "Good evening! Want to check new job listings or your dashboard?"
  },

  // Job seeker queries
  {
    question: "how do i apply for a job?",
    answer: "Go to 'All Jobs', click on 'Apply' for the job you want, and upload your resume if required."
  },
  {
    question: "how can i reset my password?",
    answer: "Click on 'Forgot Password' on the login page, enter your registered email, and follow the instructions."
  },
  {
    question: "how do i update my profile?",
    answer: "Go to your Job Seeker Dashboard and click on 'Update Profile' to edit your details."
  },
  {
    question: "can i save jobs for later?",
    answer: "Yes! Click on 'Save Job' on any job listing, and it will appear in your 'Saved Jobs' section."
  },
  {
    question: "how do i see the jobs i applied for?",
    answer: "Go to your dashboard and click on 'Applied Jobs' to view all your applications."
  },
  {
    question: "who can post jobs?",
    answer: "Only recruiters can post and manage job listings on the portal."
  },
  {
    question: "what is a resume upload?",
    answer: "A resume is a document that highlights your skills, education, and experience; it helps recruiters evaluate your profile."
  },
  {
    question: "how do i receive job alerts?",
    answer: "Enable job alerts in your dashboard settings. You will receive notifications for new jobs matching your preferences."
  },
  {
    question: "can i update my uploaded documents?",
    answer: "Yes! Go to your profile and re-upload your resume, cover letter, or portfolio anytime."
  },
  {
    question: "is my personal information safe?",
    answer: "Absolutely. All your data is securely stored and only visible to recruiters you apply to."
  },
  {
    question: "what is the job seeker portal?",
    answer: "It's a platform to find jobs, apply, save listings, and manage your applications all in one place."
  },
  {
    question: "how do i contact support?",
    answer: "You can reach out to support using the contact form on the website or email our support team."
  },
  {
    question: "how do i logout?",
    answer: "Click on the logout button in your dashboard to securely sign out."
  },
  {
    question: "what are saved jobs?",
    answer: "Saved jobs are the listings you bookmarked to apply later. You can find them in your dashboard."
  },
  {
    question: "how long does it take to get a response from recruiters?",
    answer: "Response times vary. You can check the status of your applications in 'Applied Jobs' on your dashboard."
  },
   {
    question: "hello",
    answer: "Hi there! 👋 How can I help you with your job search today?"
  },
  {
    question: "hi",
    answer: "Hello! How can I assist you with jobs or your profile?"
  },
  {
    question: "hey",
    answer: "Hey! Looking for a job or need help with your account?"
  },
  {
    question: "good morning",
    answer: "Good morning! Ready to explore some job opportunities?"
  },
  {
    question: "good afternoon",
    answer: "Good afternoon! How can I help you with your job applications?"
  },
  {
    question: "good evening",
    answer: "Good evening! Want to check new job listings or your dashboard?"
  },

  // Job seeker queries
  {
    question: "how do i apply for a job?",
    answer: "Go to 'All Jobs', click on 'Apply' for the job you want, and upload your resume if required."
  },
  {
    question: "how can i reset my password?",
    answer: "Click on 'Forgot Password' on the login page, enter your registered email, and follow the instructions."
  },
  {
    question: "how do i update my profile?",
    answer: "Go to your Job Seeker Dashboard and click on 'Update Profile' to edit your details."
  },
  {
    question: "can i save jobs for later?",
    answer: "Yes! Click on 'Save Job' on any job listing, and it will appear in your 'Saved Jobs' section."
  },
  {
    question: "how do i see the jobs i applied for?",
    answer: "Go to your dashboard and click on 'Applied Jobs' to view all your applications."
  },

  // Project explanation/tutorial queries
  {
    question: "give me a tutorial of this project",
    answer: "This is a Job Seeker Portal project. It allows job seekers to create profiles, search and apply for jobs, save listings, and track applications. Recruiters can post jobs, view applications, and manage hiring."
  },
  {
    question: "what does this project contain?",
    answer: "The project contains features like User Registration/Login, Role-based Dashboards for Job Seekers and Recruiters, Job Posting, Apply/Save Jobs, Resume Upload, Profile Management, and Notifications."
  },
  {
    question: "explain the job seeker dashboard",
    answer: "The Job Seeker Dashboard lets users view recommended jobs, applied jobs, saved jobs, update profile, upload resumes and other documents, and receive alerts for new jobs."
  },
  {
    question: "explain the recruiter dashboard",
    answer: "The Recruiter Dashboard allows posting jobs, managing job posts, viewing applications, searching job seekers, scheduling interviews, messaging, analytics, and profile settings."
  },
  {
    question: "how does role-based login work?",
    answer: "During login, the system identifies the user's role (Job Seeker, Recruiter, Admin) and redirects them to their respective dashboard with role-specific permissions."
  },
  {
    question: "what technologies are used in this project?",
    answer: "This project uses React for frontend, Node.js and Express for backend, MongoDB for database, and additional libraries like react-router-dom, bcryptjs, and nodemailer."
  },

  // Misc
  {
    question: "is my personal information safe?",
    answer: "Absolutely. All your data is securely stored and only visible to recruiters you apply to."
  },
  {
    question: "how do i contact support?",
    answer: "You can reach out to support using the contact form on the website or email our support team."
  },
    { question: "hello", answer: "Hi there! 👋 How can I help you with your job search today?" },
  { question: "hi", answer: "Hello! How can I assist you with jobs or your profile?" },
  { question: "hey", answer: "Hey! Looking for a job or need help with your account?" },
  { question: "good morning", answer: "Good morning! Ready to explore some job opportunities?" },
  { question: "good afternoon", answer: "Good afternoon! How can I help you with your job applications?" },
  { question: "good evening", answer: "Good evening! Want to check new job listings or your dashboard?" },

  // Job seeker queries
  { question: "how do i apply for a job?", answer: "Go to 'All Jobs', click 'Apply', and upload your resume if required." },
  { question: "can i save jobs for later?", answer: "Yes! Click 'Save Job' on any job listing; it will appear in 'Saved Jobs'." },
  { question: "how do i see applied jobs?", answer: "Go to your dashboard and click 'Applied Jobs' to view all applications." },
  { question: "how do i update my profile?", answer: "Click 'Update Profile' in your dashboard to edit your details." },
  { question: "how do i reset my password?", answer: "Click 'Forgot Password' on login, enter your registered email, and follow instructions." },
  { question: "can i update uploaded documents?", answer: "Yes! Re-upload your resume, cover letter, or portfolio anytime." },
  { question: "how do i receive job alerts?", answer: "Enable job alerts in dashboard settings to get notifications for new matching jobs." },
  { question: "is my personal information safe?", answer: "Absolutely. All your data is securely stored and only visible to recruiters you apply to." },
  { question: "what is a resume upload?", answer: "A resume highlights your skills, education, and experience; recruiters use it to evaluate your profile." },
  { question: "how do i delete my account?", answer: "Go to 'Profile Settings' and choose 'Delete Account'. This will remove all your data permanently." },

  // Recruiter queries
  { question: "who can post jobs?", answer: "Only recruiters can post and manage job listings on the portal." },
  { question: "how do i post a job?", answer: "Go to 'Post a Job' in the recruiter dashboard, fill in the details, and submit." },
  { question: "can i view applicants?", answer: "Yes! Click 'View Applications' under your job post to see all candidates." },
  { question: "how do i schedule interviews?", answer: "Use 'Schedule Interviews' in your dashboard to set dates and notify applicants." },
  { question: "can i save candidate profiles?", answer: "Yes! Use 'Save Profile' to shortlist candidates for future opportunities." },

  // Project explanation/tutorial queries
  { question: "give me a tutorial of this project", answer: "This is a Job Seeker Portal project that helps job seekers search, apply, and track jobs, and recruiters manage postings." },
  { question: "what does this project contain?", answer: "Features include Role-based Login, Dashboards, Job Posting, Apply/Save Jobs, Resume Upload, Profile Management, and Notifications." },
  { question: "explain the job seeker dashboard", answer: "It shows recommended jobs, saved jobs, applied jobs, and allows profile updates and document uploads." },
  { question: "explain the recruiter dashboard", answer: "It allows posting jobs, managing posts, viewing applications, searching job seekers, scheduling interviews, messaging, and analytics." },
  { question: "how does role-based login work?", answer: "The system identifies your role (Job Seeker, Recruiter, Admin) and redirects you to the corresponding dashboard." },
  { question: "what technologies are used?", answer: "React, Node.js, Express, MongoDB, react-router-dom, bcryptjs, and nodemailer." },
  { question: "how do i use the chatbot?", answer: "Click the chatbot icon at the bottom-right corner and type your question. You'll get answers instantly!" },
  { question: "how do i contact support?", answer: "Use the contact form on the website or email our support team for assistance." },
  { question: "can i use this project on mobile?", answer: "Yes, the frontend is responsive and works on mobile, tablet, and desktop screens." },
  { question: "can multiple users register?", answer: "Yes, Job Seekers, Recruiters, and Admins can create accounts with unique emails and phone numbers." },
  { question: "how is data stored?", answer: "All user, job, and application data is stored securely in MongoDB." },
  { question: "what is a cover letter upload?", answer: "A cover letter explains your interest and suitability for a job; it can be uploaded along with your resume." },
  { question: "can i filter jobs?", answer: "Yes! Use the search and filter options in 'All Jobs' to find relevant opportunities." },
  { question: "can recruiters see my documents?", answer: "Only recruiters for jobs you apply to can view your uploaded resume, cover letter, and portfolio." },
  { question: "how do I logout?", answer: "Click the 'Logout' button in your dashboard to safely end your session." },
  { question: "how do I change my email or phone?", answer: "Go to 'Update Profile' in your dashboard and edit your contact information." },
  { question: "how do I know if my application was accepted?", answer: "Check the 'Applied Jobs' section; each application shows its status: Pending, Accepted, or Rejected." },
  { question: "can I apply for multiple jobs at once?", answer: "Yes, but you must submit each application separately and upload required documents for each." },
  { question: "how do I delete a saved job?", answer: "Go to 'Saved Jobs' and click 'Remove' on the job you no longer want to save." },
  { question: "can I update my skills?", answer: "Yes! Go to 'Update Profile' and edit your skills list anytime." },
  { question: "what is the active status?", answer: "Active status indicates whether your profile is currently visible to recruiters." },
  { question: "how do I know new jobs are posted?", answer: "Enable job alerts to get notifications for newly posted jobs matching your preferences." },
  { question: "can I see recruiter profiles?", answer: "You can view recruiter profiles only if they are associated with jobs you applied to or saved." },
  { question: "what file formats are accepted for resume?", answer: "PDF is recommended. Some versions of DOC/DOCX may also work depending on the system." },
  { question: "can I track interview schedules?", answer: "Yes! Use the 'Schedule Interviews' section in your recruiter dashboard or application status to see upcoming interviews." },
];

export default chatbotData;
