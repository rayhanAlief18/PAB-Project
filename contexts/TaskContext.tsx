import { db } from '@/config/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc
} from 'firebase/firestore';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export type TaskStatus = 'On Progress' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  status: TaskStatus;
  priority: TaskPriority;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (id: string, task: Omit<Task, 'id'>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  isLoading: boolean;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const COLLECTION_NAME = 'tasks';
const STORAGE_KEY = '@tasks';

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const hasLoadedFromAsyncStorage = React.useRef(false);

  // Load dari AsyncStorage terlebih dahulu (loading instant)
  useEffect(() => {
    loadFromAsyncStorage();
  }, []);

  // Setup Firestore listener (sync di background)
  useEffect(() => {
    console.log('Setting up Firestore listener...');

    const tasksQuery = query(
      collection(db, COLLECTION_NAME),
      orderBy('startTime', 'desc')
    );

    const unsubscribe = onSnapshot(
      tasksQuery,
      (snapshot) => {
        // Hanya proses jika data dari server, bukan dari cache kosong
        if (snapshot.metadata.fromCache && snapshot.empty) {
          console.log('Skipping empty Firestore cache');
          return;
        }

        const tasksData: Task[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            description: data.description,
            startTime: data.startTime instanceof Timestamp
              ? data.startTime.toDate()
              : new Date(data.startTime),
            endTime: data.endTime instanceof Timestamp
              ? data.endTime.toDate()
              : new Date(data.endTime),
            status: data.status,
            priority: data.priority,
          };
        });

        setTasks(tasksData);
        setIsLoading(false);

        // Simpan ke AsyncStorage untuk next time
        saveToAsyncStorage(tasksData);

        console.log('Synced with Firestore, total:', tasksData.length);
        console.log('From cache:', snapshot.metadata.fromCache);
      },
      (error) => {
        // Suppress timeout errors, gunakan data AsyncStorage
        console.log('Using offline mode (AsyncStorage)');
        setIsLoading(false);
      }
    );

    return () => {
      console.log('Unsubscribing from Firestore listener');
      unsubscribe();
    };
  }, []);

  const loadFromAsyncStorage = async () => {
    try {
      const tasksJson = await AsyncStorage.getItem(STORAGE_KEY);
      if (tasksJson) {
        const parsedTasks = JSON.parse(tasksJson);
        const tasksWithDates = parsedTasks.map((task: any) => ({
          ...task,
          startTime: new Date(task.startTime),
          endTime: new Date(task.endTime),
        }));
        setTasks(tasksWithDates);
        setIsLoading(false);
        hasLoadedFromAsyncStorage.current = true; // Mark as loaded
        console.log('Loaded from AsyncStorage (instant), total:', tasksWithDates.length);
      } else {
        setIsLoading(false);
        hasLoadedFromAsyncStorage.current = true; // Tandai sudah di-load meskipun kosong
      }
    } catch (error) {
      console.error('Error loading from AsyncStorage:', error);
      setIsLoading(false);
      hasLoadedFromAsyncStorage.current = true;
    }
  };

  const saveToAsyncStorage = async (tasksData: Task[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasksData));
    } catch (error) {
      console.error('Error saving to AsyncStorage:', error);
    }
  };

  const addTask = async (task: Omit<Task, 'id'>) => {
    try {
      const taskData = {
        title: task.title,
        description: task.description,
        startTime: Timestamp.fromDate(task.startTime),
        endTime: Timestamp.fromDate(task.endTime),
        status: task.status,
        priority: task.priority,
        createdAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, COLLECTION_NAME), taskData);
      console.log('Task added to Firestore with ID:', docRef.id);
    } catch (error) {
      console.error('❌ Error adding task to Firestore:', error);
      // Fallback: tambah ke local state dan AsyncStorage
      const newTask: Task = {
        ...task,
        id: Date.now().toString(),
      };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      saveToAsyncStorage(updatedTasks);
      console.log('Task saved to AsyncStorage (offline mode)');
    }
  };

  const updateTask = async (id: string, task: Omit<Task, 'id'>) => {
    // Optimistic update: Update UI immediately
    const previousTasks = [...tasks];
    const optimisticTasks = tasks.map(t =>
      t.id === id ? { ...task, id } : t
    );
    setTasks(optimisticTasks);
    saveToAsyncStorage(optimisticTasks);

    try {
      const taskData = {
        title: task.title,
        description: task.description,
        startTime: Timestamp.fromDate(task.startTime),
        endTime: Timestamp.fromDate(task.endTime),
        status: task.status,
        priority: task.priority,
        updatedAt: Timestamp.now(),
      };

      const taskRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(taskRef, taskData);
      console.log('Task updated in Firestore');
    } catch (error) {
      console.error('❌ Error updating task in Firestore:', error);
      // Rollback jika gagal (tapi tetap simpan di AsyncStorage untuk offline mode)
      console.log('Task saved in AsyncStorage (offline mode)');
    }
  };

  const deleteTask = async (id: string) => {
    // Optimistic update: Remove from UI immediately
    const previousTasks = [...tasks];
    const optimisticTasks = tasks.filter(t => t.id !== id);
    setTasks(optimisticTasks);
    saveToAsyncStorage(optimisticTasks);

    try {
      const taskRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(taskRef);
      console.log('Task deleted from Firestore');
    } catch (error) {
      console.error('❌ Error deleting task from Firestore:', error);
      // Rollback jika gagal (tapi tetap simpan di AsyncStorage untuk offline mode)
      console.log('Task deleted from AsyncStorage (offline mode)');
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, isLoading }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}