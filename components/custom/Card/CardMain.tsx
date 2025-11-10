// ui import
import { Box } from '@/components/ui/box';
import { Divider } from '@/components/ui/divider';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';

//icon import
import { Wallet } from 'lucide-react-native';

import React from 'react';
import { Text, View } from 'react-native';

interface customClassType{
    customClass?:string
}

export default function CardMain({customClass}:customClassType) {
    return (
        <>
            <View className={`mt-3 ${customClass}`}>
                <Box className="bg-white p-5 border-[2px] rounded-[8px] py-[18px] px-[24px]">
                    <VStack>
                        <HStack className='items-center gap-2 '>
                            <Wallet />
                            <Text style={{fontFamily:"HankenGrotesk_500Medium"}} className='text-[15px]'>Your All Money</Text>
                        </HStack>
                        <Text style={{fontFamily:"HankenGrotesk_800ExtraBold_Italic"}} className='text-[36px] mt-3'>Rp 8.000.000</Text>
                    </VStack>
                    <Divider className='my-[8px] rounded-full bg-[#4B4B4B] h-[2px]'/>
                    <HStack className='justify-between px-4'>
                        <VStack className='items-center'>
                            <Text style={{fontFamily:"HankenGrotesk_500Medium"}} className='text-[15px] text-[#4B4B4B]'>Today Spend</Text>
                            <Text style={{fontFamily:"HankenGrotesk_700Bold_Italic"}} className='text-[24px] mt-1 text-black'>Rp 25.000</Text>
                        </VStack>
                        <VStack className='items-center'>
                            <Text style={{fontFamily:"HankenGrotesk_500Medium"}} className='text-[15px] text-[#4B4B4B]'>Monthly Spend</Text>
                            <Text style={{fontFamily:"HankenGrotesk_700Bold_Italic"}} className='text-[24px] mt-1 text-black'>Rp 380.000</Text>
                        </VStack>
                    </HStack>
                </Box>
            </View>
        </>
    )
}
