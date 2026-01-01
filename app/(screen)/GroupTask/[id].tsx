import HeaderPage from '@/components/custom/HeaderPage';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from 'expo-router';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { AlertCircle, Check, EllipsisIcon, Plus, Trash2Icon } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from "../../../config/Firebase";


interface SubtaskProps {
    id: string,
    task: string,
    priority: 'Low' | 'Medium' | 'High',
    description?: string,
    status: 'On Progress' | 'Done',
    createdAt: Date,
}

export default function CreateSubTask() {
    const id = useLocalSearchParams<{ id: string }>().id;
    const snapPoints = useMemo(() => ['25%'], []);

    const [showConfirm, setShowConfirm] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [selectedSubTaskId, setSelectedSubTaskId] = useState<string | null>(null);

    const [subTask, setSubTask] = useState<any>([]);
    const [selectedSubtask, setSelectedSubTask] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    
    const loadData = async () => {
        try {
            const docRef = doc(db, "groupTasks", id as string)
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                // jika ada di firestore
                const data = docSnap.data();
                setSubTask(data);
                console.log('Data dari Firestore:', JSON.stringify(data.task, null, 2));
            } else {
                // 2. Fallback: Jika di Firestore tidak ada, cari di AsyncStorage
                console.log("Tidak ada di Firestore, mencari di lokal...");
                const local = await AsyncStorage.getItem("groupTasks");
                const parsed = local ? JSON.parse(local) : [];

                // Cari item yang ID-nya sama dengan parameter URL
                const foundLocal = parsed.find((item: any) => item.id === id);
                if (foundLocal) {
                    setSubTask(foundLocal);
                }
            }
        } catch (error) {
            console.error("Error loading data:", error);
        }
    };
    useEffect(() => {
        if (id) loadData();
    }, [id]);


    const getPriorityColor = (priority: string) => {
        switch (priority?.toLowerCase()) {
            case 'high':
                return { bg: 'bg-red-100', border: 'border-red-300', text: 'text-red-700' };
            case 'medium':
                return { bg: 'bg-amber-100', border: 'border-amber-300', text: 'text-amber-700' };
            case 'low':
                return { bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-700' };
            default:
                return { bg: 'bg-gray-100', border: 'border-gray-300', text: 'text-gray-700' };
        }
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'on progress':
                return { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-700' };
            case 'done':
                return { bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-700' };
            default:
                return { bg: 'bg-gray-100', border: 'border-gray-300', text: 'text-gray-700' };
        }
    };

    const handleDeleteSubTask = async (subTaskId: string) => {
        try {
            const updatedTasks = subTask.task.filter(
                (item: SubtaskProps) => item.id !== subTaskId
            );

            const updatedData = {
                ...subTask,
                task: updatedTasks,
            };

            setSubTask(updatedData);

            const docRef = doc(db, "groupTasks", id as string);
            await updateDoc(docRef, {
                task: updatedTasks,
            });

            const local = await AsyncStorage.getItem("groupTasks");
            if (local) {
                const parsed = JSON.parse(local);
                const updatedLocal = parsed.map((item: any) =>
                    item.id === id ? updatedData : item
                );
                await AsyncStorage.setItem(
                    "groupTasks",
                    JSON.stringify(updatedLocal)
                );
            }

        } catch (error) {
            console.error("Gagal hapus subtask:", error);
        }
    }

    const markSubTaskAsDone = async (subTaskId: string) => {
        if (!subTask?.task) return;

        const updatedSubTasks = subTask.task.map((item: SubtaskProps) =>
            item.id === subTaskId
                ? { ...item, status: "Done" }
                : item
        );

        const allDone = updatedSubTasks.every(
            (item: SubtaskProps) => item.status === "Done"
        );

        const updatedGroupTask = {
            ...subTask,
            task: updatedSubTasks,
            status: allDone ? "Done" : "On Progress",
            synced: false,
        };

        // 1️⃣ Update state
        setSubTask(updatedGroupTask);

        // 2️⃣ Update AsyncStorage
        const local = await AsyncStorage.getItem("groupTasks");
        const parsed = local ? JSON.parse(local) : [];

        const updatedLocal = parsed.map((item: any) =>
            item.id === subTask.id ? updatedGroupTask : item
        );

        await AsyncStorage.setItem(
            "groupTasks",
            JSON.stringify(updatedLocal)
        );

        // 3️⃣ Update Firebase
        await updateDoc(doc(db, "groupTasks", subTask.id), {
            task: updatedSubTasks,
            status: updatedGroupTask.status,
            synced: true,
        });

        await AsyncStorage.setItem(
            "groupTasks",
            JSON.stringify(updatedLocal)
        );

        // 3️⃣ Update Firebase
        await updateDoc(doc(db, "groupTasks", subTask.id), {
            task: updatedSubTasks,
            status: updatedGroupTask.status,
            synced: true,
        });
    }

    return (
        <SafeAreaView className='flex-1 bg-gray-50'>
            <HeaderPage title='SubTask' />

            <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
                <View className='px-5 py-4'>
                    {/* Info Banner */}
                    <Box className='bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5 flex-row items-center'>
                        <AlertCircle size={20} color="#3B82F6" />
                        <Text
                            className='ml-3 text-blue-700 flex-1'
                            style={{ fontFamily: "HankenGrotesk_500Medium" }}
                        >
                            Creating subtask for Group Task #{id}
                        </Text>
                    </Box>

                    {/* Parent Task Card */}
                    <View className='mb-6'>
                        <Text
                            className='text-sm text-gray-500 mb-3 uppercase tracking-wide'
                            style={{ fontFamily: "HankenGrotesk_600SemiBold" }}
                        >
                            Subtask
                        </Text>
                        {(!subTask || !subTask.task || subTask.task.length === 0) ? (
                            <View>
                                <Box className='bg-white rounded-2xl p-8 items-center border border-dashed border-gray-300'>
                                    <View className='bg-gray-100 rounded-full p-4 mb-3'>
                                        <Plus size={24} color='#9CA3AF' />
                                    </View>
                                    <Text
                                        className='text-gray-500 text-center'
                                        style={{ fontFamily: "HankenGrotesk_500Medium" }}
                                    >
                                        No subtasks yet
                                    </Text>
                                    <Text
                                        className='text-gray-400 text-xs text-center mt-1'
                                        style={{ fontFamily: "HankenGrotesk_400Regular" }}
                                    >
                                        Tap the + button to add your first subtask
                                    </Text>
                                </Box>
                            </View>
                        ) : (
                            subTask?.task.map((item: SubtaskProps, index: number) => {
                                const priority = getPriorityColor(item.priority || 'medium');
                                const status = getStatusColor(item.status || 'on progress');
                                return (
                                    <Box key={index} className='bg-white rounded-2xl p-5 shadow-sm border border-gray-400 mb-4'>
                                        {/* Header dengan Close Button */}
                                        <HStack className='justify-between items-start mb-4'>
                                            <Text
                                                className='text-2xl tracking-tight leading-7 flex-1 pr-3'
                                                style={{ fontFamily: "HankenGrotesk_700Bold" }}
                                            >
                                                {item.task}
                                            </Text>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setShowConfirm(true)
                                                    setSelectedSubTask(item.id)
                                                    markSubTaskAsDone(selectedSubtask);
                                                }}
                                                activeOpacity={0.7}

                                            >{item.status === 'Done' ? (
                                                <View className='bg-green-100 rounded-full p-2'>
                                                    <Check size={20} color="#15803d" />
                                                </View>
                                            ) : (
                                                <View className='bg-gray-100 rounded-full p-2'>
                                                    <EllipsisIcon
                                                        size={20}
                                                        color={'#374151'}
                                                        strokeWidth={3}
                                                    />
                                                </View>
                                            )}
                                            </TouchableOpacity>

                                        </HStack>

                                        {/* Priority Badge */}
                                        <HStack className='items-center gap-2 mb-4'>
                                            <Text
                                                className='text-gray-800  text-md font-semibold'
                                                style={{ fontFamily: "HankenGrotesk_500Medium" }}
                                            >
                                                {item.description}
                                            </Text>
                                        </HStack>

                                        {/* Divider */}
                                        <View className='h-[1px] bg-gray-100 mb-4' />

                                        {/* Bottom Info */}
                                        <HStack className='justify-between gap-2 items-center'>
                                            <HStack className=' items-center gap-2'>
                                                {item.priority && (
                                                    <HStack className='items-center'>
                                                        <Box className={`${priority.bg} border-2 ${priority.border} rounded-full px-4 py-1.5`}>
                                                            <Text
                                                                className={`${priority.text} text-xs font-semibold`}
                                                                style={{ fontFamily: "HankenGrotesk_600SemiBold" }}
                                                            >
                                                                {item.priority}
                                                            </Text>
                                                        </Box>
                                                    </HStack>
                                                )}
                                                {item.status && (
                                                    <Box className={`${status.bg} border-2 ${status.border} rounded-full px-4 py-2`}>
                                                        <Text
                                                            className={`${status.text} text-xs font-semibold`}
                                                            style={{ fontFamily: "HankenGrotesk_600SemiBold" }}
                                                        >
                                                            {item.status}
                                                        </Text>
                                                    </Box>
                                                )}
                                            </HStack>
                                            {
                                                item.status === 'On Progress' && (
                                                    <TouchableOpacity
                                                        className="rounded-full p-2 bg-red-100"
                                                        onPress={() => {
                                                            setSelectedSubTaskId(item.id);
                                                            setShowDeleteModal(true);
                                                        }}
                                                    >
                                                        <Trash2Icon size={20} color="#c53030" />
                                                    </TouchableOpacity>
                                                )
                                            }
                                        </HStack>
                                    </Box>
                                )
                            })
                        )}
                    </View>


                </View>
            </ScrollView>

            {/* Confirmation Modal */}
            <Modal
                transparent
                animationType="fade"
                visible={showConfirm}
                onRequestClose={() => setShowConfirm(false)}
            >
                {/* Overlay */}
                <View className="flex-1 bg-black/40 justify-center items-center px-6">

                    {/* Card */}
                    <View className="bg-white w-full rounded-2xl p-6">
                        <Text className="text-lg font-semibold text-gray-900" style={{ fontFamily: "HankenGrotesk_500Medium" }}>
                            Tandai task sebagai selesai ?
                        </Text>

                        <Text className="text-gray-500 mt-2" style={{ fontFamily: "HankenGrotesk_400Regular" }}>
                            Task yang sudah ditandai selesai tidak dapat diubah kembali.
                        </Text>

                        {/* Action */}
                        <HStack className="justify-end mt-6 gap-2">
                            <TouchableOpacity
                                onPress={() => setShowConfirm(false)}
                                className="px-4 py-2 rounded-lg bg-gray-100"
                            >
                                <Text className="text-gray-700 font-medium">Batal</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    setShowConfirm(false);
                                }}
                                className="px-4 py-2 rounded-lg bg-green-500"
                            >
                                <Text className="text-white font-medium">Selesai</Text>
                            </TouchableOpacity>
                        </HStack>
                    </View>

                </View>
            </Modal>

            {/* Modal delete */}
            <Modal
                transparent
                animationType="fade"
                visible={showDeleteModal}
                onRequestClose={() => setShowDeleteModal(false)}
            >
                {/* Overlay */}
                <View className="flex-1 bg-black/40 justify-center items-center px-6">

                    {/* Card */}
                    <View className="bg-white w-full rounded-2xl p-6">

                        <Text
                            className="text-lg text-gray-900"
                            style={{ fontFamily: "HankenGrotesk_600SemiBold" }}
                        >
                            Hapus subtask?
                        </Text>

                        <Text
                            className="text-gray-500 mt-2"
                            style={{ fontFamily: "HankenGrotesk_400Regular" }}
                        >
                            Subtask yang dihapus tidak dapat dikembalikan.
                        </Text>

                        {/* Action */}
                        <HStack className="justify-end mt-6 gap-2">
                            <TouchableOpacity
                                onPress={() => {
                                    setShowDeleteModal(false);
                                    setSelectedSubTaskId(null);
                                }}
                                className="px-4 py-2 rounded-lg bg-gray-100"
                            >
                                <Text className="text-gray-700">Batal</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    if (selectedSubTaskId) {
                                        handleDeleteSubTask(selectedSubTaskId);
                                    }
                                    setShowDeleteModal(false);
                                    setSelectedSubTaskId(null);
                                }}
                                className="px-4 py-2 rounded-lg bg-red-500"
                            >
                                <Text className="text-white">Hapus</Text>
                            </TouchableOpacity>
                        </HStack>

                    </View>
                </View>
            </Modal>



            {/* Floating Action Button - Improved */}
            <View className='absolute bottom-6 right-6'>
                <TouchableOpacity
                    onPress={() => router.push({
                        pathname: '/(screen)/GroupTask/SubTask/[id]',
                        params: { id: id },
                    })}

                    className='bg-black rounded-full w-16 h-16 items-center justify-center'
                    activeOpacity={0.8}
                    style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 4.65,
                        elevation: 8,
                    }}
                >
                    <Plus size={28} color='white' strokeWidth={2.5} />
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    )
}