import { Box } from '@/components/ui/box'
import { HStack } from '@/components/ui/hstack'
import { VStack } from '@/components/ui/vstack'
import { ClockFadingIcon } from 'lucide-react-native'
import React from 'react'
import { Text, View } from 'react-native'

interface attributeListType {
    title: string,
    description: string,
    start_time: string,
    end_time: string,
    status: string,
}

export default function ListTodo({ title, description, start_time, end_time, status }: attributeListType) {
    return (
        <Box className='w-[334px] bg-white p-5 border-2 border-gray-400 rounded-[8px] py-[18px] px-[24px]'>
            <VStack>
                <Text style={{ fontFamily: "HankenGrotesk_900Black_Italic" }} className='text-[24px]'>{title}</Text>
                <Text className='text-[14px] mt-2 text-[#4B4B4B]' style={{ fontFamily: "HankenGrotesk_400Regular" }}>{description}</Text>
                <HStack className='items-center gap-3 mt-3'>
                    <ClockFadingIcon color={"#4b4b4b"} size={20} />
                    <Text className='text-[14px] mt-[1px]' style={{ fontFamily: "HankenGrotesk_500Medium_Italic" }}>{`WIB: ${start_time} - ${end_time}`}</Text>
                </HStack>
            </VStack>
            <View className={`border-2 border-gray-400 rounded-br-[6px] rounded-tl-[6px] absolute right-[-1px] ${status === 'On Progress' ? 'bg-[#D9A127]' : 'bg-[#6BBC1A]'} bottom-0 px-4 mt-2 py-[8px]`}>
                <Text style={{ fontFamily: "HankenGrotesk_700Bold" }} className='text-white'>{status}</Text>
            </View>
        </Box>
    )
}
