
import mongoose from "mongoose";
const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [
    {
      text: { type: String, required: true },
      isCorrect: { type: Boolean, default: false }  // ✅ mark correct option
    }
  ],
  domain: { type: String, required: true },
  level: { type: String, required: true, enum: ['Beginner','Intermediate','Advanced'] }
});

const Question = mongoose.model('Question', questionSchema);

export default Question;