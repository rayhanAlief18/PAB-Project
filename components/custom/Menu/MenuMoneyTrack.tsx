import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { router } from 'expo-router';
import { Banknote, HandCoins, NotebookPen, Wallet } from 'lucide-react-native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface MenuItem {
    label: string,
    icon: React.ComponentType<any>,
    route:string,
}
interface customClassType {
    customClass?: string,
}
const menuItems: MenuItem[] = [
    { label: "CashFlow", icon: Banknote, route: "/(screen)/Cashflow" },
    { label: "Money Placing", icon: Wallet, route: "/(screen)/MoneyPlacing" },
    { label: "Saving's", icon: HandCoins, route: "/(screen)/Saving" },
    { label: "Debt", icon: NotebookPen, route: "/(screen)/Debt" },
];

export default function MenuMoneyTrack({ customClass }: customClassType) {
    return (
        <View className={`${customClass}`}>
            <VStack>
                {/* <Text className='text-[22px]' style={{ fontFamily: "HankenGrotesk_800ExtraBold_Italic" }}>MENU </Text> */}
                <HStack className='justify-between mt-3'>
                    {menuItems.map((item, index) => (
                        
                        <Pressable onPress={()=>router.push(item.route)}>
                            <VStack key={index} className='justify-center items-center gap-2'>
                                <Box className='rounded-full border-2 w-16 h-16 flex bg-white justify-center items-center border-gray-700'>
                                    <item.icon color="#4b4b4b" size={24} />
                                </Box>
                                <Text className='' style={{ fontFamily: "HankenGrotesk_400Regular_Italic" }}>{item.label}</Text>
                            </VStack>
                        </Pressable>
                    ))}
                </HStack>
            </VStack>
        </View>
    )
}
