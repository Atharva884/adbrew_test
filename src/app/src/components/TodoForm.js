import React, { useState, useEffect } from 'react';
import './TodoForm.css';

export const TodoForm = ({ onSubmit, loading, error, editingTodo, onCancelEdit }) => {
  const [description, setDescription] = useState('');
  const [validationError, setValidationError] = useState('');
  const isEditMode = !!editingTodo;

  useEffect(() => {
    if (editingTodo) {
      setDescription(editingTodo.description);
    } else {
      setDescription('');
    }
  }, [editingTodo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    if (!description.trim()) {
      setValidationError('Please enter a TODO description');
      return;
    }

    if (description.trim().length < 3) {
      setValidationError('TODO description must be at least 3 characters');
      return;
    }

    setValidationError('');
    
    const result = await onSubmit(description, isEditMode ? editingTodo.id : null);
    
    if (result.success) {
      setDescription('');
    }
  };

  const handleChange = (e) => {
    setDescription(e.target.value);
    if (validationError) {
      setValidationError('');
    }
  };

  const handleCancel = () => {
    setDescription('');
    setValidationError('');
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  return (
    <div className={`todo-form-container ${isEditMode ? 'edit-mode' : ''}`}>
      <h2>{isEditMode ? 'Edit ToDo' : 'Add New ToDo'}</h2>
      
      <form onSubmit={handleSubmit} className="todo-form">
        <div className="form-group">
          <label htmlFor="todo-input">Task Description</label>
          <textarea
            id="todo-input"
            value={description}
            onChange={handleChange}
            placeholder="What do you need to do?"
            disabled={loading}
            className={validationError || error ? 'error' : ''}
            autoComplete="off"
            rows="4"
          />
        </div>

        {(validationError || error) && (
          <div className="error-message">
            {validationError || error}
          </div>
        )}

        <div className="form-actions">
          <button 
            type="submit" 
            disabled={loading}
            className="submit-button"
          >
            {loading ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Update Task' : 'Add Task')}
          </button>
          
          {isEditMode && (
            <button 
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="cancel-button"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
