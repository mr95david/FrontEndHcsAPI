// Importe de librerias
import React, { useState, useRef, useEffect } from "react";
import axios from 'axios';

// Clase de ejecucion de grabacion  
const VoiceRecorder = ({setTranscription}) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isFileProcessing, setIsFileProcessing] = useState(false);
    const [audioFile, setAudioFile] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    // Funcion de inicio de grabacion
    const startRecording = async () => {
        // Validacion de estado actual de grabacion
        setIsRecording(true);

        // Uso de dispositivos para deteccion de audio
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        // Detector de audio
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        // Ejecucion de evento de obtencion de audio
        mediaRecorderRef.current.ondataavailable = event => {
            audioChunksRef.current.push(event.data);
        };

        // Referencia de parado de deteccion de audio
        mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudioUrl(audioUrl);
            setAudioFile(audioBlob);
        };

        // Inicio general
        mediaRecorderRef.current.start();
    };

    // Funcion para detener la deteccion de audio
    const stopRecording = () => {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        setIsFileProcessing(true);
    };

    // Funcion para almacenar el nuevo audio tomado
    const uploadRecording = async () => {
        if (!audioFile) return;

        const formData = new FormData();
        formData.append('file', audioFile, 'recording.wav');

        try {
            const response = await axios.post('http://localhost:5000/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Actualizacion de datos de textarea
            
            setTranscription(response.data.transcription);
            console.log('File uploaded successfully:', response.data);
        } catch (error) {
            console.error('Error uploading file:', error);
        }finally{
            setIsFileProcessing(false);
        }
    };

    return (
        <div>
            <button
            className={`p-2 text-gray-500 hover:text-green-600 focus:outline-none ${isRecording ? 'text-red-600' : 'text-gray-600'}`}
            onClick={isRecording ? stopRecording : startRecording}
            >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14a3 3 0 003-3V5a3 3 0 10-6 0v6a3 3 0 003 3z" />
                <path d="M19 11a1 1 0 10-2 0 5 5 0 01-10 0 1 1 0 10-2 0 7 7 0 006 6.92V20h-3a1 1 0 000 2h8a1 1 0 000-2h-3v-2.08A7 7 0 0019 11z" />
            </svg>
            </button>
            <button
                className={`p-2 text-gray-500 focus:outline-none ${isFileProcessing ? 'text-green-600' : 'text-gray-600'}`}
                onClick={uploadRecording} disabled={!audioFile}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 11.5a8.38 8.38 0 01-1.25 4.38 8.5 8.5 0 01-7.25 3.62 8.38 8.38 0 01-4.38-1.25L3 21l2.75-5.12A8.38 8.38 0 014.5 11.5 8.5 8.5 0 0112 3a8.5 8.5 0 018.5 8.5z" />
                </svg>
            </button>
        </div>
        );
};

export default VoiceRecorder;