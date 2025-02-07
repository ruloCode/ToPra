'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import AuthComponent from '@/components/Auth';

interface Task {
  id: string;
  title: string;
  description: string;
  time?: string;
  completed: boolean;
  category: 'work' | 'personal' | 'inbox';
  user_id?: string;
  created_at?: string;
}

type CategoryFilter = 'all' | 'work' | 'personal' | 'inbox';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Session data:', session);
        
        if (session?.user) {
          setUser(session.user);
          await fetchTasks(session.user.id);
        } else {
          setUser(null);
          setTasks([]);
        }
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };

    initializeApp();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log('Auth state changed:', _event, session?.user);
        
        if (session?.user) {
          setUser(session.user);
          if (_event === 'SIGNED_IN') {
            await fetchTasks(session.user.id);
          }
        } else {
          setUser(null);
          setTasks([]);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchTasks = async (userId: string) => {
    setLoading(true);
    try {
      console.log('Fetching tasks for user:', userId);
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      console.log('Tasks fetched successfully:', data);
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData: Omit<Task, 'id'>) => {
    if (!user?.id) {
      console.log('No authenticated user found');
      return;
    }

    try {
      setLoading(true);
      console.log('Adding task with data:', { ...taskData, user_id: user.id });
      
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ ...taskData, user_id: user.id }])
        .select()
        .single();

      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      console.log('Task added successfully:', data);
      if (data) {
        setTasks(prev => [data, ...prev]);
      }
      setNewTask(false);
    } catch (error) {
      console.error('Error adding task:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !task.completed })
        .eq('id', id);

      if (error) {
        throw error;
      }

      setTasks(prev =>
        prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
      );
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const today = new Date();
  const dayOfWeek = format(today, 'EEEE');
  const dayAndMonth = format(today, 'MMM d');

  const filteredTasks = tasks.filter(task => 
    categoryFilter === 'all' ? true : task.category === categoryFilter
  );

  if (!user) {
    return <AuthComponent />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-6">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-gray-900">Today</h1>
            <p className="text-gray-600">{dayAndMonth} · {dayOfWeek}</p>
          </div>
          <button
            onClick={() => supabase.auth.signOut()}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
          >
            Sign Out
          </button>
        </div>

        <div className="mb-6 flex space-x-2">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-4 py-2 rounded-lg ${
              categoryFilter === 'all'
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setCategoryFilter('work')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              categoryFilter === 'work'
                ? 'bg-red-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="w-3 h-3 rounded-full border-2 border-red-500" />
            <span>Work</span>
          </button>
          <button
            onClick={() => setCategoryFilter('personal')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              categoryFilter === 'personal'
                ? 'bg-yellow-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="w-3 h-3 rounded-full border-2 border-yellow-500" />
            <span>Personal</span>
          </button>
          <button
            onClick={() => setCategoryFilter('inbox')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              categoryFilter === 'inbox'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="w-3 h-3 rounded-full border-2 border-blue-500" />
            <span>Inbox</span>
          </button>
        </div>

        <div className="space-y-4">
          {tasks.length === 0 && !loading ? (
            <div className="text-center py-10 text-gray-500">
              No tasks yet. Click the + button to add one!
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                    ${task.completed 
                      ? 'bg-blue-500 border-blue-500' 
                      : task.category === 'work' 
                        ? 'border-red-500'
                        : task.category === 'personal'
                          ? 'border-yellow-500'
                          : 'border-blue-500'
                      }`}
                >
                  {task.completed && (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                
                <div className="flex-1">
                  <h3 className={`font-medium text-gray-900 ${task.completed ? 'line-through text-gray-400' : ''}`}>
                    {task.title}
                  </h3>
                  <p className="text-sm text-gray-500">{task.description}</p>
                </div>

                {task.time && (
                  <div className="text-sm text-gray-500">
                    {task.time}
                  </div>
                )}

                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        <button
          onClick={() => setNewTask(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-red-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-600 transition-colors"
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>

        {newTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 text-black">New Task</h2>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const taskData = {
                  title: formData.get('title') as string,
                  description: formData.get('description') as string,
                  time: formData.get('time') as string,
                  completed: false,
                  category: formData.get('category') as Task['category'],
                  created_at: new Date().toISOString(),
                };
                await addTask(taskData);
              }}>
                <div className="space-y-4">
                  <input
                    name="title"
                    placeholder="Task title"
                    className="w-full p-2 border rounded bg-white text-black"
                    required
                  />
                  <input
                    name="description"
                    placeholder="Description"
                    className="w-full p-2 border rounded bg-white text-black"
                  />
                  <input
                    name="time"
                    type="time"
                    className="w-full p-2 border rounded bg-white text-black"
                  />
                  <select
                    name="category"
                    className="w-full p-2 border rounded bg-white text-black"
                    required
                  >
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                    <option value="inbox">Inbox</option>
                  </select>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setNewTask(false)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Add Task
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
