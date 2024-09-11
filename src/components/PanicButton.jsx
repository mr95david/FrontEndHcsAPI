// Seccion de importe de librerias
import React, { useState, useRef } from "react";
import axios from 'axios';

// Clase de ejecucion de componente
const PanicButton = () => {
    // Funcion para ejecucion de boton de stop
    const handleSubmit = async (e) => {
        // Funcion para envio de orden de detencion general de movimiento
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/panic');
            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error posting text:', error);
        }
    };

    // Funcion para la ejecucion de solicitud de relocalizaicon de robot
    const handleReinit = async (e) => {
        // Funcion para envio de orden de detencion general de movimiento
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/retinit_pose');
            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error posting text:', error);
        }
    };

    return (
        <div className="mt-2 flex justify-center space-x-4">
            <button
                type="button"
                className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-lg px-8 py-4 dark:focus:ring-yellow-900"
                onClick={handleReinit}
            >
                Relocalization
            </button>
            <button
                type="button"
                className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-lg px-8 py-4 dark:focus:ring-red-900"
                onClick={handleSubmit}
            >
                Stop Task
            </button>
        </div>
    );


};

export default PanicButton;