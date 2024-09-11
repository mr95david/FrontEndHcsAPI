// Seccion de importe de librerias
import React, { useEffect, useState } from "react";
import ROSLIB from "roslib";

const CameraData = ({ ros, topic }) => {
    // declaracion de variables de obtencion de datos de camara
    const [imgData, setImgData] = useState('');

    useEffect(() => {
        // Validacion de actual conexion de ros2
        if (!ros || !topic){
            return;
        }

        // Variable de almacenamiento de datos de imagenes
        const listener = new ROSLIB.Topic({
            ros: ros, // Instancia de ros usada (scope global)
            name: topic, // Nombre del topico
            messageType: 'sensor_msgs/CompressedImage' // Tipo de imagen que se va a recibir
        });

        // Funcion de subscriptor
        listener.subscribe((msg) => {
            const { data } = msg;
            const imageBase64 = `data:image/jpeg;base64,${data}`;
            setImgData(imageBase64);
        });

        // Limpieza cuando el componente se desmonta
        return () => {
            listener.unsubscribe();
        };
    }, [ros, topic]);

    return (
        <div className="bg-indigo-300 rounded-t-lg">
            {/* <h3>Received Image:</h3> */}
            {imgData ? (
                <img className="object-cover h-420 w-640 rounded-t-lg" src={imgData} alt="Received ROS Image" style={{ maxWidth: '100%' }} />
            ) : (
                <p>Waiting for images...</p>
            )}
        </div>
    );
};

export default CameraData;