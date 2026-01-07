import { db } from '@/config/firebaseConfig';
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
    progress: number;
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

export function TaskProvider({ children }: { children: ReactNode }) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Real-time listener untuk Firestore
    useEffect(() => {
        console.log('Setting up Firestore listener...');

        // Query untuk mengambil tasks, diurutkan berdasarkan startTime
        const tasksQuery = query(
            collection(db, COLLECTION_NAME),
            orderBy('startTime', 'desc')
        );

        // Subscribe untuk real-time updates
        const unsubscribe = onSnapshot(
            tasksQuery,
            (snapshot) => {
                console.log('Received Firestore update, documents:', snapshot.size);

                const tasksData: Task[] = snapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        title: data.title,
                        description: data.description,
                        // Convert Firestore Timestamp ke Date
                        startTime: data.startTime instanceof Timestamp
                            ? data.startTime.toDate()
                            : new Date(data.startTime),
                        endTime: data.endTime instanceof Timestamp
                            ? data.endTime.toDate()
                            : new Date(data.endTime),
                        status: data.status,
                        priority: data.priority,
                        progress: data.progress,
                    };
                });

                setTasks(tasksData);
                setIsLoading(false);
                console.log('Tasks updated, total:', tasksData.length);
            },
            (error) => {
                console.error('Error listening to Firestore:', error);
                setIsLoading(false);
            }
        );

        // Cleanup subscription saat unmount
        return () => {
            console.log('Unsubscribing from Firestore listener');
            unsubscribe();
        };
    }, []);

    const addTask = async (task: Omit<Task, 'id'>) => {
        try {
            console.log('Adding new task:', task.title);

            // Convert Date ke Firestore Timestamp
            const taskData = {
                title: task.title,
                description: task.description,
                startTime: Timestamp.fromDate(task.startTime),
                endTime: Timestamp.fromDate(task.endTime),
                status: task.status,
                priority: task.priority,
                progress: task.progress,
                createdAt: Timestamp.now(),
            };

            const docRef = await addDoc(collection(db, COLLECTION_NAME), taskData);
            console.log('Task added with ID:', docRef.id);
        } catch (error) {
            console.error('Error adding task:', error);
            throw error;
        }
    };

    const updateTask = async (id: string, task: Omit<Task, 'id'>) => {
        // Optimistic update: Update UI immediately
        const previousTasks = [...tasks];
        const optimisticTasks = tasks.map(t =>
            t.id === id ? { ...task, id } : t
        );
        setTasks(optimisticTasks);

        try {
            console.log('Updating task:', id);

            // Convert Date ke Firestore Timestamp
            const taskData = {
                title: task.title,
                description: task.description,
                startTime: Timestamp.fromDate(task.startTime),
                endTime: Timestamp.fromDate(task.endTime),
                status: task.status,
                priority: task.priority,
                progress: task.progress,
                updatedAt: Timestamp.now(),
            };

            const taskRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(taskRef, taskData);
            console.log('Task updated successfully');
        } catch (error) {
            console.error('Error updating task:', error);
            // Rollback ke state sebelumnya jika gagal
            setTasks(previousTasks);
            throw error;
        }
    };

    const deleteTask = async (id: string) => {
        // Optimistic update: Remove from UI immediately
        const previousTasks = [...tasks];
        const optimisticTasks = tasks.filter(t => t.id !== id);
        setTasks(optimisticTasks);

        try {
            console.log('Deleting task:', id);

            const taskRef = doc(db, COLLECTION_NAME, id);
            await deleteDoc(taskRef);
            console.log('Task deleted successfully');
        } catch (error) {
            console.error('Error deleting task:', error);
            // Rollback ke state sebelumnya jika gagal
            setTasks(previousTasks);
            throw error;
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
