// ChatWidget.jsx
import React, { useState } from 'react';
// Importe de libreria de grabacion de voz
import VoiceRecorder from './VoiceRecorder';
import axios from 'axios';


const ChatWidgetW = ({personInfo}) => {
  const [messages, setMessages] = useState([
    // Sample messages for demonstration
    { text: 'Olá, espero poder te ajudar. Todos os mensajes do sistema serão respondidos de acordo com cada solicitação feita.', sender: 'Argos', time: '10:00 AM' },
    { text: 'Todas as mensagens que você enviar aparecerão deste lado.', sender: 'user', time: '10:01 AM' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (input.trim() === '') return;

    const messageText = input; // Guarda el valor actual del input

    const userMessage = {
      text: messageText,
      sender: 'user',
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    // Actualiza los mensajes con el mensaje del usuario
    setMessages([...messages, userMessage]);
    setInput(''); // Limpia el input

    try {
      // Envía la solicitud POST al backend
      const response = await axios.post('http://localhost:5000/api/chat_request', {
        transcription: messageText,
        name: personInfo.nome,
        lastname: personInfo.sobrenome,
      });

      // Obtiene la respuesta del bot
      const botResponseText = response.data.message; // Ajusta según la estructura de tu respuesta

      const botMessage = {
        text: botResponseText,
        sender: 'bot',
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      // Actualiza los mensajes con la respuesta del bot
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error al enviar el texto:', error);
      // Opcional: muestra un mensaje de error en el chat
      const errorMessage = {
        text: 'Error: No se pudo obtener respuesta del servidor.',
        sender: 'bot',
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };


  return (
    <div className="flex flex-col w-full bg-gray-100 chat-text-bot">
      {/* Header */}
      <div className="flex items-center p-4 bg-green-600 text-white">
        <img
          src="src/assets/robot-assistant.png"
          alt="Bot Avatar"
          className="rounded-full w-10 h-10 mr-3"
        />
        <div>
          <h1 className="text-lg font-semibold">Argos</h1>
          <p className="text-sm">Online</p>
        </div>
      </div>

      {/* Message Display Section */}
      <div className="flex-1 p-4 overflow-auto bg-chat-bg">
        {messages.map((message, index) => (
          <div key={index} className={`mb-2 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-xs break-words">
              <div
                className={`p-2 rounded-lg text-sm shadow
                  ${message.sender === 'user' ? 'bg-green-500 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none'}
                `}
              >
                {message.text}
                <div className="text-xs text-right mt-1 opacity-75">
                  {message.time}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Section */}
      <div className="p-2 flex items-center border-t bg-white">
        {/* Voice Message Button */}
        <VoiceRecorder setTranscription={setInput}/>

        {/* Text Input */}
        <input
          type="text"
          className="flex-1 mx-2 p-2 border rounded-full bg-gray-100 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-600"
          placeholder="Type a message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />

        {/* Send Button */}
        <button
          className="p-2 text-green-600 hover:text-green-800 focus:outline-none"
          onClick={handleSend}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-45" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3.4 21.6l17.9-9.6L3.4 2.4v7.2l12.7 1.8-12.7 1.8v7.2z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatWidgetW;
