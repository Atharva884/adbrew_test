const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Custom error class
export class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

// Wrapper function
async function fetchWithErrorHandling(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    // Throwing our custom APIError
    if (!response.ok) {
      throw new APIError(
        data.message || data.error || 'Request failed',
        response.status,
        data
      );
    }

    // Return parsed JSON on success
    return data;
  } catch (error) {
    // Re-throw known APIError instances
    if (error instanceof APIError) {
      throw error;
    }

    // Handle network issues or unexpected parsing errors
    throw new APIError(
      error.message || 'Network error occurred',
      0,
      null
    );
  }
}

export const todoAPI = {
  // Fetch the complete list of TODO items
  async getAllTodos() {
    const data = await fetchWithErrorHandling(`${API_BASE_URL}/todos/`);
    return data.data || [];
  },

  // Create a new TODO using the provided description
  async createTodo(description) {
    if (!description || !description.trim()) {
      throw new Error('Description is required');
    }

    const data = await fetchWithErrorHandling(`${API_BASE_URL}/todos/`, {
      method: 'POST',
      body: JSON.stringify({ description: description.trim() }),
    });

    return data.data;
  },

  // Update an existing TODO using its ID and fields to be updated
  async updateTodo(id, updates) {
    const data = await fetchWithErrorHandling(
      `${API_BASE_URL}/todos/${id}/`,
      {
        method: 'PUT',
        body: JSON.stringify(updates),
      }
    );

    return data.data;
  },

  // Delete a TODO by its ID
  async deleteTodo(id) {
    await fetchWithErrorHandling(`${API_BASE_URL}/todos/${id}/`, {
      method: 'DELETE',
    });

    return true;
  },
};
