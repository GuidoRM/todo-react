import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (idWorkspace) {
      fetchLists();
      fetchLabels();
    }
  }, [idWorkspace]);

  const fetchLists = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:8080/api/lists/workspace/${idWorkspace}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.status === 200) {
        setLists(data.data);
      }
    } catch (error) {
      console.error('Error fetching lists:', error);
    }
  };

  const fetchLabels = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:8080/api/labels', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.status === 200) {
        setLabels(data.data);
      }
    } catch (error) {
      console.error('Error fetching labels:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask(prevTask => ({
      ...prevTask,
      [name]: value
    }));
  };

  const handleLabelChange = (e) => {
    const { name, value } = e.target;
    setNewLabel(prevLabel => ({
      ...prevLabel,
      [name]: value
    }));
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
        setLabels([...labels, data.data]);
        setNewLabel({ title: '', colorHex: '#000000' });
      }
    } catch (error) {
      console.error('Error creating label:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedTask = {
      ...task,
      due_Date: task.due_Date ? formatDate(task.due_Date) : null,
      priority: parseInt(task.priority),
      id_List: parseInt(task.id_List)
    };
    handleCreateTask(formattedTask);
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toISOString();
  };

  const handleCreateTask = async (taskData) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No se encontró el token de autenticación');
        return;
      }

      console.log('Datos de la tarea a enviar:', JSON.stringify(taskData, null, 2));

      const response = await fetch('http://localhost:8080/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(taskData)
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Error en la respuesta del servidor:', data);
        return;
      }

      console.log('Respuesta del servidor:', data);

      if (data.status === 201) {
        const createdTaskId = data.data.id;

        for (const labelId of selectedLabels) {
          await fetch(`http://localhost:8080/api/labels/${labelId}/tasks/${createdTaskId}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        }

        setIsModalOpen(false);
        onTaskCreated();
      } else {
        console.error('La creación de la tarea no devolvió el estado esperado:', data.status);
      }
    } catch (error) {
      console.error('Error al crear la tarea:', error);
    }
  };

  const toggleLabelSelection = (labelId) => {
    setSelectedLabels(prev =>
      prev.includes(labelId) ? prev.filter(id => id !== labelId) : [...prev, labelId]
    );
  };

  const handleDeleteSelectedLabels = async () => {
    const token = localStorage.getItem('authToken');
    if (!selectedLabels.length) {
      console.error('No labels selected for deletion.');
      return;
    }

    try {
      for (const labelId of selectedLabels) {
        const response = await fetch(`http://localhost:8080/api/labels/${labelId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error(`Error deleting label with ID ${labelId}`);
        }
      }

      setLabels(prevLabels => prevLabels.filter(label => !selectedLabels.includes(label.id)));
      setSelectedLabels([]);
    } catch (error) {
      console.error('Error deleting labels:', error);
    }
  };

  const startEditingLabel = (labelId) => {
    const labelToEdit = labels.find(label => label.id === labelId);
    setEditingLabel(labelToEdit);
  };

  const handleEditLabel = async () => {
    const token = localStorage.getItem('authToken');
    if (!editingLabel) {
      console.error('No label selected for editing.');
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

      // Actualizar la lista de etiquetas para reflejar los cambios de inmediato
      setLabels(prevLabels => prevLabels.map(label =>
        label.id === updatedLabel.data.id ? updatedLabel.data : label
      ));

      // Limpia la etiqueta en edición
      setEditingLabel(null);

    } catch (error) {
      console.error('Error updating label:', error);
    }
  };


  const [, updateState] = useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4 text-white">Crear Nueva Tarea</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Título</label>
          <input
            type="text"
            name="title"
            value={task.title}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            name="description"
            value={task.description}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Prioridad</label>
          <select
            name="priority"
            value={task.priority}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="1">Baja</option>
            <option value="2">Media</option>
            <option value="3">Alta</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Estado</label>
          <select
            name="status"
            value={task.status}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="pending">Pendiente</option>
            <option value="progress">En progreso</option>
            <option value="completed">Completada</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Fecha de vencimiento</label>
          <input
            type="datetime-local"
            name="due_Date"
            value={task.due_Date}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Lista</label>
          <select
            name="id_List"
            value={task.id_List}
            onClick={fetchLists}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          >
            <option value="">Selecciona una lista</option>
            {lists.map(list => (
              <option key={list.id} value={list.id}>{list.title}</option>
            ))}
          </select>
        </div>

        {/* Lista de etiquetas */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Etiquetas</label>
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={handleDeleteSelectedLabels}
              className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Eliminar Etiquetas
            </button>

            {selectedLabels.length === 1 && (
              <button
                type="button"
                onClick={() => startEditingLabel(selectedLabels[0])}
                className="px-3 py-1 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
              >
                Editar Etiqueta
              </button>
            )}
          </div>

          {/* Formulario de edición de etiqueta */}
          {editingLabel && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700">Editar Etiqueta</h3>
              <input
                type="text"
                name="title"
                value={editingLabel.title}
                onChange={(e) => setEditingLabel({ ...editingLabel, title: e.target.value })}
                className="mr-2 flex-grow rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <input
                type="color"
                name="colorHex"
                value={editingLabel.colorHex}
                onChange={(e) => setEditingLabel({ ...editingLabel, colorHex: e.target.value })}
                className="mr-2"
              />
              <button
                type="button"
                onClick={handleEditLabel}
                className="px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Guardar Cambios
              </button>
            </div>
          )}

          {/* Muestra las etiquetas */}
          <div className="mt-2 flex flex-wrap gap-2">
            {labels.map(label => (
              <button
                key={label.id}
                type="button"
                onClick={() => toggleLabelSelection(label.id)}
                className={`px-2 py-1 rounded-full text-xs font-semibold ${selectedLabels.includes(label.id) ? 'ring-2 ring-offset-2 ring-indigo-500' : ''
                  }`}
                style={{ backgroundColor: label.colorHex, color: getContrastColor(label.colorHex) }}
              >
                {label.title}
              </button>
            ))}
          </div>
        </div>

        {/* Formulario para crear nueva etiqueta */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700">Crear Nueva Etiqueta</h3>
          <div className="flex items-center mt-2">
            <input
              type="text"
              name="title"
              value={newLabel.title}
              onChange={handleLabelChange}
              placeholder="Título de la etiqueta"
              className="mr-2 flex-grow rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <input
              type="color"
              name="colorHex"
              value={newLabel.colorHex}
              onChange={handleLabelChange}
              className="mr-2"
            />
            <button
              type="button"
              onClick={handleCreateLabel}
              className="px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Crear
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="mr-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Crear Tarea
          </button>
        </div>
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
