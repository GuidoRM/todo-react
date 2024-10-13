import { BiPlus } from 'react-icons/bi';
import Sidebar from '../components/Sidebar';
import { useState, useEffect } from 'react';
import useModal from '../hooks/useModal';
import WorkspaceContent from '../components/WorkspaceContent';
import { useAuth } from '../AuthContext';
import useFetch from '../hooks/useFetch'; // Importar el hook personalizado
import { v4 as uuidv4 } from 'uuid'; // Importar uuid para generar códigos de acceso
import WorkspacesList from '../components/Workspaces/WorkspacesList';
import WorkspaceHeader from '../components/Workspaces/WorkspaceHeader';
import ModalCreateWorkspace from '../components/Workspaces/ModalCreateWorkspace';
import ModalEditWorkspace from '../components/Workspaces/ModalEditWorkspace';
import Modal from '../components/Modal'; // Modal reutilizable

function Home() {
  const { isAuthenticated, userId } = useAuth(); // Obtenemos el id del usuario del contexto de autenticación
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [menuOpenWorkspace, setMenuOpenWorkspace] = useState(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [newWorkspace, setNewWorkspace] = useState({
    nameWorkspace: '',
    descriptionWorkspace: '',
    typeWorkspace: 'PRIVATE',
  });
  const [editWorkspace, setEditWorkspace] = useState({
    nameWorkspace: '',
    descriptionWorkspace: '',
    typeWorkspace: 'PRIVATE',
    accessCode: '',
  });

  const { isOpen: isCreateOpen, openModal: openCreateModal, closeModal: closeCreateModal } = useModal();
  const { isOpen: isEditOpen, openModal: openEditModal, closeModal: closeEditModal } = useModal();
  const { isOpen: isDeleteOpen, openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal();

  const { data, loading, error, fetchData } = useFetch();

  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem('authToken'); // Obtenemos el token desde localStorage
      fetchData(`http://localhost:8080/api/workspaces/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Incluimos el token en el header
        },
      });
    }
  }, [isAuthenticated, userId, fetchData]);

  useEffect(() => {
    if (Array.isArray(data?.data)) {
      setWorkspaces(data?.data);
      setSelectedWorkspace(data?.data[data?.data.length - 1]);
    }
  }, [data, userId]);

  const handleEditWorkspace = (workspace) => {
    setEditWorkspace({
      nameWorkspace: workspace.nameWorkspace,
      descriptionWorkspace: workspace.descriptionWorkspace,
      typeWorkspace: workspace.typeWorkspace,
      accessCode: workspace.accessCode,
    });
    setSelectedWorkspace(workspace);
    closeMenu();
    openEditModal();
  };

  const handleDeleteWorkspace = async () => {
    const token = localStorage.getItem('authToken');
    try {
      await fetch(`http://localhost:8080/api/workspaces/${selectedWorkspace.idWorkspace}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      setWorkspaces(workspaces.filter(workspace => workspace.idWorkspace !== selectedWorkspace.idWorkspace));
      setSelectedWorkspace(workspaces.length > 1 ? workspaces[0] : null);
      closeDeleteModal();
    } catch (err) {
      console.error('Error al eliminar el workspace:', err);
    }
  };

  const toggleMenu = (workspace) => {
    setMenuOpenWorkspace((prev) => (prev === workspace ? null : workspace));
  };

  const closeMenu = () => {
    setMenuOpenWorkspace(null);
  };

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    const accessCode = uuidv4().slice(0, 8); // Generar un código de acceso aleatorio de 8 caracteres

    const workspaceData = {
      ...newWorkspace,
      accessCode,
    };

    try {
      const response = await fetch(`http://localhost:8080/api/workspaces/user/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(workspaceData),
      });
      const createdWorkspace = await response.json();
      setWorkspaces((prevWorkspaces) => [...prevWorkspaces, createdWorkspace.data]);
      setSelectedWorkspace(createdWorkspace.data);
      closeCreateModal();
    } catch (err) {
      console.error('Error al crear el workspace:', err);
    }
  };

  const handleUpdateWorkspace = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
  
    // Guardar el ID del workspace actual
    const currentWorkspaceId = selectedWorkspace.idWorkspace;
  
    try {
      // Actualizar el workspace
      const updateResponse = await fetch(`http://localhost:8080/api/workspaces/${currentWorkspaceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editWorkspace),
      });
  
      if (!updateResponse.ok) {
        throw new Error('Failed to update workspace');
      }
  
      // Obtener el workspace actualizado
      const updatedWorkspaceResponse = await fetch(`http://localhost:8080/api/workspaces/${currentWorkspaceId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!updatedWorkspaceResponse.ok) {
        throw new Error('Failed to fetch updated workspace');
      }
  
      const updatedWorkspace = await updatedWorkspaceResponse.json();
  
      // Actualizar el estado local
      setWorkspaces(prevWorkspaces => 
        prevWorkspaces.map(workspace => 
          workspace.idWorkspace === currentWorkspaceId ? updatedWorkspace.data : workspace
        )
      );
      setSelectedWorkspace(updatedWorkspace.data);
  
      // Cerrar el modal
      closeEditModal();
  
    } catch (err) {
      console.error('Error al actualizar el workspace:', err);
      // Aquí podrías manejar el error, por ejemplo, mostrando un mensaje al usuario
    }
  };

  const handleTaskCreated = () => {
    console.log("ASDASD: "+reloadTrigger)
    setReloadTrigger(prev => prev + 1);
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white overflow-hidden w-full">
      <Sidebar />

      <div className="w-64 flex-shrink-0 p-4 bg-gray-850 border-r border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Mis Workspaces</h2>

        {loading && <p className="text-sm text-gray-400">Cargando workspaces...</p>}
        {error && <p className="text-sm text-red-500">Error: {error}</p>}
        <WorkspacesList
          workspaces={workspaces}
          selectedWorkspace={selectedWorkspace}
          setSelectedWorkspace={setSelectedWorkspace}
          toggleMenu={toggleMenu}
          menuOpenWorkspace={menuOpenWorkspace}
          handleEditWorkspace={handleEditWorkspace}
          handleDeleteWorkspace={handleDeleteWorkspace}
        />

        <div className="p-4 border-t border-gray-700 mt-4">
          <button
            className="flex items-center w-full text-left text-white bg-indigo-600 p-3 rounded-md hover:bg-indigo-700"
            onClick={openCreateModal}
          >
            <BiPlus className="mr-2 h-5 w-5" /> Nuevo Workspace
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <WorkspaceHeader  idWorkspace={selectedWorkspace?.idWorkspace} onTaskCreated={handleTaskCreated}/>
        <WorkspaceContent reloadTrigger={reloadTrigger} idWorkspace={selectedWorkspace?.idWorkspace} />
      </div>

      <ModalCreateWorkspace
        isCreateOpen={isCreateOpen}
        closeCreateModal={closeCreateModal}
        newWorkspace={newWorkspace}
        setNewWorkspace={setNewWorkspace}
        handleCreateWorkspace={handleCreateWorkspace}
      />

      <ModalEditWorkspace
        isEditOpen={isEditOpen}
        closeEditModal={closeEditModal}
        editWorkspace={editWorkspace}
        setEditWorkspace={setEditWorkspace}
        handleUpdateWorkspace={handleUpdateWorkspace}
      />

      <Modal isOpen={isDeleteOpen} onClose={closeDeleteModal}>
        <h3 className="text-xl font-semibold mb-4">Eliminar Workspace</h3>
        <p>¿Estás seguro de que deseas eliminar el workspace "{selectedWorkspace?.nameWorkspace}"?</p>
        <div className="flex justify-end mt-4">
          <button type="button" onClick={closeDeleteModal} className="bg-gray-600 px-4 py-2 rounded-md mr-2">
            Cancelar
          </button>
          <button type="button" onClick={handleDeleteWorkspace} className="bg-red-600 px-4 py-2 rounded-md">
            Eliminar
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default Home;
