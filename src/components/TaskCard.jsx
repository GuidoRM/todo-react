import React, { useState, useEffect } from 'react';
import { FaPaperclip, FaBell, FaCalendarAlt } from 'react-icons/fa';

const TaskCard = ({ task }) => {
  const [labels, setLabels] = useState([]);

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

  return (
    <div className="relative p-4 bg-gray-800 rounded-lg shadow-md">
      <p>{task.id}</p>
      <h4 className="text-lg font-semibold mb-2">{task.title}</h4>
      <p className="text-sm text-gray-400 mb-2">{task.date}</p>
      {/* Mostrar etiquetas obtenidas de la API */}
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
      {/* Mostrar estado de progreso si existe */}
      {task.status && task.status !== '' && (
        <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded mb-2">
          {task.status}
        </span>
      )}
      {/* Mostrar iconos si hay adjuntos, recordatorio o fecha de vencimiento */}
      <div className="flex space-x-4 text-gray-400">
        {task.attachments > 0 && (
          <div className="flex items-center">
            <FaPaperclip className="mr-1" />
            {task.attachments}
          </div>
        )}
        {task.reminder && <FaBell />}
        {task.dueDate && <FaCalendarAlt />}
      </div>
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