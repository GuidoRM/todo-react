import React, { useState, useEffect, useRef } from 'react';
import { FaPaperclip, FaBell, FaCalendarAlt, FaEllipsisV } from 'react-icons/fa';
import useModal from '../hooks/useModal';
import Modal from './Modal';
import { format } from 'date-fns';
import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { AdvancedImage } from '@cloudinary/react';

// Cloudinary
const cld = new Cloudinary({ cloud: { cloudName: 'dlbzpeuww' } });

const TaskCard = ({ task, onDeleteTask, onUpdateTask }) => {
  const [labels, setLabels] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const [selectedTask, setSelectedTask] = useState(null);
  const { isOpen, openModal, closeModal } = useModal();

  const dateValue = new Date(task.due_Date);
  console.log(dateValue);
  const isValidDate = !isNaN(dateValue.getTime());

  const formattedDueDate = isValidDate ? format(new Date(task.due_Date), 'yyyy-MM-dd') : 'Fecha invalida';

  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          console.error('No se encontró el token de autenticación');
          return;
        }

        const response = await fetch(`http://localhost:8080/api/labels/tasks/${task.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener las etiquetas');
        }

        const data = await response.json();
        if (data.status === 200) {
          setLabels(data.data);
        } else {
          console.error('Error en la respuesta del servidor:', data);
        }
      } catch (error) {
        console.error('Error al obtener las etiquetas:', error);
      }
    };

    fetchLabels();
  }, [task.id]);

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleSaveClick = () => {
    onUpdateTask(editedTask);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedTask({ ...task });
  };

  const handleInputChange = (e) => {
    setEditedTask({
      ...editedTask,
      [e.target.name]: e.target.value
    });
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (onDeleteTask) {
      onDeleteTask(task.id);
    }
    setShowMenu(false);
  };

  // Modal
  const handleTaskClick = () => {
    setSelectedTask(task);
    openModal();
  };

  const handleCloseModal = () => {
    closeModal();
    setSelectedTask(null);
  }

  return (
    <div className="relative p-4 bg-gray-800 rounded-lg shadow-md">
      {isEditing ? (
        <div>
        <label className="block text-sm font-medium text-white">Título</label>
        <input 
          type="text" 
          name="title"
          value={editedTask.title} 
          onChange={handleInputChange} 
          className="w-full p-2 bg-gray-700 text-white rounded mb-2"
        />
        
        <label className="block text-sm font-medium text-white">Descripción</label>
        <textarea 
          name="description"
          value={editedTask.description || ''} 
          onChange={handleInputChange} 
          className="w-full p-2 bg-gray-700 text-white rounded mb-2"
          placeholder="Descripción de la tarea..."
        />
        
        <label className="block text-sm font-medium text-white">Prioridad</label>
        <select 
          name="priority" 
          value={task.priority} 
          onChange={handleInputChange} 
          className="mt-1 block w-full rounded-md bg-gray-700 text-white shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="1">Baja</option>
          <option value="2">Media</option>
          <option value="3">Alta</option>
        </select>
      
        <label className="block text-sm font-medium text-white mt-2">Estado</label>
        <select 
          name="status" 
          value={task.status} 
          onChange={handleInputChange} 
          className="mt-1 block w-full rounded-md bg-gray-700 text-white shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="pending">Pendiente</option>
          <option value="progress">En progreso</option>
          <option value="completed">Completada</option>
        </select>
      
        <label className="block text-sm font-medium text-white mt-2">Fecha de vencimiento</label>
        <input 
          type="datetime-local" 
          name="due_Date" 
          value={formattedDueDate} 
          onChange={handleInputChange} 
          className="mt-1 block w-full rounded-md bg-gray-700 text-white shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
        />
      
        <div className="flex justify-between mt-5">
          <button 
            className="flex bg-blue-500 text-white px-4 py-2 rounded" 
            onClick={handleSaveClick}
          >
            Guardar
          </button>
          <button 
            className="bg-gray-500 text-white px-4 py-2 rounded" 
            onClick={handleCancelClick}
          >
            Cancelar
          </button>
        </div>
      </div>
      ) : (
        <div>
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold cursor-pointer" onClick={handleTaskClick}>{task.title}</h4>
            <div className="relative">
              <button 
                ref={buttonRef}
                onClick={handleMenuToggle} 
                className="text-gray-400 hover:text-white focus:outline-none"
              >
                <FaEllipsisV />
              </button>
              {showMenu && (
                <div 
                  ref={menuRef} 
                  className="absolute right-0 mt-2 w-32 bg-gray-800 rounded-lg shadow-lg z-10"
                  style={{ top: '100%', right: '0' }}
                >
                  <button 
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-600" 
                    onClick={handleEditClick}
                  >
                    Editar
                  </button>
                  <button 
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-600" 
                    onClick={handleDeleteClick}
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-400 mb-2">{task.date}</p>
          {labels.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {labels.map((label) => (
                <span
                  key={label.id}
                  className="px-2 py-1 text-xs font-semibold rounded"
                  style={{ backgroundColor: label.colorHex, color: getContrastColor(label.colorHex) }}
                >
                  {label.title}
                </span>
              ))}
            </div>
          )}
          {task.status && task.status !== '' && (
            <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded mb-2">
              {task.status}
            </span>
          )}
        </div>
      )}
      {/* Modal */}
      {isOpen && selectedTask && (
        <Modal isOpen={isOpen} onClose={handleCloseModal}>
          <h2 className="text-lg font-bold text-white mb-2">{selectedTask.title}</h2>
          <p className="text-mt-2 mb-2 text-white">{selectedTask.description}</p>
          <p className="text-mt-2 mb-2 text-white"><strong>Prioridad:</strong> {selectedTask.priority}</p>
          {selectedTask.status && selectedTask.status !== '' && (
            <p className="text-mt-2 mb-2 text-white"><strong>Estado:</strong> {selectedTask.status}</p>
          )}
          <p className="text-mt-2 mb-2 text-white"><strong>Due Date:</strong> {formattedDueDate}</p>
          {labels.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2 text-white">
              <strong>Etiquetas:</strong>
              {labels.map((label) => (
                <span key={label.id} className="px-2 py-1 text-xs font-semibold rounded" style={{ backgroundColor: label.colorHex, color: getContrastColor(label.colorHex)}}>
                  {label.title}
                </span>
              ))}
            </div>
          )}
          {selectedTask.attachments && selectedTask.attachments.length > 0 && (
            <div className="mt-2">
              <strong>Adjuntos:</strong>
              <ul>
                {selectedTask.attachments.map((attachment, index) => (
                  <li key={index} className="text-sm text-gray-400">
                    <FaPaperclip className="inline mr-1" />
                    <AdvacedImage cldImg={img} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

// Función auxiliar para determinar el color del texto basado en el color de fondo
const getContrastColor = (hexColor) => {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? 'black' : 'white';
};

export default TaskCard;
