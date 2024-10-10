import React from 'react';
import { FaPaperclip, FaBell, FaCalendarAlt } from 'react-icons/fa';

const TaskCard = ({ task }) => {
  return (
    <div className="relative p-4 bg-gray-800 rounded-lg shadow-md">
      <h4 className="text-lg font-semibold mb-2">{task.title}</h4>
      <p className="text-sm text-gray-400 mb-2">{task.date}</p>
      {/* Mostrar etiquetas si las hay */}
      {task.labels && task.labels.length > 0 && (
        <div className="flex space-x-2 mb-2">
          {task.labels.map((label, idx) => (
            <span
              key={idx}
              className="px-2 py-1 text-xs font-semibold rounded"
              style={{ backgroundColor: label.color }}
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

export default TaskCard;