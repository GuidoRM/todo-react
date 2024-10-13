import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import useModal from '../hooks/useModal';
import TaskCard from '../components/TaskCard';
import useFetch from '../hooks/useFetch';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import TaskList from './TaskList';
import { AiOutlinePlus } from 'react-icons/ai';

const WorkspaceContent = ({ idWorkspace, reloadTrigger }) => {
  const [menuOpenList, setMenuOpenList] = useState(null);
  const [selectedList, setSelectedList] = useState(null);
  const { data, loading, error, fetchData } = useFetch();

  const {
    isOpen: isEditListOpen,
    openModal: openEditListModal,
    closeModal: closeEditListModal,
  } = useModal();

  const {
    isOpen: isDeleteListOpen,
    openModal: openDeleteListModal,
    closeModal: closeDeleteListModal,
  } = useModal();

  const {
    isOpen: isAddListOpen,
    openModal: openAddListModal,
    closeModal: closeAddListModal,
  } = useModal();

  useEffect(() => {
    if (idWorkspace) {
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

  const toggleMenu = (list) => {
    setMenuOpenList((prev) => (prev === list ? null : list));
  };

  const closeMenu = () => {
    setMenuOpenList(null);
  };

  const handleEditList = (list) => {
    setSelectedList(list);
    closeMenu();
    openEditListModal();
  };

  const handleDeleteList = (list) => {
    setSelectedList(list);
    closeMenu();
    openDeleteListModal();
  };

  const handleAddList = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('authToken');
    const title = event.target.elements.title.value;
    const description = event.target.elements.description.value;

    try {
      const response = await fetch('http://localhost:8080/api/lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          id_Workspace: idWorkspace,
        }),
      });

      if (response.ok) {
        closeAddListModal();
        refreshLists();
      } else {
        console.error('Error al crear la lista');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEditListSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('authToken');
    const title = event.target.elements.title.value;
    const description = event.target.elements.description.value;

    try {
      const response = await fetch(`http://localhost:8080/api/lists/${selectedList.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          id_Workspace: idWorkspace,
        }),
      });

      if (response.ok) {
        closeEditListModal();
        refreshLists();
      } else {
        console.error('Error al editar la lista');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteListConfirm = async () => {
    const token = localStorage.getItem('authToken');

    try {
      const response = await fetch(`http://localhost:8080/api/lists/${selectedList.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        closeDeleteListModal();
        refreshLists();
      } else {
        console.error('Error al eliminar la lista');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const refreshLists = () => {
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
  };

  return (
    <main className="flex-1 p-6 overflow-x-auto">
      {loading && <p className="text-sm text-gray-400">Cargando listas...</p>}
      {error && <p className="text-sm text-red-500">Error: {error}</p>}
      <div className="flex space-x-6 pb-6">
        {data?.data && Array.isArray(data.data) ? (
          <>
            {data.data.map((list) => (
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
                    {menuOpenList === list && (
                      <div className="absolute top-8 right-0 mt-2 w-40 bg-gray-800 rounded-md shadow-lg z-10">
                        <ul className="py-2">
                          <li
                            className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                            onClick={() => handleEditList(list)}
                          >
                            Editar
                          </li>
                          <li
                            className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                            onClick={() => handleDeleteList(list)}
                          >
                            Eliminar
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                <TaskList key={list.id + " listId " + list.title} listId={list.id} reloadTrigger={reloadTrigger} />
              </div>
            ))}
            <div className="flex-shrink-0 w-80 h-[150px] mt-[2.8rem] border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors duration-300" onClick={openAddListModal}>
              <AiOutlinePlus className="text-4xl text-gray-600 mb-2" />
              <span className="text-gray-600 text-lg">Agregar lista</span>
            </div>
          </>
        ) : (
          <p>No se encontraron listas</p>
        )}
      </div>

      {/* Modal para agregar nueva lista */}
      <Modal isOpen={isAddListOpen} onClose={closeAddListModal}>
        <h3 className="text-xl font-semibold mb-4">Agregar Nueva Lista</h3>
        <form onSubmit={handleAddList}>
          <input
            type="text"
            name="title"
            placeholder="Nombre de la lista"
            className="w-full p-2 rounded-md mb-4 bg-gray-700 text-white"
            required
          />
          <textarea
            name="description"
            placeholder="Descripción de la lista"
            className="w-full p-2 rounded-md mb-4 bg-gray-700 text-white"
            rows="3"
          ></textarea>
          <div className="flex justify-end">
            <button type="button" onClick={closeAddListModal} className="bg-gray-600 px-4 py-2 rounded-md mr-2">
              Cancelar
            </button>
            <button type="submit" className="bg-indigo-600 px-4 py-2 rounded-md">
              Crear Lista
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal de Edición de Lista */}
      <Modal isOpen={isEditListOpen} onClose={closeEditListModal}>
        <h3 className="text-xl font-semibold mb-4">Editar Lista</h3>
        <form onSubmit={handleEditListSubmit}>
          <input
            type="text"
            name="title"
            defaultValue={selectedList?.title}
            className="w-full p-2 rounded-md mb-4 bg-gray-700 text-white"
            required
          />
          <textarea
            name="description"
            defaultValue={selectedList?.description}
            className="w-full p-2 rounded-md mb-4 bg-gray-700 text-white"
            rows="3"
          ></textarea>
          <div className="flex justify-end">
            <button type="button" onClick={closeEditListModal} className="bg-gray-600 px-4 py-2 rounded-md mr-2">
              Cancelar
            </button>
            <button type="submit" className="bg-indigo-600 px-4 py-2 rounded-md">
              Guardar Cambios
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal de Eliminación de Lista */}
      <Modal isOpen={isDeleteListOpen} onClose={closeDeleteListModal}>
        <h3 className="text-xl font-semibold mb-4">Eliminar Lista</h3>
        <p>¿Estás seguro de que deseas eliminar la lista "{selectedList?.title}"?</p>
        <div className="flex justify-end mt-4">
          <button type="button" onClick={closeDeleteListModal} className="bg-gray-600 px-4 py-2 rounded-md mr-2">
            Cancelar
          </button>
          <button type="button" onClick={handleDeleteListConfirm} className="bg-red-600 px-4 py-2 rounded-md">
            Eliminar
          </button>
        </div>
      </Modal>
    </main>
  );
};

export default WorkspaceContent;