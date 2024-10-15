// src/components/Sidebar.jsx
import { useState } from 'react';
import { FaHome, FaUserEdit, FaBars } from 'react-icons/fa';
import SidebarLink from './SidebarLink';
import { useLocation } from 'react-router-dom';

function Sidebar() {
  const [isNavMinimized, setIsNavMinimized] = useState(true);
  const location = useLocation();

  // Función para alternar el estado del navbar (minimizado/expandido)
  const toggleNav = () => {
    setIsNavMinimized(!isNavMinimized);
  };

  const isActiveRoute = (route) => {
    return location.pathname === route;
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
    </nav>
  );
}

export default Sidebar;
