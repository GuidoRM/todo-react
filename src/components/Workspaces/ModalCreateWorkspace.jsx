import Modal from '../Modal';

const ModalCreateWorkspace = ({ isCreateOpen, closeCreateModal, newWorkspace, setNewWorkspace, handleCreateWorkspace }) => (
  <Modal isOpen={isCreateOpen} onClose={closeCreateModal}>
    <h3 className="text-xl font-semibold mb-4">Crear Nuevo Workspace</h3>
    <form onSubmit={handleCreateWorkspace}>
      <input
        type="text"
        placeholder="Nombre del Workspace"
        value={newWorkspace.nameWorkspace}
        onChange={(e) => setNewWorkspace({ ...newWorkspace, nameWorkspace: e.target.value })}
        className="w-full p-2 rounded-md mb-4 bg-gray-700 text-white"
      />
      <input
        type="text"
        placeholder="Descripción del Workspace"
        value={newWorkspace.descriptionWorkspace}
        onChange={(e) => setNewWorkspace({ ...newWorkspace, descriptionWorkspace: e.target.value })}
        className="w-full p-2 rounded-md mb-4 bg-gray-700 text-white"
      />
      <select
        value={newWorkspace.typeWorkspace}
        onChange={(e) => setNewWorkspace({ ...newWorkspace, typeWorkspace: e.target.value })}
        className="w-full p-2 rounded-md mb-4 bg-gray-700 text-white"
      >
        <option value="PRIVATE">Privado</option>
        <option value="PUBLIC">Público</option>
      </select>
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
);

export default ModalCreateWorkspace;
