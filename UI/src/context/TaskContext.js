import React, { createContext, useState } from 'react';
import axios from 'axios';
import { encryptData } from '../utils/encryption';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/tasks', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTasks(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData) => {
    try {
      setLoading(true);
      const encryptedData = encryptData(taskData);
      await axios.post('http://localhost:5000/api/tasks', { encryptedData }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      await fetchTasks();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id, updates) => {
    try {
      setLoading(true);
      const encryptedData = encryptData(updates);
      await axios.put(`http://localhost:5000/api/tasks/${id}`, { encryptedData }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      await fetchTasks();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      await fetchTasks();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  const moveTask = async (id, status) => {
    try {
      await updateTask(id, { status });
    } catch (err) {
      throw err;
    }
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      loading,
      error,
      fetchTasks,
      createTask,
      updateTask,
      deleteTask,
      moveTask,
      isAdmin: currentUser?.role === 'admin'
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => React.useContext(TaskContext);