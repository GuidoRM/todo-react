// src/components/SidebarLink.jsx
import { NavLink } from 'react-router-dom';

function SidebarLink({ to, icon: Icon, label, isNavMinimized }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center p-2 rounded-md hover:bg-gray-700 ${
          isActive ? 'bg-indigo-600 shadow-lg' : ''
        }`
      }
    >
      <Icon className={`text-2xl ${isNavMinimized? "m-auto": ""}`} />
      {!isNavMinimized && <span className="ml-3">{label}</span>}
    </NavLink>
  );
}

export default SidebarLink;
