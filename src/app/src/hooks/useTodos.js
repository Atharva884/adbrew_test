import { useState, useEffect, useCallback } from 'react';
import { todoAPI, APIError } from '../services/api';

export const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Fetch all TODOs from the API
  const fetchTodos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await todoAPI.getAllTodos();
      setTodos(data);
      setInitialLoadComplete(true);
    } catch (err) {
      const errorMessage = err instanceof APIError 
        ? err.message 
        : 'Failed to load TODOs';
      setError(errorMessage);
      console.error('Error fetching TODOs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new TODO
  const createTodo = useCallback(async (description) => {
    setLoading(true);
    setError(null);

    try {
      const newTodo = await todoAPI.createTodo(description);
      
      setTodos(prevTodos => [newTodo, ...prevTodos]);
      
      return { success: true, data: newTodo };
    } catch (err) {
      const errorMessage = err instanceof APIError 
        ? err.message 
        : 'Failed to create TODO';
      setError(errorMessage);
      console.error('Error creating TODO:', err);
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an existing TODO
  const updateTodo = useCallback(async (id, updates) => {
    setLoading(true);
    setError(null);

    try {
      const updatedTodo = await todoAPI.updateTodo(id, updates);
      
      setTodos(prevTodos =>
        prevTodos.map(todo => (todo.id === id ? updatedTodo : todo))
      );
      
      return { success: true, data: updatedTodo };
    } catch (err) {
      const errorMessage = err instanceof APIError 
        ? err.message 
        : 'Failed to update TODO';
      setError(errorMessage);
      console.error('Error updating TODO:', err);
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a TODO
  const deleteTodo = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      await todoAPI.deleteTodo(id);
      
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof APIError 
        ? err.message 
        : 'Failed to delete TODO';
      setError(errorMessage);
      console.error('Error deleting TODO:', err);
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Toggle TODO completion status
  const toggleTodo = useCallback(async (id, currentStatus) => {
    return await updateTodo(id, { completed: !currentStatus });
  }, [updateTodo]);

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load TODOs on mount
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return {
    todos,
    loading,
    error,
    initialLoadComplete,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    clearError,
  };
};