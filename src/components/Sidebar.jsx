// src/components/Sidebar.jsx
import { useState } from 'react';
import { FaTachometerAlt, FaProjectDiagram, FaTasks, FaBell, FaBars } from 'react-icons/fa';
import SidebarLink from './SidebarLink';

function Sidebar() {
  const [isNavMinimized, setIsNavMinimized] = useState(true);

  // Función para alternar el estado del navbar (minimizado/expandido)
  const toggleNav = () => {
    setIsNavMinimized(!isNavMinimized);
  };

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
            to="/dashboard"
            icon={FaTachometerAlt}
            label="Dashboard"
            isNavMinimized={isNavMinimized}
          />
        </li>
        <li>
          <SidebarLink
            to="/projects"
            icon={FaProjectDiagram}
            label="Workspaces"
            isNavMinimized={isNavMinimized}
          />
        </li>
        <li>
          <SidebarLink
            to="/tasks"
            icon={FaTasks}
            label="Tareas"
            isNavMinimized={isNavMinimized}
          />
        </li>
        <li>
          <SidebarLink
            to="/notifications"
            icon={FaBell}
            label="Notificaciones"
            isNavMinimized={isNavMinimized}
          />
        </li>
      </ul>
    </nav>
  );
}

export default Sidebar;
