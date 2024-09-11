import React, { useState } from 'react'
import Rosconnect from './components/RosConnection'
import './App.css'
import CameraData from './components/CameraData';
import VoiceRecorder from './components/VoiceRecorder';
import InteractGtp from './components/InteractGtp';
import PanicButton from './components/PanicButton';
import FormUserModal from './components/FormUser';
// import MapandOdom from './components/map_component';

function App() {
  // Definicion de variables de entrada
  const [ros, setRos] = useState(null); 
  const [selectedTopic, setSelectedTopic] = useState('/color/image_raw/compressed');
  // Nueva variable que almacena los valores transcritos
  const [transcription, setTranscription] = useState('');
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
            <div className="task-status mb-8">
              {/* <h3>Status last task</h3> */}
              <div className="relative w-full">
                <div className="relative w-full min-w-[200px]">
                  <textarea rows="10"
                    className="peer h-full min-h-[100px] w-full !resize-none  rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50"
                    placeholder=" "
                    readOnly
                    value={transcription}></textarea>
                  <label
                    className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                    Message received
                  </label>
                </div>
              </div>
            </div>
            <VoiceRecorder setTranscription={setTranscription}/>
            <InteractGtp transcription={transcription} personInfo={personInfo}/>
            <PanicButton/>
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
              {/* <MapandOdom ros={ros}/> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App
