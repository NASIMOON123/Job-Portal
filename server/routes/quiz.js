import express from 'express';
import Question from '../models/Question.js';

const router = express.Router();

// ✅ Add single or multiple questions
router.post('/add', async (req, res) => {
  try {
    const data = req.body;

    if (Array.isArray(data)) {
      // Bulk insert
      const insertedQuestions = await Question.insertMany(data);
      return res.status(201).json({ message: `${insertedQuestions.length} questions added successfully.` });
    } else {
      // Single insert
      const question = new Question(data);
      await question.save();
      return res.status(201).json({ message: 'Question added successfully', question });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to add question(s)', details: err.message });
  }
});

// ✅ Get all questions
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching questions', details: err.message });
  }
});

// ✅ Get questions by domain & level
router.get('/:domain/:level', async (req, res) => {
  const { domain, level } = req.params;
  try {
    const questions = await Question.find({ domain, level }).select('-options.isCorrect'); // hide correct answer
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch questions', details: err.message });
  }
});


router.post('/submit', async (req, res) => {
  try {
    const { answers } = req.body; // [{ questionId, selectedAnswer }]
    let score = 0;
    let detailedResults = [];

    for (const ans of answers) {
      const question = await Question.findById(ans.questionId); // get full question with options
      if (question) {
        const correctOption = question.options.find(opt => opt.isCorrect);
        const isCorrect =
          correctOption &&
          correctOption.text.trim().toLowerCase() === ans.selectedAnswer.trim().toLowerCase();

        if (isCorrect) score++;

        detailedResults.push({
          question: question.question,
          userAnswer: ans.selectedAnswer,
          correctAnswer: correctOption ? correctOption.text : 'N/A'
        });
      }
    }

    res.json({
      message: 'Evaluation complete',
      total: answers.length,
      correct: score,
      detailedResults
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to evaluate answers', details: err.message });
  }
});


// ✅ Bulk delete questions (optional)
router.post('/bulk-delete', async (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids)) {
    return res.status(400).json({ error: 'Please provide an array of IDs.' });
  }
  try {
    const result = await Question.deleteMany({ _id: { $in: ids } });
    res.json({ message: `${result.deletedCount} questions deleted.` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete questions', details: err.message });
  }
});

export default router;
