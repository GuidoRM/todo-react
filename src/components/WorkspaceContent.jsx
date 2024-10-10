import React, { useState, useRef, useEffect } from 'react';
import Modal from '../components/Modal';
import useModal from '../hooks/useModal';
import TaskCard from '../components/TaskCard';
import { BiDotsVerticalRounded } from 'react-icons/bi';

const WorkspaceContent = () => {
  const [tasks] = useState([
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
  const menuRef = useRef(null);

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

  const toggleMenu = (task) => {
    setMenuOpenTask((prev) => (prev === task ? null : task));
  };

  const closeMenu = () => {
    setMenuOpenTask(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
      {/* Contenedor con desplazamiento horizontal para listas de tareas */}
      <div className="flex space-x-6 pb-6">
        {/* Renderizar cada sección de tareas */}
        {['To Do', 'In Progress', 'Done', 'Review', 'Pending Approval', 'On Hold'].map((list) => (
          <div key={list} className="flex-shrink-0 w-80 relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">{list}</h3>
              <div className="relative">
                <button
                  onClick={() => toggleMenu(list)}
                  className="text-gray-400 hover:text-white focus:outline-none"
                >
                  <BiDotsVerticalRounded />
                </button>
                {menuOpenTask === list && (
                  <div
                    ref={menuRef}
                    className="absolute top-8 right-0 mt-2 w-40 bg-gray-800 rounded-md shadow-lg z-10"
                  >
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
            <div className="space-y-4">
              {tasks
                .filter((task) => task.list === list)
                .map((task, index) => (
                  <TaskCard key={index} task={task} />
                ))}
            </div>
          </div>
        ))}
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
