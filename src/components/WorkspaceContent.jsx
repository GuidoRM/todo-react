import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import useModal from '../hooks/useModal';
import TaskCard from '../components/TaskCard';
import useFetch from '../hooks/useFetch';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import TaskList from './TaskList';

const WorkspaceContent = ({ idWorkspace }) => {
  const [tasks, setTasks] = useState([
    {
      title: 'Design UI Presentation',
      status: 'progress',
      list: 'To Do',
      date: '24 Aug 2022',
      labels: [{ title: 'Urgent', color: '#FF0000' }],
      attachments: 2,
      reminder: true,
      dueDate: true,
    },
    {
      title: 'Add More UI/UX Mockups',
      status: '',
      list: 'In Progress',
      date: '25 Aug 2022',
      labels: [],
      attachments: 0,
      reminder: false,
      dueDate: false,
    },
    {
      title: 'Design System Update',
      status: 'pending',
      list: 'Done',
      date: '12 Nov 2022',
      labels: [{ title: 'Low', color: '#00FF00' }],
      attachments: 1,
      reminder: true,
      dueDate: false,
    },
  ]);

  const [menuOpenTask, setMenuOpenTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const { data, loading, error, fetchData } = useFetch();

  const {
    isOpen: isEditOpen,
    openModal: openEditModal,
    closeModal: closeEditModal,
  } = useModal();

  const {
    isOpen: isDeleteOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();

  useEffect(() => {
    if (idWorkspace) {
      // Lógica para obtener las listas del workspace correspondiente
      const token = localStorage.getItem('authToken');
      if (token) {
        fetchData(`http://localhost:8080/api/lists/workspace/${idWorkspace}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
      }
    }
  }, [idWorkspace, fetchData]);

  useEffect(() => {
    // Este useEffect se asegura de ejecutar cuando los datos se hayan actualizado
    if (data && Array.isArray(data.data)) {
      console.log("Llegaron las listas:", data.data);
    }
  }, [data]);

  const toggleMenu = (task) => {
    setMenuOpenTask((prev) => (prev === task ? null : task));
  };

  const closeMenu = () => {
    setMenuOpenTask(null);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    closeMenu();
    openEditModal();
  };

  const handleDeleteTask = (task) => {
    setSelectedTask(task);
    closeMenu();
    openDeleteModal();
  };

  return (
    <main className="flex-1 p-6 overflow-x-auto">
      {loading && <p className="text-sm text-gray-400">Cargando listas...</p>}
      {error && <p className="text-sm text-red-500">Error: {error}</p>}
      {/* Contenedor con desplazamiento horizontal para listas de tareas */}
      <div className="flex space-x-6 pb-6">
        {/* Renderizar cada sección de listas */}
        {data?.data && Array.isArray(data.data) ? (
          data.data.map((list) => (
            <div key={list.id + " list"} className="flex-shrink-0 w-80 relative">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">{list.title}</h3>
                <div className="relative">
                  <button
                    onClick={() => toggleMenu(list)}
                    className="text-gray-400 hover:text-white focus:outline-none"
                  >
                    <BiDotsVerticalRounded />
                  </button>
                  {menuOpenTask === list && (
                    <div className="absolute top-8 right-0 mt-2 w-40 bg-gray-800 rounded-md shadow-lg z-10">
                      <ul className="py-2">
                        <li
                          className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                          onClick={() => handleEditTask(list)}
                        >
                          Editar
                        </li>
                        <li
                          className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                          onClick={() => handleDeleteTask(list)}
                        >
                          Eliminar
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <TaskList key={list.id + " listId " + list.title} listId={list.id}/>
            </div>
          ))
        ) : (
          <p>No se encontraron listas</p>
        )}
      </div>

      {/* Modal de Edición de Tarea */}
      <Modal isOpen={isEditOpen} onClose={closeEditModal}>
        <h3 className="text-xl font-semibold mb-4">Editar Tarea</h3>
        <form>
          <input
            type="text"
            defaultValue={selectedTask?.title}
            className="w-full p-2 rounded-md mb-4 bg-gray-700 text-white"
          />
          <div className="flex justify-end">
            <button type="button" onClick={closeEditModal} className="bg-gray-600 px-4 py-2 rounded-md mr-2">
              Cancelar
            </button>
            <button type="submit" className="bg-indigo-600 px-4 py-2 rounded-md">
              Guardar
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal de Eliminación de Tarea */}
      <Modal isOpen={isDeleteOpen} onClose={closeDeleteModal}>
        <h3 className="text-xl font-semibold mb-4">Eliminar Tarea</h3>
        <p>¿Estás seguro de que deseas eliminar la tarea "{selectedTask?.title}"?</p>
        <div className="flex justify-end mt-4">
          <button type="button" onClick={closeDeleteModal} className="bg-gray-600 px-4 py-2 rounded-md mr-2">
            Cancelar
          </button>
          <button type="button" className="bg-red-600 px-4 py-2 rounded-md">
            Eliminar
          </button>
        </div>
      </Modal>
    </main>
  );
};

export default WorkspaceContent;
