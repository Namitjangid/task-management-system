'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken } from '@/lib/auth';

type Task = {
  id: string;
  title: string;
  description: string;
  status: 'Pending' | 'Completed';
};

export default function TasksPage() {
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const getAuthToken = async () => {
    const token = await getAccessToken();
    if (!token) {
      router.push('/login');
      return null;
    }
    return token;
  };

 
  const loadTasks = async () => {
    const token = await getAuthToken();
    if (!token) return;

    try {
      const response = await fetch('http://localhost:4000/tasks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setTasks([]); 
        return;
      }

      const data = await response.json();

  
      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        setTasks([]);
      }
    } catch (error) {
      setTasks([]);
    }
  };

  const createTask = async () => {
    if (!title.trim()) {
      alert('Title is required');
      return;
    }

    const token = await getAuthToken();
    if (!token) return;

    await fetch('http://localhost:4000/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description,
      }),
    });

    setTitle('');
    setDescription('');
    loadTasks();
  };

  const startEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditTitle('');
    setEditDescription('');
  };

  const saveEdit = async (taskId: string) => {
    if (!editTitle.trim()) {
      alert('Title cannot be empty');
      return;
    }

    const token = await getAuthToken();
    if (!token) return;

    await fetch(`http://localhost:4000/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: editTitle,
        description: editDescription,
      }),
    });

    cancelEdit();
    loadTasks();
  };

  const toggleStatus = async (task: Task) => {
    const token = await getAuthToken();
    if (!token) return;

    await fetch(`http://localhost:4000/tasks/${task.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: task.status === 'Pending' ? 'Completed' : 'Pending',
      }),
    });

    loadTasks();
  };

  const deleteTask = async (taskId: string) => {
    const confirmed = confirm('Delete this task?');
    if (!confirmed) return;

    const token = await getAuthToken();
    if (!token) return;

    await fetch(`http://localhost:4000/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    loadTasks();
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Tasks</h1>

      
      <input
        className="border p-2 w-full mb-2"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="border p-2 w-full mb-2"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button
        className="bg-black text-white px-4 py-2 mb-6"
        onClick={createTask}
      >
        Add Task
      </button>

    
      {tasks.length === 0 ? (
        <p className="text-sm text-gray-500">No tasks found</p>
      ) : (
        tasks.map((task) => (
          <div key={task.id} className="border p-3 mb-2">
            {editingTaskId === task.id ? (
              <>
                <input
                  className="border p-1 w-full mb-1"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <textarea
                  className="border p-1 w-full mb-1"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
                <div className="space-x-2">
                  <button className="underline" onClick={() => saveEdit(task.id)}>
                    Save
                  </button>
                  <button
                    className="underline text-gray-500"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="font-semibold">{task.title}</h3>
                <p className="text-sm">{task.description}</p>
                <p className="text-xs mb-2">{task.status}</p>
                <div className="space-x-3">
                  <button
                    className="underline"
                    onClick={() => toggleStatus(task)}
                  >
                    Change Status
                  </button>
                  <button
                    className="underline"
                    onClick={() => startEdit(task)}
                  >
                    Edit
                  </button>
                  <button
                    className="underline text-red-500"
                    onClick={() => deleteTask(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}
