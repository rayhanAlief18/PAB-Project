import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { router } from 'expo-router';
import { Banknote, HandCoins, NotebookPen, Wallet } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface MenuItem {
    label: string,
    icon: React.ComponentType<any>,
    onPress?: () => void,
}
interface customClassType{
    customClass?:string,
}
const menuItems: MenuItem[] = [
    { label: "Cashflow", icon: Banknote },
    { label: "Money Placing", icon: Wallet },
    { label: "Saving's", icon: HandCoins },
    { label: "Debt", icon: NotebookPen, onPress: () => router.push('/debts') },
];

export default function MenuMoneyTrack({customClass}:customClassType) {
    return (
        <View className={`${customClass}`}>
            <VStack>
                <Text className='text-[24px]' style={{ fontFamily: "HankenGrotesk_800ExtraBold_Italic" }}>Menu</Text>
                <HStack className='justify-between mt-3'>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={item.onPress}
                            activeOpacity={0.7}
                            disabled={!item.onPress}
                        >
                            <VStack className='justify-center items-center gap-2'>
                                <Box className='rounded-full border-2 border-black w-16 h-16 flex justify-center items-center'>
                                    <item.icon size={24} color='#000000' />
                                </Box>
                                <Text className='' style={{ fontFamily: "HankenGrotesk_400Regular_Italic" }}>{item.label}</Text>
                            </VStack>
                        </TouchableOpacity>
                    ))}
                </HStack>
            </VStack>
        </View>
    )
}
