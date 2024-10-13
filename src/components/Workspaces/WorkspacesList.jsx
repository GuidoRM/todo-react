import { BiDotsVerticalRounded } from 'react-icons/bi';

const WorkspacesList = ({ workspaces, selectedWorkspace, setSelectedWorkspace, toggleMenu, menuOpenWorkspace, handleEditWorkspace, handleDeleteWorkspace }) => (
  <ul className="space-y-3">
    {workspaces?.map((workspace, index) => (
      <li
        onClick={() => setSelectedWorkspace(workspace)}
        key={index}
        className={`relative p-3 rounded-md flex items-center justify-between ${selectedWorkspace?.idWorkspace === workspace.idWorkspace ? 'bg-cyan-600' : 'bg-gray-700'}`}
      >
        <span>{workspace?.nameWorkspace || 'Workspace sin nombre'}</span>
        {selectedWorkspace?.idWorkspace === workspace.idWorkspace && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleMenu(workspace);
            }}
            className="text-gray-400 hover:text-white focus:outline-none ml-2"
          >
            <BiDotsVerticalRounded />
          </button>
        )}
        {menuOpenWorkspace === workspace && (
          <div className="absolute top-0 right-0 mt-10 w-40 bg-gray-800 rounded-md shadow-lg z-10">
            <ul className="py-2">
              <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={() => handleEditWorkspace(workspace)}>
                Editar
              </li>
              <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={handleDeleteWorkspace}>
                Eliminar
              </li>
            </ul>
          </div>
        )}
      </li>
    ))}
  </ul>
);

export default WorkspacesList;