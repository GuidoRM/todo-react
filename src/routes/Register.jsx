// src/routes/Register.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';

function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const { data, loading, error, fetchData } = useFetch();
  const navigate = useNavigate();

  // Cuando se obtenga la respuesta, redirigir al login
  useEffect(() => {
    if (data) {
      navigate('/login'); // Redirige al usuario a la página de inicio de sesión
    }
  }, [data, navigate]);

  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('profileImage', profileImage);

    // Ejecutar la solicitud de registro usando `useFetch`
    fetchData('http://localhost:3000/register', {
      method: 'POST',
      body: formData,
    });
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
