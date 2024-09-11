// Importe de librerias
import React, { useState, useRef } from "react";
import axios from 'axios';

// Clase de ejecucion de grabacion  
const VoiceRecorder = ({setTranscription}) => {
    // Seccion de designacion de variables 
    // Variable de validacion de  estado de grabacion
    const [isRecording, setIsRecording] = useState(false);
    // Variable de almacenamiento de audio
    const [audioUrl, setAudioUrl] = useState(null);
    const [audioFile, setAudioFile] = useState(null);
    // Verificacion de referencia
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
        setIsRecording(false);
        mediaRecorderRef.current.stop();
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
        }
    };

    return (
        <div className="voice-section-button">
            <button className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
             onClick={isRecording ? stopRecording : startRecording}>
                {isRecording ? "Stop Recording" : "Start Recording"}
            </button>
            <button className="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800"
                onClick={uploadRecording} disabled={!audioFile}>
                Send Audio
            </button>
            {audioUrl && (
                <div className="flex justify-center content-center items-start">
                    <audio src={audioUrl} controls />
                </div>
            )}
        </div>
    );
};

export default VoiceRecorder;