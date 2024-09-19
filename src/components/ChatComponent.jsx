import React, { useState } from 'react';

const ChatWidget = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { text: input, sender: 'user' };
    setMessages([...messages, userMessage]);
    setInput('');

    // Simulate bot response after a delay
    setTimeout(() => {
      const botMessage = { text: 'This is a simulated response.', sender: 'bot' };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Message Display Section */}
      <div className="flex-1 p-4 overflow-auto">
        {messages.map((message, index) => (
          <div key={index} className={`mb-2 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-2 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'}`}>
              {message.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Section */}
      <div className="p-4 border-t flex items-center">
        {/* Voice Message Button */}
        <button
          className="mr-2 p-2 bg-green-500 text-white rounded-full"
          onClick={() => alert('Voice message feature coming soon!')}
        >
          🎤
        </button>

        {/* Text Input */}
        <input
          type="text"
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-blue-500"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />

        {/* Send Button */}
        <button
          className="ml-2 p-2 bg-blue-500 text-white rounded-lg"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWidget;
