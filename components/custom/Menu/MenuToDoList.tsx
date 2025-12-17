import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { router } from 'expo-router';
import { BookAlertIcon, BookMarked, GroupIcon, NotebookPen } from 'lucide-react-native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface MenuItem {
    label: string,
    icon: React.ComponentType<any>,
    route: string,
    onPress?: () => void,
}
interface customClassType {
    customClass?: string,
}
const menuItems: MenuItem[] = [
    { label: "Tasks", icon: BookAlertIcon, route: "/(screen)/Task" },
    { label: "Group Task", icon: GroupIcon, route: "/(screen)/GroupTask" },
    { label: "History Task", icon: BookMarked, route: "/(screen)/HistoryTask" },
    { label: "???", icon: NotebookPen, route: "/(screen)/???" },
];

export default function MenuToDoList({ customClass }: customClassType) {
    return (
        <View className={`${customClass}`}>
            <VStack>
                <HStack className='justify-between mt-[25px]'>
                    {menuItems.map((item, index) => (
                        <>
                            <Pressable key={index} onPress={() => router.push(item.route)}>
                            <VStack className='justify-center items-center gap-2'>
                                <Box className='rounded-full bg-white border-2 w-16 h-16 flex justify-center items-center border-gray-700'>
                                    <item.icon color="#4b4b4b" size={24} />
                                </Box>
                                <Text className='' style={{ fontFamily: "HankenGrotesk_400Regular_Italic" }}>{item.label}</Text>
                            </VStack>
                        </Pressable>

                            {/* <TouchableOpacity
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
                            </TouchableOpacity> */}
                        </>
                    ))}
                </HStack>
            </VStack>
        </View>
    )
}