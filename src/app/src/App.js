import React, { useState } from 'react';
import { useTodos } from './hooks/useTodos';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { StatsCard } from './components/StatsCard';
import './App.css';

function App() {
  const {
    todos,
    loading,
    error,
    initialLoadComplete,
    createTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
  } = useTodos();

  const [editingTodo, setEditingTodo] = useState(null);

  // cacluating stats
  const completedCount = todos.filter(todo => todo.completed).length;
  const pendingCount = todos.filter(todo => !todo.completed).length;
  const totalCount = todos.length;

  const handleSubmitTodo = async (description, todoId) => {
    let result;
    
    if (todoId) {
      // Update existing TODO
      result = await updateTodo(todoId, { description });
      if (result.success) {
        setEditingTodo(null);
      }
    } else {
      // Create new TODO
      result = await createTodo(description);
    }
    
    return result;
  };

  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
  };

  const handleToggleTodo = async (id, currentStatus) => {
    await toggleTodo(id, currentStatus);
  };

  const handleDeleteTodo = async (id) => {
    await deleteTodo(id);
    if (editingTodo && editingTodo.id === id) {
      setEditingTodo(null);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>ToDo Application</h1>
        <p className="app-subtitle">Ready to manage your tasks today?</p>
      </header>

      <main className="app-main">
        <div className="stats-grid">
          <StatsCard 
            title="Pending"
            value={pendingCount}
            color="orange"
            icon="📈"
          />
          <StatsCard 
            title="Completed"
            value={completedCount}
            color="green"
            icon="🏆"
          />
          <StatsCard 
            title="Total"
            value={totalCount}
            color="blue"
            icon="📊"
          />
        </div>

        <div className="content-grid">
          <TodoForm 
            onSubmit={handleSubmitTodo} 
            loading={loading}
            error={error}
            editingTodo={editingTodo}
            onCancelEdit={handleCancelEdit}
          />

          <TodoList
            todos={todos}
            loading={loading}
            error={error}
            initialLoadComplete={initialLoadComplete}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
            onEdit={handleEditTodo}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
