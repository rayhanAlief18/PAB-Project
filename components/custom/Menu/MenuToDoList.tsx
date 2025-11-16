import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { router } from 'expo-router';
import { BookAlertIcon, BookMarked, GroupIcon, NotebookPen } from 'lucide-react-native';
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
    { label: "Task", icon: BookAlertIcon, onPress: () => router.push('/tasks') },
    { label: "Group Task", icon: GroupIcon },
    { label: "History Task", icon: BookMarked },
    { label: "???", icon: NotebookPen },
];

export default function MenuToDoList({customClass}:customClassType) {
    return (
        <View className={`${customClass}`}>
            <VStack>
                <HStack className='justify-between mt-[25px]'>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={item.onPress}
                            activeOpacity={0.7}
                            disabled={!item.onPress}
                        >
                            <VStack className='justify-center items-center gap-2'>
                            <Box className='rounded-full bg-white border-2 border-black w-16 h-16 flex justify-center items-center'>
                                <item.icon size={24} color='#4B4B4B' />
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