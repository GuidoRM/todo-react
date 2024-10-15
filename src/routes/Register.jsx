// src/routes/Register.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    const formData = new FormData();
    formData.append('user', new Blob([JSON.stringify({ firstName, lastName, email, password })], {
      type: 'application/json'
    }));
    
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }
  
    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        body: formData,
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Cambiar a text() si el backend devuelve texto en lugar de JSON
    const data = await response.text();
    console.log('Respuesta del servidor:', data);
    
    setSuccessMessage('Registro exitoso. Redirigiendo al login...');
    setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error('Error durante el registro:', err);
      setError(err.message || 'Ocurrió un error durante el registro');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-white text-center mb-6">Registrar Usuario</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">
              Nombre
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2 text-gray-900 rounded-md bg-gray-100 focus:outline-none focus:ring focus:ring-indigo-600"
              placeholder="Nombre"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">
              Apellido
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2 text-gray-900 rounded-md bg-gray-100 focus:outline-none focus:ring focus:ring-indigo-600"
              placeholder="Apellido"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 text-gray-900 rounded-md bg-gray-100 focus:outline-none focus:ring focus:ring-indigo-600"
              placeholder="correo@ejemplo.com"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 text-gray-900 rounded-md bg-gray-100 focus:outline-none focus:ring focus:ring-indigo-600"
              placeholder="********"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="profileImage" className="block text-sm font-medium text-gray-300 mb-1">
              Imagen de Perfil
            </label>
            <input
              type="file"
              id="profileImage"
              onChange={(e) => setProfileImage(e.target.files[0])}
              className="w-full text-gray-300 bg-gray-700 p-2 rounded-md"
            />
          </div>
          {error && (
            <div className="mb-4 text-sm text-red-500">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white font-semibold rounded-md transition ${
              loading
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;