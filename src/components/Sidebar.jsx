// src/components/Sidebar.jsx
import { useState } from 'react';
import { FaHome, FaUserEdit, FaBars, FaSignOutAlt } from 'react-icons/fa';
import SidebarLink from './SidebarLink';
import { useLocation, useNavigate } from 'react-router-dom';

function Sidebar() {
  const [isNavMinimized, setIsNavMinimized] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Función para alternar el estado del navbar (minimizado/expandido)
  const toggleNav = () => {
    setIsNavMinimized(!isNavMinimized);
  };

  const isActiveRoute = (route) => {
    return location.pathname === route;
  }

  const handleLogout = () => {
    navigate('/login');
  }

  return (
    <nav
      className={`${
        isNavMinimized ? 'w-20' : 'w-64'
      } transition-all duration-300 p-4 bg-gray-800 relative min-h-screen flex flex-col`}
    >
      {/* Botón para minimizar/expandir */}
      <div className="flex justify-center mb-6">
        <button
          onClick={toggleNav}
          className="text-xl text-white focus:outline-none"
        >
          <FaBars />
        </button>
      </div>

      {/* Lista de enlaces de navegación */}
      <ul className="space-y-6">
        <li>
          <SidebarLink
            to="/home"
            icon={FaHome}
            label="Home"
            isNavMinimized={isNavMinimized}
            isActive={isActiveRoute('/home')}
          />
        </li>
        <li>
          <SidebarLink
            to="/profile"
            icon={FaUserEdit}
            label="Editar Perfil"
            isNavMinimized={isNavMinimized}
            isActive={isActiveRoute('/profile')}
          />
        </li>
      </ul>

      <div className="mt-auto">
        <button onClick={handleLogout} className={`w-full flex items-center ${isNavMinimized ? 'justify-center' : 'justify-start'} p-2 text-white hover:bg-gray-700 rounded transitions-colors`} >
          <FaSignOutAlt className={`$ {isNavMinimized ? 'mr-0' : 'mr-4'}`} />
          {!isNavMinimized && <span className="ml-3"> Cerrar Sesión</span>}
        </button>
      </div>
    </nav>
  );
}

export default Sidebar;
