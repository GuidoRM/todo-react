import React, { useState, useEffect } from 'react';
import ModalCreateTask from '../ModalCreateTask';
import { FaInfoCircle } from 'react-icons/fa';
import { format } from 'date-fns';

const WorkspaceHeader = ({ idWorkspace, onTaskCreated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [workspaceInfo, setWorkspaceInfo] = useState(null);

  const handleInfoMouseEnter = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:8080/api/workspaces/${idWorkspace}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.status === 200) {
        setWorkspaceInfo(data.data);
        setIsInfoVisible(true);
      }
    } catch (error) {
      console.error('Error fetching workspace info:', error);
    }
  };

  const handleInfoMouseLeave = () => {
    setIsInfoVisible(false);
  };

  const formatCreationDate = (dateArray) => {
    try {
      const [year, month, day, hour, minute, second] = dateArray;
      return format(new Date(year, month - 1, day, hour, minute, second), 'yyyy-MM-dd HH:mm:ss');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Fecha no disponible';
    }
  };

  return (
    <header className="flex justify-between items-center p-6 bg-gray-800 shadow-md relative">
      <div className="flex items-center justify-center">
        <h2 className="text-3xl font-bold mr-2">Workspace</h2>
        <div onMouseEnter={handleInfoMouseEnter}
          onMouseLeave={handleInfoMouseLeave} className="flex items-center justify-center mt-[0.5rem]"> 
          <FaInfoCircle
            className="text-xl text-gray-400 cursor-pointer hover:text-gray-200"
          />
        </div>

        {isInfoVisible && workspaceInfo && (
          <div className="absolute top-16 left-44 min-w-64 max-w-96 w-fit p-4 bg-white text-black rounded-md shadow-lg z-10 flex flex-col gap-2">
            <p><strong>Descripción:</strong> {workspaceInfo.descriptionWorkspace}</p>
            <p><strong>Tipo:</strong> {workspaceInfo.typeWorkspace}</p>
            <p><strong>Creación:</strong> {formatCreationDate(workspaceInfo.creationDate)}</p>
          </div>
        )}
      </div>
      <button
        className="bg-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-700"
        onClick={() => setIsModalOpen(true)}
      >
        Nueva Tarea
      </button>
      <ModalCreateTask
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        //onCreateTask={handleCreateTask}
        onTaskCreated={onTaskCreated}
        idWorkspace={idWorkspace}
        setIsModalOpen={setIsModalOpen}
      />
    </header>
  );
};

export default WorkspaceHeader;