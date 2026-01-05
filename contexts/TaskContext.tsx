import React, { createContext, useContext, useState, ReactNode } from 'react';

export type TaskStatus = 'On Progress' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  deadline: Date;
  status: TaskStatus;
  priority: TaskPriority;
  progress: number;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, task: Omit<Task, 'id'>) => void;
  deleteTask: (id: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, task: Omit<Task, 'id'>) => {
    setTasks(tasks.map(t => t.id === id ? { ...task, id } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);

  if (!context) {
    console.error(
      'useTasks dipakai di luar TaskProvider'
    );

    return {
      tasks: [],
      addTask: () => {},
      updateTask: () => {},
      deleteTask: () => {},
      toggleTaskStatus: () => {},
    };
  }

  return context;
}


