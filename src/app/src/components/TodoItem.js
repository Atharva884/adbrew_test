import React, { useState } from 'react';
import './TodoItem.css';

export const TodoItem = ({ todo, onToggle, onDelete, onEdit }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggle = async () => {
    await onToggle(todo.id, todo.completed);
  };

  const handleEdit = () => {
    onEdit(todo);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this TODO?')) {
      setIsDeleting(true);
      await onDelete(todo.id);
    }
  };

  return (
    <li className={`todo-item ${isDeleting ? 'deleting' : ''}`}>
      <div className="todo-content">
        <div 
          className={`custom-checkbox ${todo.completed ? 'checked' : ''}`}
          onClick={handleToggle}
        >
          {todo.completed && (
            <svg viewBox="0 0 24 24" className="checkmark">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          )}
        </div>
        
        <span className={`todo-description ${todo.completed ? 'completed' : ''}`}>
          {todo.description}
        </span>
      </div>

      <div className="todo-actions">
        <button
          onClick={handleEdit}
          className="action-button edit-button"
          disabled={isDeleting}
          aria-label="Edit TODO"
          title="Edit"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
        </button>

        <button
          onClick={handleDelete}
          className="action-button delete-button"
          disabled={isDeleting}
          aria-label="Delete TODO"
          title="Delete"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
          </svg>
        </button>
      </div>
    </li>
  );
};
