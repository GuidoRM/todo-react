import React, { useState, useEffect, useRef } from 'react';
import { FaPaperclip, FaBell, FaCalendarAlt, FaEllipsisV, FaTrash } from 'react-icons/fa';
import useModal from '../hooks/useModal';
import Modal from './Modal';
import { format } from 'date-fns';

const TaskCard = ({ task, onDeleteTask, onUpdateTask }) => {
  const [labels, setLabels] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });
  const [attachments, setAttachments] = useState(task.attachments || []);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const fileInputRef = useRef(null);

  const [selectedTask, setSelectedTask] = useState(null);
  const { isOpen, openModal, closeModal } = useModal();

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
          console.log("Etiquetas recibidas:", data.data);
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

  const handleSaveClick = async () => {
    const updatedTask = { ...editedTask, attachments };
    await onUpdateTask(updatedTask);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedTask({ ...task });
    setAttachments(task.attachments || []);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'due_Date') {
      const date = new Date(value);
      const dateArray = [
        date.getFullYear(),
        date.getMonth() + 1, // Los meses son 0-indexados, así que sumamos 1
        date.getDate(),
        date.getHours(),
        date.getMinutes()
      ];
      setEditedTask({
        ...editedTask,
        [name]: dateArray
      });
    } else {
      setEditedTask({
        ...editedTask,
        [name]: value
      });
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (onDeleteTask) {
      onDeleteTask(task.id);
    }
    setShowMenu(false);
  };

  const handleTaskClick = () => {
    setSelectedTask(task);
    openModal();
  };

  const handleCloseModal = () => {
    closeModal();
    setSelectedTask(null);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));
    setAttachments([...attachments, ...newAttachments]);
  };

  const handleRemoveAttachment = (index) => {
    const newAttachments = attachments.filter((_, i) => i !== index);
    setAttachments(newAttachments);
  };

  // Fecha formateada
  const formatDate = (dateInput) => {
    console.log('Tipo de dateInput:', typeof dateInput, 'Valor:', dateInput);
  
    if (!dateInput) {
      return 'Fecha no especificada';
    }
  
    let date;
  
    if (Array.isArray(dateInput) && dateInput.length === 5) {
      // Si es un array, asumimos que está en el formato [año, mes, día, hora, minuto]
      // Nota: Los meses en JavaScript son 0-indexados, por lo que restamos 1 al mes
      date = new Date(dateInput[0], dateInput[1] - 1, dateInput[2], dateInput[3], dateInput[4]);
    } else if (typeof dateInput === 'string' || typeof dateInput === 'number') {
      // Si es una cadena o número, intentamos crear una fecha directamente
      date = new Date(dateInput);
    } else if (dateInput instanceof Date) {
      // Si ya es un objeto Date, lo usamos directamente
      date = dateInput;
    } else {
      console.error('Formato de fecha no reconocido:', dateInput);
      return 'Formato de fecha inválido';
    }
  
    if (isNaN(date.getTime())) {
      console.error('Fecha inválida:', dateInput);
      return 'Fecha inválida';
    }
  
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formattedDueDate = formatDate(task.due_Date);

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
            value={editedTask.priority} 
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
            value={editedTask.status} 
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
            value={editedTask.due_Date ? new Date(
              editedTask.due_Date[0],
              editedTask.due_Date[1] - 1,
              editedTask.due_Date[2],
              editedTask.due_Date[3],
              editedTask.due_Date[4]
            ).toISOString().slice(0, 16) : ''} 
            onChange={handleInputChange} 
            className="mt-1 block w-full rounded-md bg-gray-700 text-white shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
          />

          <label className="block text-sm font-medium text-white mt-2">Adjuntos</label>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileUpload} 
            multiple 
            className="hidden"
          />
          <button 
            onClick={() => fileInputRef.current.click()} 
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
          >
            Agregar archivos
          </button>

          {attachments.map((attachment, index) => (
            <div key={index} className="flex items-center mt-2">
              <img src={attachment.preview} alt={attachment.name} className="w-10 h-10 object-cover mr-2" />
              <span className="text-white truncate block">{attachment.name}</span>
              <button 
                onClick={() => handleRemoveAttachment(index)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        
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
            <h4 className="text-lg font-semibold text-white cursor-pointer" onClick={handleTaskClick}>{task.title}</h4>
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
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600" 
                    onClick={handleEditClick}
                  >
                    Editar
                  </button>
                  <button 
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600" 
                    onClick={handleDeleteClick}
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-400 mb-2">Fecha de vencimiento: {formattedDueDate}</p>
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
          {attachments.length > 0 && (
            <div className="mt-2">
              <FaPaperclip className="inline mr-1 text-gray-400" />
              <span className="text-sm text-gray-400">{attachments.length} adjunto(s)</span>
            </div>
          )}
        </div>
      )}
      {isOpen && selectedTask && (
        <Modal isOpen={isOpen} onClose={handleCloseModal}>
          <h2 className="text-lg font-bold text-white mb-2">{selectedTask.title}</h2>
          <p className="text-mt-2 mb-2 text-white">{selectedTask.description}</p>
          <p className="text-mt-2 mb-2 text-white"><strong>Prioridad:</strong> {selectedTask.priority}</p>
          {selectedTask.status && selectedTask.status !== '' && (
            <p className="text-mt-2 mb-2 text-white"><strong>Estado:</strong> {selectedTask.status}</p>
          )}
          <p className="text-mt-2 mb-2 text-white"><strong>Fecha de vencimiento:</strong> {formattedDueDate}</p>
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
          {attachments.length > 0 && (
            <div className="mt-2">
              <strong className="text-white">Adjuntos:</strong>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {attachments.map((attachment, index) => (
                  <div key={index} className="relative">
                    <img src={attachment.preview} alt={attachment.name} className="w-full h-24 object-cover rounded" />
                    <span className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                      {attachment.name}
                    </span>
                  </div>
                ))}
              </div>
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