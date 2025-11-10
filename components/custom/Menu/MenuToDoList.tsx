import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Banknote, HandCoins, NotebookPen, Wallet } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';

interface MenuItem {
    label: string,
    icon: React.ComponentType<any>,
}
interface customClassType{
    customClass?:string,
}
const menuItems: MenuItem[] = [
    { label: "Cashflow", icon: Banknote },
    { label: "Money Placing", icon: Wallet },
    { label: "Saving's", icon: HandCoins },
    { label: "Debt", icon: NotebookPen },
];

export default function MenuToDoList({customClass}:customClassType) {
    return (
        <View className={`${customClass}`}>
            <VStack>
                <HStack className='justify-between mt-[25px]'>
                    {menuItems.map((item, index) => (
                        <VStack key={index} className='justify-center items-center gap-2'>
                            <Box className='rounded-full border-2 w-16 h-16 flex justify-center items-center'>
                                <item.icon size={24} />
                            </Box>
                            <Text className='' style={{ fontFamily: "HankenGrotesk_400Regular_Italic" }}>{item.label}</Text>
                        </VStack>
                    ))}
                </HStack>
            </VStack>
        </View>
    )
}
