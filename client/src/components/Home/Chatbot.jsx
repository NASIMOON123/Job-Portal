
import React, { useState } from 'react';
import './Chatbot.css';
import { FaUserGraduate } from 'react-icons/fa';
import chatbotData from './chatbotData';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hello! I am your JobBot , How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { from: 'user', text: input };
    let botAnswer = "I'm sorry, I don't have an answer for that.";

    // search for a matching question
    const found = chatbotData.find(
      (q) => q.question.toLowerCase() === input.trim().toLowerCase()
    );
    if (found) botAnswer = found.answer;

    setMessages((prev) => [...prev, userMessage, { from: 'bot', text: botAnswer }]);
    setInput('');
  };

  return (
    <div className="chatbot-fixed">
      <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
        {/* Icon Header */}
        <div className="chatbot-header" onClick={() => setIsOpen(!isOpen)} title="Chat with bot">
          <FaUserGraduate size={28} color="white" />
        </div>

        {isOpen && (
          <div className="chatbot-body">
            <div className="chatbot-messages">
              {messages.map((msg, idx) => (
                <div key={idx} className={`message ${msg.from}`}>
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="chatbot-input">
              <input
                type="text"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button className='send-button' onClick={handleSend}>Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbot;
