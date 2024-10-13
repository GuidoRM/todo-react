import React, { useState, useEffect } from 'react';
import useFetch from '../hooks/useFetch';
import TaskCard from '../components/TaskCard';

const TaskList = ({ listId }) => {
  const [tasks, setTasks] = useState([]);
  const { data, loading, error, fetchData } = useFetch();

  useEffect(() => {
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
  }, [listId, fetchData]);

  useEffect(() => {
    if (data && Array.isArray(data.data)) {
      setTasks(data.data);
    }
  }, [data]);

  return (
    <div className="space-y-4">
      {loading && <p className="text-sm text-gray-400">Cargando tareas...</p>}
      {error && <p className="text-sm text-red-500">Error: {error}</p>}
      {tasks.length > 0 ? (
        tasks.map((task, index) => <TaskCard key={index} task={task} />)
      ) : (
        <p>No se encontraron tareas</p>
      )}
    </div>
  );
};

export default TaskList;