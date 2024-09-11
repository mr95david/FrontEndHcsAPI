// Importe de librerias
import { useState, useEffect } from "react";
import React from "react";
import axios from 'axios';

// Creacion de clase de componente
const FormUserModal = ({ setIsModalVisible, setPersonInfo }) => {
  // Variable de validacion de usuario nuevo o usuario existente
  const [isNewUser, setIsNewUser] = useState(null);
  // Variables de almacenamiento de datos de usuario
  const [formData, setFormData] = useState({
      name: '',
      lastname: '',
      age: '',
      profession: '',
      sexo: '',
      date: ''
    });
  // variable de almacenamiento de datos de usuario existente
  const [existData, setExistData] = useState({
    name: '',
    lastname: ''
  });

  // Obtiene la fecha actual en formato yyyy-mm-dd
  useEffect(() => {
      const today = new Date().toISOString().split('T')[0]; 
      setFormData((prevData) => ({ ...prevData, date: today }));
  }, []);

  // Funcion para actualizacion de datos
  const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Funcion para actualizacion de informacion de formulario de datos existentes
  const handleInputChangeE = (e) => {
    const { name, value } = e.target;
    setExistData((prevData) => ({ ...prevData, [name]: value }));
};

  
  // Funcion para validacion de ocultar modal
  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        // Creacion de interaccion con api de backend
        const response = await axios.post('http://localhost:5000/set_user', formData);
        console.log(response.data);

        setPersonInfo({ nome: formData.name, sobrenome: formData.lastname });
        setIsModalVisible(false); 
      } catch{
        if (error.response && error.response.status === 400) {
          alert('La persona ya existe en la base de datos.');
        } else {
          console.error('Error al enviar los datos:', error);
        }
      }  
  };

  const handleSubmitE = async (e) => {
    e.preventDefault();
    try {
      // Construir la URL con los parámetros de nombre y apellido
      const response = await axios.get('http://localhost:5000/validate_user', {
        params: {
          name: existData.name,
          lastname: existData.lastname,
        },
      });
  
      // Verificar si la respuesta es positiva y manejar los datos de usuario
      if (response.status === 200) {
        console.log(response.data);
        setPersonInfo({nome: existData.name, sobrenome: existData.lastname});
        setIsModalVisible(false); // Ocultar modal después de la validación exitosa
      } else if (response.status === 404) {
        alert('Usuario no encontrado.');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert('Se requiere tanto el nombre como el apellido para la validación.');
      } else {
        console.error('Error al validar el usuario:', error);
        alert('Error inesperado al validar el usuario.');
      }
    }
  };

  // Funcion de manejo de usuario existente o usuario nuevo
  const handleUserTypeChange = (e) => {
    setIsNewUser(e.target.value === "new");
  };

  // Seccion de disenho de formulario
  return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        {isNewUser === null ? (
          // Mostrar la opción para elegir si es nuevo o existente
          <div>
              <h2 className="text-xl font-semibold mb-4">Selecione o tipo de usuário</h2>
              <div className="flex justify-center space-x-4">
                  <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                      onClick={() => setIsNewUser(true)}>
                      Novo Usuário
                  </button>
                  <button
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                      onClick={() => setIsNewUser(false)}>
                      Usuário Existente
                  </button>
              </div>
          </div>
      ):(
        <div>
          {/* <h2 className="text-xl font-semibold mb-4">Formulário de Registro</h2> */}
          <h2 className="text-xl font-semibold mb-4">{isNewUser ? "Formulário de Registro" : "Buscar Usuário Existente"}</h2>
          {isNewUser ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome:</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="mt-1 p-2 w-full border border-gray-300 rounded-md"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Sobrenome:</label>
                <input type="text" name="lastname" value={formData.lastname} onChange={handleInputChange} required className="mt-1 p-2 w-full border border-gray-300 rounded-md"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Idade:</label>
                <input type="number" name="age" value={formData.age} onChange={handleInputChange} required className="mt-1 p-2 w-full border border-gray-300 rounded-md"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Profissão:</label>
                <input type="text" name="profession" value={formData.profession} onChange={handleInputChange} required className="mt-1 p-2 w-full border border-gray-300 rounded-md"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Sexo:</label>
                <select name="sexo" value={formData.sexo} onChange={handleInputChange} required className="mt-1 p-2 w-full border border-gray-300 rounded-md">
                  <option value="">Selecione</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Data:</label>
                <input type="date" name="date" value={formData.date} onChange={handleInputChange} required className="mt-1 p-2 w-full border border-gray-300 rounded-md"/>
              </div>
              <div className="flex justify-center space-x-4">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Cadastrar</button>
                <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600" onClick={() => setIsNewUser(null)}>Voltar</button>
              </div>
            </form>
          ):(
            <form onSubmit={handleSubmitE}>
                <div className="mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nome:</label>
                    <input type="text" name="name" value={existData.name} onChange={handleInputChangeE} required className="mt-1 p-2 w-full border border-gray-300 rounded-md"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Sobrenome:</label>
                    <input type="text" name="lastname" value={existData.lastname} onChange={handleInputChangeE} required className="mt-1 p-2 w-full border border-gray-300 rounded-md"/>
                  </div>
                </div>
                <div className="flex justify-center space-x-4">
                  <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                      Buscar
                  </button>
                  <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600" onClick={() => setIsNewUser(null)}>Voltar</button>
                </div>
            </form>
          )}
        </div>
      )}  
      </div>
    </div>
  );

};

export default FormUserModal; 