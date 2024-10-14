import React, { useState, useEffect } from 'react';
import useFetch from '../hooks/useFetch';
import TaskCard from '../components/TaskCard';

const TaskList = ({ listId, reloadTrigger }) => {
  const [tasks, setTasks] = useState([]);
  const { data, loading, error, fetchData } = useFetch();

  useEffect(() => {
    console.log("RELOAD_TRIGGER: " + reloadTrigger)
    if (listId) {
      const token = localStorage.getItem('authToken');
      if (token) {
        fetchData(`http://localhost:8080/api/tasks/list/${listId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
      }
    }
  }, [listId, reloadTrigger, fetchData]); // Agrega `reloadTrigger` como dependencia

  useEffect(() => {
    if (data && Array.isArray(data.data)) {
      setTasks(data.data);
    }
  }, [data]);

  const handleUpdateTask = (updatedTask) => {
    setTasks(tasks.map(task => (task.id === updatedTask.id ? updatedTask : task)));
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <div className="space-y-4">
      {loading && <p className="text-sm text-gray-400">Cargando tareas...</p>}
      {error && <p className="text-sm text-red-500">Error: {error}</p>}
      {tasks.length > 0 ? (
        tasks.map((task, index) => <TaskCard key={index} task={task} onDeleteTask={handleDeleteTask} onUpdateTask={handleUpdateTask}/>)
      ) : (
        <p>No se encontraron tareas</p>
      )}
    </div>
  );
};

export default TaskList;