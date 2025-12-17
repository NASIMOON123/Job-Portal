
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/SkillAssessment.css';

const SkillAssessment = ({ user }) => {
  const [domain, setDomain] = useState('');
  const [level, setLevel] = useState('');
  const [step, setStep] = useState('select'); // select -> instructions -> quiz -> result
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [results, setResults] = useState([]);
  const [timeLeft, setTimeLeft] = useState(600); // 10 min = 600 sec

  // Fetch questions for selected domain and level
  const handleStart = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/quiz/${domain}/${level}`);
      setQuestions(response.data);
      setStep('quiz');
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  // Record user answer
  const handleAnswer = (index, selected) => {
    setAnswers({ ...answers, [index]: selected });
  };

  // Submit quiz
  const handleSubmit = async () => {
    if (!questions.length) return;

    // Prepare array for all questions, marking skipped ones as "Not Answered"
    const answersArray = questions.map((q, i) => ({
      questionId: q._id,
      selectedAnswer: answers[i] || "Not Answered"
    }));

    try {
      const response = await axios.post('http://localhost:5000/api/quiz/submit', {
        answers: answersArray
      });

      setScore(response.data.correct);
      setResults(response.data.detailedResults);
      setStep('result');
    } catch (err) {
      console.error('Error submitting quiz:', err);
    }
  };

  // Timer logic
  useEffect(() => {
    if (step === 'quiz') {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmit();
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [step]);

  return (
    <div className="assessment-container">

      {/* Domain & Level Selection */}
      {step === 'select' && (
        <div className="select-screen">
          <h2>Ready for Assessment?</h2>
          <label>Choose Domain:</label>
          <select onChange={(e) => setDomain(e.target.value)} value={domain}>
            <option value="">Select</option>
            <option value="JavaScript">JavaScript</option>
            <option value="Java">Java</option>
            <option value="Web Development">Web Development</option>
            <option value="AI">AI</option>
            <option value="ML">ML</option>
            <option value="DL">DL</option>
            <option value="Data Science">Data Science</option>
            <option value="Python">Python</option>
            <option value="React">React</option>
            <option value="Node.js">Node.js</option>
            <option value="DBMS">DBMS</option>
          </select>
          <br />
          <label>Choose Level:</label>
          <select onChange={(e) => setLevel(e.target.value)} value={level}>
            <option value="">Select</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          <br />
          {domain && level && <button onClick={() => setStep('instructions')}>Next</button>}
        </div>
      )}

      {/* Instructions Screen */}
      {step === 'instructions' && (
        <div className="instructions-screen">
          <h3>Instructions</h3>
          <ul>
            <li>Each question has one correct answer.</li>
            <li>No negative marking.</li>
            <li>Finish within the allotted time.</li>
          </ul>
          <button onClick={handleStart}>Start Test</button>
        </div>
      )}

      {/* Quiz Screen */}
      {step === 'quiz' && questions.length > 0 && (
        <div className="quiz-screen">
          <p>Time left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
          <h3>Question {current + 1} of {questions.length}</h3>
          <p>{questions[current].question}</p>
          {questions[current].options.map((opt, idx) => (
            <div key={idx}>
              <input
                type="radio"
                name={`q${current}`}
                value={opt.text}
                onChange={() => handleAnswer(current, opt.text)}
                checked={answers[current] === opt.text}
              />
              {opt.text}
            </div>
          ))}
          <div>
            {current > 0 && <button onClick={() => setCurrent(current - 1)}>Previous</button>}
            {current < questions.length - 1 && <button onClick={() => setCurrent(current + 1)}>Next</button>}
            {current === questions.length - 1 && <button onClick={handleSubmit}>Submit</button>}
          </div>
        </div>
      )}
      {step === 'result' && (
  <div className="result-screen">
    <h3>Assessment Completed</h3>
    <p>Domain: {domain}</p>
    <p>Level: {level}</p>
    <p>Score: {score} / {questions.length}</p>

    <h4>Review Answers:</h4>
    {results.map((res, idx) => {
      const isCorrect = res.userAnswer === res.correctAnswer;
      const isUnattempted = res.userAnswer === 'Not Answered';

      return (
        <div key={idx} className="result-question">
          <p><strong>Q{idx + 1}:</strong> {res.question}</p>
          <p style={{color: isUnattempted ? 'red' : isCorrect ? 'green' : 'red'}}>
            Your Answer: {res.userAnswer}
          </p>
          {!isCorrect && <p>Correct Answer: {res.correctAnswer}</p>}
          <hr />
        </div>
      );
    })}
  </div>
)}

    </div>
  );
};

export default SkillAssessment;
