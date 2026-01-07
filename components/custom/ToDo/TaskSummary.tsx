import { HStack } from '@/components/ui/hstack';
import { useTasks } from '@/contexts/TaskContext';
import { router } from 'expo-router';
import { CircleArrowRight } from "lucide-react-native";
import React, { useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface customClassType {
    customClass?: string
}

export default function TaskSummary({ customClass }: customClassType) {
    // Ambil data tasks dari context
    const { tasks } = useTasks();

    // Filter tasks untuk hari ini
    const todayTasks = useMemo(() => {
        const today = new Date();
        return tasks.filter(task => {
            const taskDate = new Date(task.startTime);
            return (
                taskDate.getDate() === today.getDate() &&
                taskDate.getMonth() === today.getMonth() &&
                taskDate.getFullYear() === today.getFullYear()
            );
        });
    }, [tasks]);

    // Hitung tasks yang belum selesai (On Progress)
    const notCompleteTasks = useMemo(() => {
        return todayTasks.filter(task => task.status === 'On Progress');
    }, [todayTasks]);

    // Hitung tasks yang sudah selesai (Done)
    const completedTasks = useMemo(() => {
        return todayTasks.filter(task => task.status === 'Done');
    }, [todayTasks]);

    return (
        <View className={`${customClass} `}>
            <Text className=' mb-[10px] text-[18px] text-[#4B4B4B]' style={{ fontFamily: "HankenGrotesk_800ExtraBold_Italic" }}>{"TASK SUMMARY (Today)"}</Text>
            <HStack className='justify-between'>
                {/* Not Complete Tasks */}
                <TouchableOpacity
                    className='border-2 py-[9px] px-[15px] rounded-[8px] w-[48%] bg-white'
                    onPress={() => router.push('/tasks')}
                    activeOpacity={0.7}
                >
                    <HStack className='justify-between items-center'>
                        <Text className='text-[14px]' style={{ fontFamily: "HankenGrotesk_500Medium" }}>Complete</Text>
                        <CircleArrowRight color={'#4b4b4b'} />
                    </HStack>
                    <HStack className='items-center mt-[3px] '>
<<<<<<< HEAD
                        <Text className='text-[30px]' style={{ fontFamily: "HankenGrotesk_800ExtraBold_Italic" }}>2</Text>
=======
                        <Text className='text-[30px]' style={{ fontFamily: "HankenGrotesk_800ExtraBold_Italic" }}>{notCompleteTasks.length}</Text>
>>>>>>> origin/azhimD
                        <Text className='text-[]' style={{ fontFamily: "HankenGrotesk_500Medium_Italic" }}> Task Activity</Text>
                    </HStack>
                </TouchableOpacity>

                {/* Completed Tasks */}
                <TouchableOpacity
                    className='border-2 py-[9px] px-[15px] rounded-[8px] w-[48%] bg-white'
                    onPress={() => router.push('/tasks')}
                    activeOpacity={0.7}
                >
                    <HStack className='justify-between items-center'>
<<<<<<< HEAD
                        <Text className='text-[14px]' style={{ fontFamily: "HankenGrotesk_500Medium" }}>Not Complete</Text>
                        <CircleArrowRight color={'#4b4b4b'} />
=======
                        <Text className='text-[14px]' style={{ fontFamily: "HankenGrotesk_500Medium" }}>Completed</Text>
                        <CircleArrowRight />
>>>>>>> origin/azhimD
                    </HStack>
                    <HStack className='items-center mt-[3px]'>
                        <Text className='text-[30px]' style={{ fontFamily: "HankenGrotesk_800ExtraBold_Italic" }}>{completedTasks.length}</Text>
                        <Text className='text-[]' style={{ fontFamily: "HankenGrotesk_500Medium_Italic" }}> Task Activity</Text>
                    </HStack>
                </TouchableOpacity>
            </HStack>
            <Box className='border-2 py-[9px] px-[15px] rounded-[8px] mt-3 bg-white'>
                    <HStack className='justify-between items-center'>
                        <Text className='text-[14px]' style={{ fontFamily: "HankenGrotesk_500Medium" }}>Goup Task</Text>
                        <CircleArrowRight color={'#4b4b4b'} />
                    </HStack>
                    <HStack className='items-center mt-[3px]'>
                        <Text className='text-[30px]' style={{ fontFamily: "HankenGrotesk_800ExtraBold_Italic" }}>4</Text>
                        <Text className='text-[14px]' style={{ fontFamily: "HankenGrotesk_500Medium_Italic" }}> Group Task Activity</Text>
                    </HStack>
                </Box>
        </View>
    )
}
