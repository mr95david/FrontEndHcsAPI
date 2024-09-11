// Seccion de importe de librerias
import React, { useEffect, useState } from "react";
import ROSLIB from "roslib";

// Creacion de clase para validacion de conexion con 
const Rosconnect = ({ setRos }) => {
    // Variables de estado de react - Variables de asignacion de valor de conexion 
    const [connected, setConnected] = useState(false);

    // ejecucion de efecto de conexion con rosbridge
    useEffect(() => {
        // Inicializar conexión con ROSBridge
        const ros = new ROSLIB.Ros({
            url: "ws://localhost:9090" // Cambia esta URL según sea necesario
        });

        // Evento para la validacion de conexion exitosa
        ros.on('connection', () => {
            // Asignacion de instancia de ros
            setRos(ros);
            console.log('Connection Successful');
            setConnected(true);
        });

        // Evento cuando la conexión se cierra
        ros.on('close', () => {
            console.log('Connection to ROSBridge closed');
            setConnected(false);
        });

        // Validacion de existencia de error
        ros.on('error', (error) => {
            console.error('Error connecting to ROSBridge: ', error);
            setConnected(false);
        });

        // Limpieza de conexion en caso de que esta termine
        return () => {
            ros.close();
            
        };
    }, [setRos]);

    // Retorno final de funcion
    return (
        <div className="status-connection">
            <span>Status Connection:</span>
            <div>
                {connected ? (
                    <span style={{ color: 'green' }}>Connected</span>
                ) : (
                    <span style={{ color: 'red' }}>Disconnected</span>
                )}
            </div>
        </div>
    );
}

export default Rosconnect;