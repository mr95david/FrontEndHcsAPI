// Importe de librerias
import { useEffect, useRef, useState } from 'react';
import ROSLIB from 'roslib';

// Seccion de creacion de clase general
const MapandOdom = ({ ros }) => {
    // Variable encargada de recarga de visualizacion de mapa
    const canvasRef = useRef(null);
    // Seccion temporal de validacion de funcionamiento
    const [lastPosition, setLastPosition] = useState(null);
    const [lastOrientation, setLastOrientation] = useState(null);
    const [mapResolution, setMapResolution] = useState(1);
    // Final de seccion temporal

    // Validaicion de uso de isntacia de ros existente 
    useEffect(() => {
        if (!ros) {
            return;
        }
        
        // Creacion de variable de cliente para el topico de mapa publicado
        const mapClient = new ROSLIB.Topic({
            ros: ros,
            name: '/map',
            messageType: 'nav_msgs/OccupancyGrid'
        });
        // Variable de deteccion de posicion actual de robot con respecto al mapa
        const amclClient = new ROSLIB.Topic({
            ros: ros,
            name: '/amcl_pose',
            messageType: 'geometry_msgs/PoseWithCovarianceStamped',
        });

        // Segunda prueba de visualizacion
        let mapWidth, mapHeight, mapData;

        mapClient.subscribe((map) => {
        mapWidth = map.info.width;
        mapHeight = map.info.height;
        setMapResolution(map.info.resolution); // Guardamos la resolución del mapa
        mapData = map.data;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.width = mapWidth;
        canvas.height = mapHeight;

        for (let i = 0; i < mapWidth * mapHeight; i++) {
            const occupancy = mapData[i];
            const row = Math.floor(i / mapWidth);
            const col = i % mapWidth;

            if (occupancy === 100) {
            context.fillStyle = '#000000';
            } else if (occupancy === 0) {
            context.fillStyle = '#ffffff';
            } else {
            const gray = 255 - Math.round(occupancy * 2.55);
            const color = `rgb(${gray},${gray},${gray})`;
            context.fillStyle = color;
            }

            context.fillRect(col, mapHeight - row - 1, 1, 1);
        }

        // Si tenemos una posición guardada, redibujamos el robot
        if (lastPosition) {
            const mapOriginX = canvas.width / 2 + lastPosition.x / mapResolution;
            const mapOriginY = canvas.height / 2 - lastPosition.y / mapResolution;

            context.beginPath();
            context.fillStyle = '#FF0000';
            context.arc(mapOriginX, mapOriginY, 5, 0, 2 * Math.PI);
            context.fill();
        }
        });

        amclClient.subscribe((amclPose) => {
        const position = amclPose.pose.pose.position;
        const orientation = amclPose.pose.pose.orientation;

        console.log(`Position: ${position.x}, ${position.y}, ${position.z}`);
        console.log(
            `Orientation: ${orientation.x}, ${orientation.y}, ${orientation.z}, ${orientation.w}`
        );

        // Actualizamos la última posición y orientación
        setLastPosition(position);
        setLastOrientation(orientation);

        // Redibujamos la posición del robot en el canvas
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        const mapOriginX = canvas.width / 2 + position.x / mapResolution;
        const mapOriginY = canvas.height / 2 - position.y / mapResolution;

        context.beginPath();
        context.fillStyle = '#FF0000';
        context.arc(mapOriginX, mapOriginY, 5, 0, 2 * Math.PI);
        context.fill();
        });
        // Fin de prueba devisualizacion

        // Inicializacion de variables de resolucion del mapa
        // let mapWidth, mapHeight, mapResolution, mapData;

        // // Creacion de subscriptor de mapa y lectura de datos publicados por el topico
        // mapClient.subscribe((map) => {
        //     // Declaracion de resolucion segun mapa enviado
        //     mapWidth = map.info.width;
        //     mapHeight = map.info.height;
        //     mapResolution = map.info.resolution;
        //     mapData = map.data;
      
        //     // Creacion de canvas (diseno) con el gual se pretende dibujar el mapa segun las especificaciones
        //     const canvas = canvasRef.current;
        //     const context = canvas.getContext('2d');
        //     canvas.width = mapWidth;
        //     canvas.height = mapHeight;
            
        //     // Ciclo para lectura de datos desde los datos publicados por el topic 
        //     for (let i = 0; i < mapWidth * mapHeight; i++) {
        //       const occupancy = mapData[i];
        //       const row = Math.floor(i / mapWidth);
        //       const col = i % mapWidth;
      
        //       if (occupancy === 100) {
        //         context.fillStyle = '#000000';
        //       } else if (occupancy === 0) {
        //         context.fillStyle = '#ffffff';
        //       } else {
        //         const gray = 255 - Math.round(occupancy * 2.55);
        //         const color = `rgb(${gray},${gray},${gray})`;
        //         context.fillStyle = color;
        //       }
      
        //       context.fillRect(col, mapHeight - row - 1, 1, 1);
        //     }
        // });

        // // Inicializacion de variables de posicion del robot de acuerdo al topico publicado por el componente de nav2
        // let position, orientation;

        // // Creacion de cliente subscripto al topic de posicion del robot para estar actualizacion la posicion actual de este en el mapa
        // amclClient.subscribe((amclPose) => {
            
        //     position = amclPose.pose.pose.position;
        //     orientation = amclPose.pose.pose.orientation;
        //     console.log(`Position: ${position.x}, ${position.y}, ${position.z}`);
        //     console.log(
        //       `Orientation: ${orientation.x}, ${orientation.y}, ${orientation.z}, ${orientation.w}`
        //     );
      
        //     const canvas = canvasRef.current;
        //     const context = canvas.getContext('2d');
      
        //     const mapOriginX = canvas.width / 2 + position.x / mapResolution;
        //     const mapOriginY = canvas.height / 2 - position.y / mapResolution;
      
        //     context.beginPath();
        //     context.fillStyle = '#FF0000';
        //     context.arc(mapOriginX, mapOriginY, 5, 0, 2 * Math.PI);
        //     context.fill();
        // });
    }, [ros, lastPosition]);

    return (
        <div className="flex justify-center items-center my-4">
          <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
            {/* <h2 className="text-xl font-bold mb-2">Map & AMCL Pose</h2>
            <h3 className="text-gray-500 mb-4">Subscribe to /map and /amcl_pose</h3> */}
            <canvas
              id="map-canvas"
              ref={canvasRef}
              className="w-full border border-gray-300"
            ></canvas>
          </div>
        </div>
    );
};

export default MapandOdom;