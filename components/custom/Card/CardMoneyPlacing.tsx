import { Box } from '@/components/ui/box';
import { Divider } from '@/components/ui/divider';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
//icon import
import { CircleArrowRight, Wallet } from 'lucide-react-native';

const dummyAccounts = [
    {
        id: 1,
        user_id: 1,
        name: 'Cash',
        amount: 500000.00,
    },
    {
        id: 2,
        user_id: 1,
        name: 'Bank - BNI',
        amount: 1250000.50,
    },
    {
        id: 3,
        user_id: 2, // User ID yang berbeda untuk simulasi
        name: 'E-Wallet - Dana',
        amount: 35000.00,
    },
    {
        id: 4,
        user_id: 1,
        name: 'Investasi Saham',
        amount: 7500000.00,
    },
    {
        id: 5,
        user_id: 2,
        name: 'Crypto - BTC',
        amount: 150000.75,
    },
];
interface customClassType{
    customClass?:string
}

export default function CardMoneyPlacing({customClass}:customClassType) {
    return (
        <View className={`py-[25px] ${customClass}`}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <HStack className=''>
                    {dummyAccounts.map((item, index) => (
                        <Box key={index} className='ml-[30px] w-[334px] bg-white p-5 border-[2px] rounded-[8px] py-[18px] px-[24px]'>
                            <VStack>
                                <HStack className='items-center gap-2 '>
                                    <Wallet color={'#000000'}/>
                                    <Text style={{ fontFamily: "HankenGrotesk_500Medium" }} className='text-[16px]'>{item.name}</Text>
                                </HStack>
                                <Text style={{ fontFamily: "HankenGrotesk_800ExtraBold_Italic" }} className='text-[36px] mt-3'>Rp {item.amount}</Text>
                            </VStack>
                            <Divider className='my-[8px] rounded-full bg-[#4B4B4B] h-[2px]' />
                            <HStack className='justify-between items-center my-[5px]'>
                                <Text className='text-[14px]' style={{ fontFamily: "HankenGrotesk_700Bold_Italic" }}>Created at 2025/12/18</Text>
                                <Box className=''>
                                    <HStack className='justify-between items-center gap-3'>
                                        <Text className='text-[13px] text-[#2B8D47]' style={{ fontFamily: "HankenGrotesk_700Bold_Italic" }}>See Detail</Text>
                                        <CircleArrowRight color={"#2B8D47"} size={20}/>
                                    </HStack>
                                </Box>
                            </HStack>
                        </Box>
                    ))}
                </HStack>
            </ScrollView>
        </View>
    )
}


