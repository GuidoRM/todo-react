import { BiPlus, BiDotsVerticalRounded } from 'react-icons/bi';
import Sidebar from '../components/Sidebar';
import { useState, useEffect, useRef } from 'react';
import useModal from '../hooks/useModal';
import Modal from '../components/Modal';
import WorkspaceContent from '../components/WorkspaceContent';

function Home() {
  // Estados de los workspaces y las tareas
  const [workspaces] = useState(['Project A', 'Project B', 'Project C']);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [menuOpenWorkspace, setMenuOpenWorkspace] = useState(null);

  const { isOpen: isCreateOpen, openModal: openCreateModal, closeModal: closeCreateModal } = useModal();
  const { isOpen: isEditOpen, openModal: openEditModal, closeModal: closeEditModal } = useModal();
  const { isOpen: isDeleteOpen, openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal();

  const handleEditWorkspace = (workspace) => {
    setSelectedWorkspace(workspace);
    closeMenu(); // Cerramos el menú antes de abrir el modal
    openEditModal();
  };

  const handleDeleteWorkspace = (workspace) => {
    setSelectedWorkspace(workspace);
    closeMenu(); // Cerramos el menú antes de abrir el modal
    openDeleteModal();
  };

  const toggleMenu = (workspace) => {
    setMenuOpenWorkspace((prev) => (prev === workspace ? null : workspace));
  };

  const closeMenu = () => {
    setMenuOpenWorkspace(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white overflow-hidden w-full">
      <Sidebar />
      {/* Workspaces del Usuario */}
      <div className="w-64 flex-shrink-0 p-4 bg-gray-850 border-r border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Mis Workspaces</h2>
        <ul className="space-y-3">
          {workspaces.map((workspace, index) => (
            <li key={index} className="relative p-3 bg-gray-700 rounded-md flex items-center justify-between">
              <span>{workspace}</span>
              <button
                onClick={() => toggleMenu(workspace)}
                className="text-gray-400 hover:text-white focus:outline-none ml-2"
              >
                <BiDotsVerticalRounded />
              </button>

              {/* Menú desplegable */}
              {menuOpenWorkspace === workspace && (
                <div
                  className="absolute top-0 right-0 mt-10 w-40 bg-gray-800 rounded-md shadow-lg z-10"
                  onMouseLeave={closeMenu} // Ocultar el menú al dejar de estar sobre él
                >
                  <ul className="py-2">
                    <li
                      className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                      onClick={() => handleEditWorkspace(workspace)}
                    >
                      Editar
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                      onClick={() => handleDeleteWorkspace(workspace)}
                    >
                      Eliminar
                    </li>
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
        <div className="p-4 border-t border-gray-700 mt-4">
          <button
            className="flex items-center w-full text-left text-white bg-indigo-600 p-3 rounded-md hover:bg-indigo-700"
            onClick={openCreateModal}
          >
            <BiPlus className="mr-2 h-5 w-5" /> Nuevo Workspace
          </button>
        </div>
      </div>

      {/* Modal de Creación de Workspace */}
      <Modal isOpen={isCreateOpen} onClose={closeCreateModal}>
        <h3 className="text-xl font-semibold mb-4">Crear Nuevo Workspace</h3>
        <form>
          <input
            type="text"
            placeholder="Nombre del Workspace"
            className="w-full p-2 rounded-md mb-4 bg-gray-700 text-white"
          />
          <div className="flex justify-end">
            <button type="button" onClick={closeCreateModal} className="bg-gray-600 px-4 py-2 rounded-md mr-2">
              Cancelar
            </button>
            <button type="submit" className="bg-indigo-600 px-4 py-2 rounded-md">
              Crear
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal de Edición de Workspace */}
      <Modal isOpen={isEditOpen} onClose={closeEditModal}>
        <h3 className="text-xl font-semibold mb-4">Editar Workspace</h3>
        <form>
          <input
            type="text"
            defaultValue={selectedWorkspace}
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

      {/* Modal de Eliminación de Workspace */}
      <Modal isOpen={isDeleteOpen} onClose={closeDeleteModal}>
        <h3 className="text-xl font-semibold mb-4">Eliminar Workspace</h3>
        <p>¿Estás seguro de que deseas eliminar el workspace "{selectedWorkspace}"?</p>
        <div className="flex justify-end mt-4">
          <button type="button" onClick={closeDeleteModal} className="bg-gray-600 px-4 py-2 rounded-md mr-2">
            Cancelar
          </button>
          <button type="button" className="bg-red-600 px-4 py-2 rounded-md">
            Eliminar
          </button>
        </div>
      </Modal>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Fijo */}
        <header className="flex justify-between items-center p-6 bg-gray-800 shadow-md">
          <h2 className="text-3xl font-bold">Tareas</h2>
          <button className="bg-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-700">Nueva Tarea</button>
        </header>

        {/* Área Principal con Listas de Tareas */}
        <WorkspaceContent/>
      </div>
    </div>
  );
}

export default Home;
