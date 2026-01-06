import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { CircleArrowRight } from "lucide-react-native";
import React from 'react';
import { Text, View } from 'react-native';

interface customClassType{
    customClass?:string
}

export default function TaskSummary({customClass}:customClassType) {
    return (
        <View className={`${customClass} `}>
            <Text className=' mb-[10px] text-[18px] text-[#4B4B4B]' style={{ fontFamily: "HankenGrotesk_800ExtraBold_Italic" }}>{"TASK SUMMARY (Today)"}</Text>
            <HStack className='justify-between'>
                <Box className='border-2 py-[9px] px-[15px] rounded-[8px] w-[48%] bg-white'>
                    <HStack className='justify-between items-center'>
                        <Text className='text-[14px]' style={{ fontFamily: "HankenGrotesk_500Medium" }}>Complete</Text>
                        <CircleArrowRight color={'#4b4b4b'} />
                    </HStack>
                    <HStack className='items-center mt-[3px] '>
                        <Text className='text-[30px]' style={{ fontFamily: "HankenGrotesk_800ExtraBold_Italic" }}>2</Text>
                        <Text className='text-[]' style={{ fontFamily: "HankenGrotesk_500Medium_Italic" }}> Task Activity</Text>
                    </HStack>
                </Box>

                <Box className='border-2 py-[9px] px-[15px] rounded-[8px] w-[48%] bg-white'>
                    <HStack className='justify-between items-center'>
                        <Text className='text-[14px]' style={{ fontFamily: "HankenGrotesk_500Medium" }}>Not Complete</Text>
                        <CircleArrowRight color={'#4b4b4b'} />
                    </HStack>
                    <HStack className='items-center mt-[3px]'>
                        <Text className='text-[30px]' style={{ fontFamily: "HankenGrotesk_800ExtraBold_Italic" }}>12</Text>
                        <Text className='text-[]' style={{ fontFamily: "HankenGrotesk_500Medium_Italic" }}> Task Activity</Text>
                    </HStack>
                </Box>
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
