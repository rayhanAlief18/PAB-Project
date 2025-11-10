import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { CircleArrowRight } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
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

interface customClassType {
    customClass?: string
}
export default function CardGroupTask({ customClass }: customClassType) {
    return (
        <View className={`py-[25px] ${customClass}`}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <HStack className=''>
                    {dummyAccounts.map((item, index) => {
                        const percentage = (item.task_success / item.task_all) * 100;
                        const bar = ((item.task_success / item.task_all) * 100)/100;
                        return (
                            <Box key={index} className='ml-[30px] w-[334px] bg-white p-5 border-[2px] rounded-[8px] py-[18px] px-[24px]'>
                                <VStack>
                                    <Text style={{ fontFamily: "HankenGrotesk_900Black_Italic" }} className='text-[24px] mt-3'>{item.title}</Text>
                                    <Text className='text-[14px] mt-[3px] text-[#4B4B4B]' style={{ fontFamily: "HankenGrotesk_400Regular" }}>{item.description}</Text>
                                    {/* <Text className='text-[48px] my-[13px]' style={{ fontFamily: "HankenGrotesk_800ExtraBold_Italic" }}>3/4 Task</Text> */}
                                    <HStack className='justify-start items-center gap-2 my-[12px] mt-[8px]'>
                                        <Progress.Bar progress={bar} width={200} animated color='black' height={8} />
                                        <Text className='mb-1'>{(item.task_success / item.task_all) * 100} %</Text>
                                    </HStack>
                                    <HStack className='justify-between items-center mt-[12px]'>
                                        <Text className='text-[14px] text-[#4B4B4B]' style={{ fontFamily: "HankenGrotesk_500Medium_Italic" }}>Deadline: {DateNow}</Text>
                                        <HStack className='justify-between items-center gap-3'>
                                            <Text className='text-[14px]' style={{ fontFamily: "HankenGrotesk_500Medium_Italic" }}>See Detail</Text>
                                            <CircleArrowRight />
                                        </HStack>
                                    </HStack>
                                </VStack>
                            </Box>
                        )
                    })}
                </HStack>
            </ScrollView>
        </View>
    )
}


