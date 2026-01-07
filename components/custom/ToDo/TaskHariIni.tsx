import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Task, useTasks } from '@/contexts/TaskContext';
import { Check, Clock } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface customClassType {
    customClass?: string;
}

type FilterType = 'All' | 'On Progress' | 'Done';

export default function TaskHariIni({ customClass }: customClassType) {
    const { tasks, updateTask } = useTasks();
    const [selectedFilter, setSelectedFilter] = useState<FilterType>('All');

    // Cek apakah tanggal adalah hari ini
    const isToday = (date: Date): boolean => {
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    // Filter tasks untuk hari ini saja
    const todayTasks = useMemo(() => {
        return tasks.filter(task => isToday(task.startTime));
    }, [tasks]);

    // Filter berdasarkan tab yang dipilih dan urutkan berdasarkan prioritas
    const filteredTasks = useMemo(() => {
        let filtered: Task[];
        if (selectedFilter === 'All') {
            filtered = todayTasks;
        } else if (selectedFilter === 'On Progress') {
            filtered = todayTasks.filter(task => task.status === 'On Progress');
        } else {
            filtered = todayTasks.filter(task => task.status === 'Done');
        }

        // Urutkan berdasarkan prioritas: High -> Medium -> Low
        const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
        return filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    }, [todayTasks, selectedFilter]);

    const formatTime = (date: Date): string => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const handleToggleStatus = (task: Task) => {
        updateTask(task.id, {
            ...task,
            status: task.status === 'On Progress' ? 'Done' : 'On Progress',
        });
    };

    return (
        <View className={`${customClass}`}>
            {/* Title */}
            <Text className='mb-[15px] text-[18px] text-[#4B4B4B]' style={{ fontFamily: "HankenGrotesk_800ExtraBold_Italic" }}>
                TASK HARI INI
            </Text>

            {/* Filter Tabs */}
            <HStack className='gap-2 mb-4'>
                <TouchableOpacity
                    onPress={() => setSelectedFilter('All')}
                    className={`px-4 py-2 rounded-full ${selectedFilter === 'All' ? 'bg-black' : 'bg-white border-2 border-[#E5E5E5]'
                        }`}
                    activeOpacity={0.7}
                >
                    <Text
                        className={`text-[14px] ${selectedFilter === 'All' ? 'text-white' : 'text-[#4B4B4B]'
                            }`}
                        style={{ fontFamily: "HankenGrotesk_600SemiBold" }}
                    >
                        All
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setSelectedFilter('On Progress')}
                    className={`px-4 py-2 rounded-full ${selectedFilter === 'On Progress' ? 'bg-black' : 'bg-white border-2 border-[#E5E5E5]'
                        }`}
                    activeOpacity={0.7}
                >
                    <Text
                        className={`text-[14px] ${selectedFilter === 'On Progress' ? 'text-white' : 'text-[#4B4B4B]'
                            }`}
                        style={{ fontFamily: "HankenGrotesk_600SemiBold" }}
                    >
                        Progres
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setSelectedFilter('Done')}
                    className={`px-4 py-2 rounded-full ${selectedFilter === 'Done' ? 'bg-black' : 'bg-white border-2 border-[#E5E5E5]'
                        }`}
                    activeOpacity={0.7}
                >
                    <Text
                        className={`text-[14px] ${selectedFilter === 'Done' ? 'text-white' : 'text-[#4B4B4B]'
                            }`}
                        style={{ fontFamily: "HankenGrotesk_600SemiBold" }}
                    >
                        Selesai
                    </Text>
                </TouchableOpacity>
            </HStack>

            {/* Task Cards */}
            {filteredTasks.length === 0 ? (
                <View className='py-10 items-center'>
                    <Text className='text-[14px] text-[#9CA3AF]' style={{ fontFamily: "HankenGrotesk_400Regular" }}>
                        {selectedFilter === 'All' ? 'Belum ada task hari ini' : `Tidak ada task ${selectedFilter === 'On Progress' ? 'Progres' : 'Selesai'}`}
                    </Text>
                </View>
            ) : (
                <VStack className='gap-4 mb-20'>
                    {filteredTasks.map((task) => (
                        <Box key={task.id} className='bg-white border-2 rounded-[8px] p-5 relative'>
                            <VStack className='gap-3'>
                                {/* Title and Checkbox */}
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
        </View>
    );
}
