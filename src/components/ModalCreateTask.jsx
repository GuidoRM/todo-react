import React, { useEffect, useState, useCallback } from 'react';
import Modal from './Modal';

const ModalCreateTask = ({ isOpen, onClose, idWorkspace, onTaskCreated, setIsModalOpen }) => {
  const [task, setTask] = useState({
    title: '',
    description: '',
    priority: 1,
    status: 'pending',
    due_Date: '',
    id_List: ''
  });
  const [lists, setLists] = useState([]);
  const [labels, setLabels] = useState([]);
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [newLabel, setNewLabel] = useState({ title: '', colorHex: '#000000' });
  const [editingLabel, setEditingLabel] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(''); // 'idle', 'loading', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const fetchLists = useCallback(async () => {
    if (!idWorkspace) return;
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:8080/api/lists/workspace/${idWorkspace}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.status === 200) {
        setLists(data.data);
      }
    } catch (error) {
      console.error('Error fetching lists:', error);
    }
  }, [idWorkspace]);

  const fetchLabels = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:8080/api/labels', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.status === 200) {
        setLabels(data.data);
      }
    } catch (error) {
      console.error('Error fetching labels:', error);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchLists();
      fetchLabels();
    }
  }, [isOpen, fetchLists, fetchLabels]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask(prevTask => ({ ...prevTask, [name]: value }));
  };

  const handleLabelChange = (e) => {
    const { name, value } = e.target;
    setNewLabel(prevLabel => ({ ...prevLabel, [name]: value }));
  };

  const handleCreateLabel = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:8080/api/labels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newLabel)
      });
      const data = await response.json();
      if (data.status === 201) {
        setLabels(prevLabels => [...prevLabels, data.data]);
        setNewLabel({ title: '', colorHex: '#000000' });
      }
    } catch (error) {
      console.error('Error creating label:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmitStatus('loading');
    setErrorMessage('');

    try {
      const formattedTask = {
        ...task,
        due_Date: task.due_Date ? new Date(task.due_Date).toISOString() : null,
        priority: parseInt(task.priority),
        id_List: parseInt(task.id_List)
      };

      console.log('Iniciando creación de tarea:', formattedTask);

      const createdTask = await Promise.race([
        handleCreateTask(formattedTask),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000))
      ]);

      if (createdTask) {
        console.log('Tarea creada, asignando etiquetas...');
        await assignLabelsToTask(createdTask.id);
        setSubmitStatus('success');
        console.log('Proceso completado con éxito');
        onTaskCreated();
        setTimeout(() => {
          setIsModalOpen(false);
          setSubmitStatus('idle');
        }, 1000);
      }
    } catch (error) {
      console.error('Error en la creación de la tarea:', error);
      setSubmitStatus('error');
      setErrorMessage(error.message || 'Ocurrió un error al crear la tarea');
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleCreateTask = async (taskData) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }

    const response = await fetch('http://localhost:8080/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(taskData)
    });

    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status}`);
    }

    const data = await response.json();
    console.log('Respuesta de creación de tarea:', data);
    return data.data;
  };

  const assignLabelsToTask = async (taskId) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }

    for (const labelId of selectedLabels) {
      const response = await fetch(`http://localhost:8080/api/labels/${labelId}/tasks/${taskId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error(`Error al asignar la etiqueta ${labelId} a la tarea ${taskId}`);
      }

      console.log(`Etiqueta ${labelId} asignada a la tarea ${taskId}`);
    }
  };


  const toggleLabelSelection = (labelId) => {
    setSelectedLabels(prev =>
      prev.includes(labelId) ? prev.filter(id => id !== labelId) : [...prev, labelId]
    );
  };

  const handleDeleteSelectedLabels = async () => {
    const token = localStorage.getItem('authToken');
    if (!selectedLabels.length || !token) return;

    for (const labelId of selectedLabels) {
      try {
        const response = await fetch(`http://localhost:8080/api/labels/${labelId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
          throw new Error(`Error deleting label with ID ${labelId}`);
        }
      } catch (error) {
        console.error('Error deleting label:', error);
      }
    }

    setLabels(prevLabels => prevLabels.filter(label => !selectedLabels.includes(label.id)));
    setSelectedLabels([]);
  };

  const startEditingLabel = (labelId) => {
    const labelToEdit = labels.find(label => label.id === labelId);
    setEditingLabel(labelToEdit);
  };

  const handleEditLabel = async () => {
    if (!editingLabel) return;

    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No authentication token found');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/labels/${editingLabel.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: editingLabel.title,
          colorHex: editingLabel.colorHex
        })
      });

      if (!response.ok) {
        throw new Error('Error updating label');
      }

      const updatedLabel = await response.json();
      setLabels(prevLabels => prevLabels.map(label =>
        label.id === updatedLabel.data.id ? updatedLabel.data : label
      ));
      setEditingLabel(null);
    } catch (error) {
      console.error('Error updating label:', error);
    }
  };

  // Utility function to determine text color based on background color
  const getContrastColor = (hexColor) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose} className='max-w-6xl bg-gray-900 p-6 rounded-lg'>
      <h2 className="text-3xl font-bold mb-6 text-white border-b border-gray-700 pb-3">Crear Nueva Tarea</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex gap-6">
          {/* Columna izquierda: Creación de tarea */}
          <div className="flex-1 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Título</label>
              <input
                type="text"
                name="title"
                value={task.title}
                onChange={handleChange}
                className="w-full p-2 rounded-md bg-gray-800 border-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Descripción</label>
              <textarea
                name="description"
                value={task.description}
                onChange={handleChange}
                className="w-full p-2 rounded-md bg-gray-800 border-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                rows="4"
              ></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Prioridad</label>
                <select
                  name="priority"
                  value={task.priority}
                  onChange={handleChange}
                  className="w-full p-2 rounded-md bg-gray-800 border-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                  <option value="1">Baja</option>
                  <option value="2">Media</option>
                  <option value="3">Alta</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Estado</label>
                <select
                  name="status"
                  value={task.status}
                  onChange={handleChange}
                  className="w-full p-2 rounded-md bg-gray-800 border-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                  <option value="pending">Pendiente</option>
                  <option value="progress">En progreso</option>
                  <option value="completed">Completada</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Fecha de vencimiento</label>
              <input
                type="datetime-local"
                name="due_Date"
                value={task.due_Date}
                onChange={handleChange}
                className="w-full p-2 rounded-md bg-gray-800 border-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Lista</label>
              <select
                name="id_List"
                value={task.id_List}
                onClick={fetchLists}
                onChange={handleChange}
                className="w-full p-2 rounded-md bg-gray-800 border-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              >
                <option value="">Selecciona una lista</option>
                {lists.map(list => (
                  <option key={list.id} value={list.id}>{list.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Lista de etiquetas */}
          <div className="flex-1 space-y-6 border-l border-gray-700 pl-6">

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Etiquetas</label>


              {/* Muestra las etiquetas */}
              <div className="mt-4 flex flex-wrap gap-2">
                {labels.map(label => (
                  <button
                    key={label.id}
                    type="button"
                    onClick={() => toggleLabelSelection(label.id)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition duration-150 ease-in-out ${selectedLabels.includes(label.id) ? 'ring-2 ring-offset-2 ring-indigo-500' : ''
                      }`}
                    style={{ backgroundColor: label.colorHex, color: getContrastColor(label.colorHex) }}
                  >
                    {label.title}
                  </button>
                ))}
              </div>

              {/* Formulario de edición de etiqueta */}
              {editingLabel && (
                <div className="mt-4 p-4 bg-gray-800 rounded-md">
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Editar Etiqueta</h3>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      name="title"
                      value={editingLabel.title}
                      onChange={(e) => setEditingLabel({ ...editingLabel, title: e.target.value })}
                      className="flex-grow p-2 rounded-md bg-gray-700 border-gray-600 text-white"
                    />
                    <input
                      type="color"
                      name="colorHex"
                      value={editingLabel.colorHex}
                      onChange={(e) => setEditingLabel({ ...editingLabel, colorHex: e.target.value })}
                      className="rounded"
                    />
                    <button
                      type="button"
                      onClick={handleEditLabel}
                      className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-150 ease-in-out"
                    >
                      Guardar Cambios
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={handleDeleteSelectedLabels}
                  className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-150 ease-in-out"
                >
                  Eliminar Etiquetas
                </button>

                {selectedLabels.length === 1 && (
                  <button
                    type="button"
                    onClick={() => startEditingLabel(selectedLabels[0])}
                    className="px-3 py-1 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition duration-150 ease-in-out"
                  >
                    Editar Etiqueta
                  </button>
                )}
              </div>
            </div>

            {/* Formulario para crear nueva etiqueta */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-300 mb-2">Crear Nueva Etiqueta</h3>
              <div className="flex items-center mt-2 space-x-2">
                <input
                  type="text"
                  name="title"
                  value={newLabel.title}
                  onChange={handleLabelChange}
                  placeholder="Título de la etiqueta"
                  className="p-2 flex-grow rounded-md bg-gray-800 border-gray-700 text-white"
                />
                <input
                  type="color"
                  name="colorHex"
                  value={newLabel.colorHex}
                  onChange={handleLabelChange}
                  className="rounded"
                />
                <button
                  type="button"
                  onClick={handleCreateLabel}
                  className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-150 ease-in-out"
                >
                  Crear
                </button>
              </div>
            </div>
          </div>
        </div>

        

        <div className="flex justify-end gap-4 pt-6 border-t border-gray-700">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              ${submitStatus === 'loading' ? 'bg-yellow-600' :
              submitStatus === 'success' ? 'bg-green-600' :
                submitStatus === 'error' ? 'bg-red-600' : 'bg-indigo-600'}
              hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out
              ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {submitStatus === 'loading' ? 'Creando...' :
            submitStatus === 'success' ? 'Creado!' :
              submitStatus === 'error' ? 'Error' : 'Crear Tarea'}
        </button>

        <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            disabled={isSubmitting}
          >
            Cancelar
          </button>

        </div>
        {errorMessage && (
          <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
        )}

        
      </form>
    </Modal>
  );
};

// Utility function to determine text color based on background color
const getContrastColor = (hexColor) => {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? 'black' : 'white';
};

export default ModalCreateTask;
