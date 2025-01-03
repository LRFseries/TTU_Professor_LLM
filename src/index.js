
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { FaRobot } from 'react-icons/fa';

function UserInput() {
  const [inputValue, setInputValue] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      sender: 'bot',
      message:
        "Hello Red Raider! I am an AI Chatbot that can help you answer any questions you have about professors at Texas Tech!",
    },
  ]); // Chat history array with an initial bot message

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = async (event) => {
    if (event.key === 'Enter' && inputValue.trim() !== '') {
      // Add user message to chat history
      setChatHistory((prev) => [...prev, { sender: 'user', message: inputValue }]);
      setInputValue('');

      // Add loading message to chat history
      const loadingMessage = { sender: 'bot', message: "Loading..." };
      setChatHistory((prev) => [...prev, loadingMessage]);

      try {
        // Call the API
        const response = await axios.post('http://127.0.0.1:5000/runai', {
          userInput: inputValue,
        });

        // Remove loading message and add bot response to chat history
        setChatHistory((prev) => [
          ...prev.slice(0, -1),
          { sender: 'bot', message: response.data.message },
        ]);
      } catch (error) {
        console.error('Error calling the API:', error);
        setChatHistory((prev) => [
          ...prev.slice(0, -1),
          { sender: 'bot', message: 'An error occurred. Please try again.' },
        ]);
      }

      // Clear the input field
      setInputValue('');
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-history">
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={`chat-message ${chat.sender}`}
          >
            {chat.sender === 'bot' && (
              <div className="chat-icon">
                <FaRobot />
              </div>
            )}
            <div className="chat-bubble">
              {chat.message}
            </div>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type something and press Enter"
        className="chat-input"
      />
    </div>
  );
}

function TitleWords() {
  return (
    <div className="title-container">
      <h1 className="title">TTU AI Chatbot</h1>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div className="app-container">
      <TitleWords />
      <UserInput />
    </div>
  </React.StrictMode>
);

reportWebVitals();