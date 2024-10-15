import React, { useState, useEffect } from 'react';
import TaskCard from '../components/TaskCard';

const TaskList = ({ listId, reloadTrigger }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("RELOAD_TRIGGER: " + reloadTrigger);
    const fetchTasks = async () => {
      if (listId) {
        const token = localStorage.getItem('authToken');
        if (token) {
          setLoading(true);
          setError(null);

          try {
            const response = await fetch(`http://localhost:8080/api/tasks/list/${listId}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            });

            if (!response.ok) {
              throw new Error('Error al cargar las tareas.');
            }

            const data = await response.json();
            if (Array.isArray(data.data)) {
              setTasks(data.data);
            }
          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        }
      }
    };

    fetchTasks();
  }, [listId, reloadTrigger]);

  const handleUpdateTask = async (updatedTask) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('Token no encontrado');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8080/api/tasks/${updatedTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedTask),
      });
  
      if (!response.ok) {
        throw new Error('Error al actualizar la tarea');
      }
  
      const data = await response.json();
      if (data.status === 200) {
        setTasks(tasks.map(task => (task.id === updatedTask.id ? data.data : task)));
      }
    } catch (error) {
      console.error('Error al actualizar la tarea:', error);
    }
  };
  

  const handleDeleteTask = async (taskId) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('Token no encontrado');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8080/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Error al eliminar la tarea');
      }
  
      // Si la eliminación fue exitosa, eliminamos la tarea del estado
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error al eliminar la tarea:', error);
    }
  };
  

  return (
    <div className="space-y-4">
      {loading && <p className="text-sm text-gray-400">Cargando tareas...</p>}
      {error && <p className="text-sm text-red-500">Error: {error}</p>}
      {tasks.length > 0 ? (
        tasks.map((task, index) => (
          <TaskCard
            key={index}
            task={task}
            onDeleteTask={handleDeleteTask}
            onUpdateTask={handleUpdateTask}
          />
        ))
      ) : (
        <p>No se encontraron tareas</p>
      )}
    </div>
  );
};

export default TaskList;