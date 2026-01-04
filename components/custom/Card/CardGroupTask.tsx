import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { db } from '@/config/Firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import * as Progress from 'react-native-progress';
const dummyAccounts = [
    {
        id: 1,
        user_id: 1,
        title: 'Trabas Metpen',
        task_success: 3,
        task_all: 4,
        description: "Kerjakan Bab 1 minggu ini, pada hari jumat responsikan",
    },
    {
        id: 2,
        user_id: 1,
        title: '20KM Run in a Week',
        task_success: 2,
        task_all: 4,
        description: "Rules : Min 5KM easy run atau 3KM interval",
    },
    {
        id: 3,
        user_id: 2, // User ID yang berbeda untuk simulasi
        title: 'Kerjakan UTS PAB, ketentuan 3 halaman ui',
        task_success: 1,
        task_all: 4,
        description: "Kerjakan at least 1 hari 1 halaman",
    },

];

const DateNow = new Date().toLocaleDateString('id-ID', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
}).replace(/-/g, '/')




interface SubtaskProps {
    id: string,
    task: string,
    priority: 'Low' | 'Medium' | 'High',
    description?: string,
    status: 'On Progress' | 'Done',
    createdAt: Date,
}

interface customClassType {
    customClass?: string
}
export default function CardGroupTask({ customClass }: customClassType) {
    const [groupTaskData, setGroupsTaskData] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    let active = true

    const getDataFireStore = async () => {
        const snapshot = await getDocs(collection(db, 'groupTasks'))

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }))
    }

    const loadData = async () => {
        const active = true;
        try {
            const local = await AsyncStorage.getItem("groupTasks");
            if (local) {
                const parsed = local ? JSON.parse(local) : [];
                if (active) setGroupsTaskData(parsed);
                return;
            }

            const checkDatabase = await getDataFireStore()

            if (active) {
                console.log('Data groupTasks tidak ditemukan. Sistem sedang mencari di database.')
                setGroupsTaskData(checkDatabase)
                await AsyncStorage.setItem('groupTasks', JSON.stringify(checkDatabase))
            }

        } catch (error) {
            console.log('Load data eror: ', error)
        }
    }

    useEffect(() => {
        loadData();
    }, []);
    return (
        <View className={`py-[25px] ${customClass}`}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <HStack className=''>
                    {groupTaskData.map((item, index) => {
                        const taskDone = item.task.filter((t: SubtaskProps) => t.status === 'Done').length
                        const all_tasks = item.task.length;
                        const bar = ((taskDone / all_tasks) * 100) / 100;
                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={() => router.push({
                                    pathname: '/(screen)/GroupTask/[id]',
                                    params: { id: item.id }
                                })}
                                activeOpacity={0.7}
                            >
                                <Box className='ml-[30px] bg-white p-5 border border-gray-400 rounded-[8px] py-[18px] px-[24px]'>
                                    <VStack className='gap-2'>
                                        <Text style={{ fontFamily: "HankenGrotesk_800ExtraBold" }} className='text-[24px]'>{item.name}</Text>
                                        <Text className='text-[14px] mt-[3px] text-[#4B4B4B]' style={{ fontFamily: "HankenGrotesk_400Regular" }}>{item.description}</Text>
                                        {/* <Text className='text-[48px] my-[13px]' style={{ fontFamily: "HankenGrotesk_800ExtraBold_Italic" }}>3/4 Task</Text> */}
                                        <HStack className='justify-start items-center gap-2 my-[12px] mt-[8px]'>
                                            <Progress.Bar progress={bar} width={200} animated color='black' height={8} />
                                            <Text className='mb-1' style={{ fontFamily: "HankenGrotesk_900Black_Italic" }}>{(taskDone / all_tasks) * 100} %</Text>
                                        </HStack>
                                        <HStack className='justify-between items-center mt-[12px]'>
                                            <Text className='text-[14px]' style={{ fontFamily: "HankenGrotesk_500Medium_Italic" }}>Deadline: {DateNow}</Text>
                                        </HStack>
                                    </VStack>
                                </Box>
                            </TouchableOpacity>
                        )
                    })}
                </HStack>
            </ScrollView>
        </View>
    )
}