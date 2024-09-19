import React, { useState } from 'react'
import Rosconnect from './components/RosConnection'
import './App.css'
import CameraData from './components/CameraData';
import VoiceRecorder from './components/VoiceRecorder';
import InteractGtp from './components/InteractGtp';
import PanicButton from './components/PanicButton';
import FormUserModal from './components/FormUser';
import ChatWidget from './components/ChatComponent';
import ChatWidgetW from './components/ChatWidgetWs';
// import MapandOdom from './components/map_component';

function App() {
  // Definicion de variables de entrada
  const [ros, setRos] = useState(null); 
  const [selectedTopic, setSelectedTopic] = useState('/color/image_raw/compressed');
  // Nueva variable que almacena los valores transcritos
  // const [transcription, setTranscription] = useState('');
  // Controla la visibilidad del modal
  const [isModalVisible, setIsModalVisible] = useState(true); 
  // Variable de almacenamiento de persona de prueba
  const [personInfo, setPersonInfo] = useState({ nome: '', sobrenome: '' }); // Estado para almacenar nombre y apellido
  //const [personId, setPersonId] = useState({id: null});

  const handleTopicChange = (event) => {
    setSelectedTopic(event.target.value);
  };

  return (
    <>
      {isModalVisible && <FormUserModal setIsModalVisible={setIsModalVisible} setPersonInfo={setPersonInfo} />}
      <div className="app-container">
        {/* Componente de header para validacion de estado de conexion */}
        <header className="app-header">
          <div className="logo">HCS Laboratory - Teste para: {personInfo.nome} {personInfo.sobrenome} </div>
          <Rosconnect setRos={setRos}/>
        </header>
        <div className="content-container">
          <div className="left-panel">
            <ChatWidgetW personInfo={personInfo} />
          </div>
          
          <div className="right-panel">
            <div className="video-container">
              {ros && <CameraData ros={ros} topic={selectedTopic} />}
              <div className="topic-selector rounded-b-lg shadow md:shadow-lg">
                <label htmlFor="topic-select">Dropdown - Video topic:</label>
                <select id="topic-select " value={selectedTopic} onChange={handleTopicChange}>
                  <option value="/color/image_raw/compressed">/color/image_raw/compressed</option>
                  <option value="/depth/image_rect_raw/compressed">/depth/image_rect_raw/compressed</option>
                  <option value="/dbg_image/compressed">/dbg_image/compressed</option>
                  {/* Add more options as needed */}
                </select>
              </div>
              <PanicButton/>
              {/* <MapandOdom ros={ros}/> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App
