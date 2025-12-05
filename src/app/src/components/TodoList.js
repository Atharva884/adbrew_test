import { TodoItem } from './TodoItem';
import './TodoList.css';

export const TodoList = ({ 
  todos, 
  loading, 
  error, 
  initialLoadComplete,
  onToggle, 
  onDelete,
  onEdit
}) => {
  if (loading && !initialLoadComplete) {
    return (
      <div className="todo-list-container">
        <div className="todo-list-header">
          <h2>All Todo's</h2>
        </div>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading TODOs...</p>
        </div>
      </div>
    );
  }

  if (error && !initialLoadComplete) {
    return (
      <div className="todo-list-container">
        <div className="todo-list-header">
          <h2>All Todo's</h2>
        </div>
        <div className="error-box">
          <p>Failed to load TODOs: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="todo-list-container">
      <div className="todo-list-header">
        <h2>All Todo's</h2>
      </div>
      
      {todos.length === 0 ? (
        <div className="empty-state">
          <p>No TODOs yet! Create your first one.</p>
        </div>
      ) : (
        <ul className="todo-list">
          {todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </ul>
      )}
    </div>
  );
};
