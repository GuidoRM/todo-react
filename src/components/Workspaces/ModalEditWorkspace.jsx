import Modal from '../Modal';

const ModalEditWorkspace = ({ isEditOpen, closeEditModal, editWorkspace, setEditWorkspace, handleUpdateWorkspace }) => (
  <Modal isOpen={isEditOpen} onClose={closeEditModal}>
    <h3 className="text-xl font-semibold mb-4">Editar Workspace</h3>
    <form onSubmit={handleUpdateWorkspace}>
      <input
        type="text"
        value={editWorkspace.nameWorkspace}
        onChange={(e) => setEditWorkspace({ ...editWorkspace, nameWorkspace: e.target.value })}
        className="w-full p-2 rounded-md mb-4 bg-gray-700 text-white"
      />
      <input
        type="text"
        value={editWorkspace.descriptionWorkspace}
        onChange={(e) => setEditWorkspace({ ...editWorkspace, descriptionWorkspace: e.target.value })}
        className="w-full p-2 rounded-md mb-4 bg-gray-700 text-white"
      />
      <select
        value={editWorkspace.typeWorkspace}
        onChange={(e) => setEditWorkspace({ ...editWorkspace, typeWorkspace: e.target.value })}
        className="w-full p-2 rounded-md mb-4 bg-gray-700 text-white"
      >
        <option value="PRIVATE">Privado</option>
        <option value="PUBLIC">Público</option>
      </select>
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
);

export default ModalEditWorkspace;
