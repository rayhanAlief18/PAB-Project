import { Header } from '@/components/custom';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Task, useTasks } from '@/contexts/TaskContext';
import { router, Stack } from 'expo-router';
import { ArrowLeft, Check, Clock, Edit, Trash2 } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HistoryTasksScreen() {
    // Ambil data tasks dan fungsi dari context (Hybrid Storage: AsyncStorage + Firestore)
    const { tasks, deleteTask, updateTask } = useTasks();
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

    // Cek apakah tanggal sebelum hari ini
    const isBeforeToday = (date: Date): boolean => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const taskDate = new Date(date);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate < today;
    };

    // Filter tasks untuk history (sebelum hari ini), diurutkan dari terbaru
    const historyTasks = useMemo(() => {
        return tasks
            .filter(task => isBeforeToday(task.startTime))
            .sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
    }, [tasks]);

    const handleDelete = (id: string) => {
        setTaskToDelete(id);
        setDeleteModalVisible(true);
    };

    const confirmDelete = () => {
        if (taskToDelete) {
            deleteTask(taskToDelete);
            setDeleteModalVisible(false);
            setTaskToDelete(null);
        }
    };

    const cancelDelete = () => {
        setDeleteModalVisible(false);
        setTaskToDelete(null);
    };

    const handleEdit = (task: Task) => {
        router.push({
            pathname: '/create-task',
            params: {
                id: task.id,
            },
        });
    };

    const handleToggleStatus = (task: Task) => {
        updateTask(task.id, {
            ...task,
            status: task.status === 'On Progress' ? 'Done' : 'On Progress',
        });
    };

    const formatTime = (date: Date): string => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const formatDate = (date: Date): string => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const formatDateWithDay = (date: Date): string => {
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const dayName = days[date.getDay()];
        return `${dayName}, ${formatDate(date)}`;
    };

    return (
        <SafeAreaView className='flex-1 bg-[#F2F2F7]'>
            <Stack.Screen options={{ headerShown: false }} />
            <Header name='Azhim' customClass='px-[30px]' />
            <ScrollView className='flex-1'>
                <VStack className='px-[30px] py-[20px] gap-5'>
                    {/* Back Button */}
                    <TouchableOpacity onPress={() => router.back()} className='mb-2'>
                        <HStack className='items-center gap-2'>
                            <ArrowLeft size={24} color='#4B4B4B' />
                            <Text className='text-[16px]' style={{ fontFamily: "HankenGrotesk_500Medium" }}>
                                Kembali
                            </Text>
                        </HStack>
                    </TouchableOpacity>

                    {/* Title */}
                    <Text className='text-[24px] tracking-[-1.1px]' style={{ fontFamily: "HankenGrotesk_800ExtraBold_Italic" }}>
                        History Task
                    </Text>

                    {/* Task List */}
                    {historyTasks.length === 0 ? (
                        <VStack className='items-center justify-center py-20'>
                            <Text className='text-[16px] text-[#9CA3AF]' style={{ fontFamily: "HankenGrotesk_400Regular" }}>
                                Belum ada history task
                            </Text>
                            <Text className='text-[14px] text-[#9CA3AF] mt-2' style={{ fontFamily: "HankenGrotesk_400Regular" }}>
                                Task dari hari sebelumnya akan muncul di sini
                            </Text>
                        </VStack>
                    ) : (
                        <VStack className='gap-4 mb-8'>
                            {historyTasks.map((task) => (
                                <Box key={task.id} className='bg-white border-2 rounded-[8px] p-5 relative'>
                                    <VStack className='gap-3'>
                                        {/* Date Label */}
                                        <Text
                                            className='text-[12px] text-[#9CA3AF]'
                                            style={{ fontFamily: "HankenGrotesk_500Medium_Italic" }}
                                        >
                                            {formatDateWithDay(task.startTime)}
                                        </Text>

                                        {/* Title and Actions */}
                                        <HStack className='justify-between items-start'>
                                            <HStack className='flex-1 gap-3 items-start'>
                                                {/* Checkbox */}
                                                <TouchableOpacity
                                                    onPress={() => handleToggleStatus(task)}
                                                    activeOpacity={0.7}
                                                    className='mt-1'
                                                >
                                                    <View
                                                        className={`w-6 h-6 border-2 rounded-[4px] items-center justify-center ${task.status === 'Done'
                                                            ? 'bg-black border-black'
                                                            : 'bg-white border-[#4B4B4B]'
                                                            }`}
                                                    >
                                                        {task.status === 'Done' && (
                                                            <Check size={18} color='white' />
                                                        )}
                                                    </View>
                                                </TouchableOpacity>
                                                <VStack className='flex-1 gap-1'>
                                                    <Text
                                                        className={`text-[20px] ${task.status === 'Done' ? 'line-through text-[#9CA3AF]' : ''
                                                            }`}
                                                        style={{ fontFamily: "HankenGrotesk_900Black_Italic" }}
                                                    >
                                                        {task.title}
                                                    </Text>
                                                    <Text
                                                        className='text-[14px] text-[#4B4B4B]'
                                                        style={{ fontFamily: "HankenGrotesk_400Regular" }}
                                                    >
                                                        {task.description}
                                                    </Text>
                                                </VStack>
                                            </HStack>
                                            <HStack className='gap-2'>
                                                <TouchableOpacity
                                                    onPress={() => handleEdit(task)}
                                                    className='bg-[#4B4B4B] rounded-[6px] p-2'
                                                    activeOpacity={0.7}
                                                >
                                                    <Edit size={16} color='white' />
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() => handleDelete(task.id)}
                                                    className='bg-[#EF4444] rounded-[6px] p-2'
                                                    activeOpacity={0.7}
                                                >
                                                    <Trash2 size={16} color='white' />
                                                </TouchableOpacity>
                                            </HStack>
                                        </HStack>

                                        {/* Time Info */}
                                        <HStack className='items-center gap-3'>
                                            <Clock size={16} color='#4B4B4B' />
                                            <Text
                                                className='text-[14px]'
                                                style={{ fontFamily: "HankenGrotesk_500Medium_Italic" }}
                                            >
                                                {formatTime(task.startTime)} - {formatTime(task.endTime)}
                                            </Text>
                                        </HStack>

                                        {/* Status & Priority Badges */}
                                        <HStack className='items-center gap-2 mt-1'>
                                            {/* Status Badge */}
                                            <View
                                                className={`px-3 py-1 rounded-[4px] ${task.status === 'Done'
                                                    ? 'bg-[#10B981]'
                                                    : 'bg-[#3B82F6]'
                                                    }`}
                                            >
                                                <Text
                                                    className='text-white text-[12px]'
                                                    style={{ fontFamily: "HankenGrotesk_700Bold" }}
                                                >
                                                    {task.status === 'Done' ? 'Selesai' : 'Progres'}
                                                </Text>
                                            </View>

                                            {/* Priority Badge */}
                                            <View
                                                className={`px-3 py-1 rounded-[4px] ${task.priority === 'High'
                                                    ? 'bg-[#EF4444]'
                                                    : task.priority === 'Medium'
                                                        ? 'bg-[#F59E0B]'
                                                        : 'bg-[#10B981]'
                                                    }`}
                                            >
                                                <Text
                                                    className='text-white text-[12px]'
                                                    style={{ fontFamily: "HankenGrotesk_700Bold" }}
                                                >
                                                    {task.priority}
                                                </Text>
                                            </View>
                                        </HStack>
                                    </VStack>
                                </Box>
                            ))}
                        </VStack>
                    )}
                </VStack>
            </ScrollView>

            {/* Delete Confirmation Modal */}
            <Modal
                transparent
                visible={deleteModalVisible}
                animationType="fade"
                onRequestClose={cancelDelete}
            >
                <View className='flex-1 justify-center items-center bg-black/50 px-6'>
                    <Box className='bg-white rounded-[16px] p-6 w-full max-w-sm'>
                        <VStack className='gap-5'>
                            {/* Icon and Title */}
                            <VStack className='items-center gap-3'>
                                <View className='bg-[#FEE2E2] rounded-full p-4'>
                                    <Trash2 size={32} color='#EF4444' />
                                </View>
                                <Text
                                    className='text-[20px] text-center'
                                    style={{ fontFamily: "HankenGrotesk_800ExtraBold_Italic" }}
                                >
                                    Hapus Task?
                                </Text>
                                <Text
                                    className='text-[14px] text-[#4B4B4B] text-center'
                                    style={{ fontFamily: "HankenGrotesk_400Regular" }}
                                >
                                    Apakah Anda yakin ingin menghapus task ini? Tindakan ini tidak dapat dibatalkan.
                                </Text>
                            </VStack>

                            {/* Buttons */}
                            <HStack className='gap-3'>
                                <TouchableOpacity
                                    onPress={cancelDelete}
                                    className='flex-1 border-2 border-[#E5E5E5] rounded-[8px] py-3'
                                    activeOpacity={0.7}
                                >
                                    <Text
                                        className='text-center text-[16px] text-[#4B4B4B]'
                                        style={{ fontFamily: "HankenGrotesk_700Bold" }}
                                    >
                                        Batal
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={confirmDelete}
                                    className='flex-1 bg-[#EF4444] rounded-[8px] py-3'
                                    activeOpacity={0.8}
                                >
                                    <Text
                                        className='text-center text-[16px] text-white'
                                        style={{ fontFamily: "HankenGrotesk_700Bold" }}
                                    >
                                        Hapus
                                    </Text>
                                </TouchableOpacity>
                            </HStack>
                        </VStack>
                    </Box>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
