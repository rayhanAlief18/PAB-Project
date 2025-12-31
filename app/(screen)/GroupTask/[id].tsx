import HeaderPage from '@/components/custom/HeaderPage';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { router, useLocalSearchParams } from 'expo-router';
import { AlertCircle, Check, Plus, Trash2Icon } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function CreateSubTask() {
    const id = useLocalSearchParams<{ id: string }>().id;
    const snapPoints = useMemo(() => ['25%'], []);

    const [isDone, setIsDone] = useState(false);

    
    return (
        <SafeAreaView className='flex-1 bg-gray-50'>
            <HeaderPage title='SubTask' />

            <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
                <View className='px-5 py-4'>
                    {/* Info Banner */}
                    <Box className='bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5 flex-row items-center'>
                        <AlertCircle size={20} color="#3B82F6" />
                        <Text
                            className='ml-3 text-blue-700 flex-1'
                            style={{ fontFamily: "HankenGrotesk_500Medium" }}
                        >
                            Creating subtask for Group Task #{id}
                        </Text>
                    </Box>

                    {/* Parent Task Card */}
                    <View className='mb-6'>
                        <Text
                            className='text-sm text-gray-500 mb-3 uppercase tracking-wide'
                            style={{ fontFamily: "HankenGrotesk_600SemiBold" }}
                        >
                            Subtask
                        </Text>

                        <Box className='bg-white rounded-2xl p-5 shadow-sm border border-gray-400'>
                            {/* Header dengan Close Button */}
                            <HStack className='justify-between items-start mb-4'>
                                <Text
                                    className='text-2xl tracking-tight leading-7 flex-1 pr-3'
                                    style={{ fontFamily: "HankenGrotesk_700Bold" }}
                                >
                                    Buat front end group task yayayay
                                </Text>
                                <TouchableOpacity
                                    onPress={() => setIsDone(!isDone)}
                                    activeOpacity={0.7}
                                    className={`rounded-full p-2 ${isDone ? 'bg-green-500' : 'bg-gray-100 border border-gray-200'
                                        }`}
                                >
                                    <Check
                                        size={20}
                                        color={isDone ? 'white' : 'gray'}
                                        strokeWidth={3}
                                    />
                                </TouchableOpacity>

                            </HStack>

                            {/* Priority Badge */}
                            <HStack className='items-center gap-2 mb-4'>
                                <Text
                                    className='text-gray-800  text-md font-semibold'
                                    style={{ fontFamily: "HankenGrotesk_500Medium" }}
                                >
                                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Neque explicabo at dolorem perspiciatis quae repudiandae nulla illo non qui voluptate.
                                </Text>
                            </HStack>

                            {/* Divider */}
                            <View className='h-[1px] bg-gray-100 mb-4' />

                            {/* Bottom Info */}
                            <HStack className='justify-between gap-2 items-center'>
                                <HStack className=' items-center gap-2'>
                                    <HStack className='items-center'>
                                        <Box className='bg-orange-100 border-2 border-red-300 rounded-full px-4 py-1.5'>
                                            <Text
                                                className='text-red-700 text-xs font-semibold'
                                                style={{ fontFamily: "HankenGrotesk_600SemiBold" }}
                                            >
                                                HIGH PRIORITY
                                            </Text>
                                        </Box>
                                    </HStack>

                                    <Box className='bg-amber-100 border border-amber-300 rounded-full px-4 py-2'>
                                        <Text
                                            className='text-amber-700 text-xs font-semibold'
                                            style={{ fontFamily: "HankenGrotesk_600SemiBold" }}
                                        >
                                            On Progress
                                        </Text>
                                    </Box>
                                </HStack>
                                <TouchableOpacity className='rounded-full p-2 bg-red-100'>
                                    <Trash2Icon size={20} color='#c53030' />
                                </TouchableOpacity>
                            </HStack>
                        </Box>
                    </View>

                    {/* Subtasks Section - Placeholder untuk list subtasks */}
                    <View>
                        {/* Empty State */}
                        <Box className='bg-white rounded-2xl p-8 items-center border border-dashed border-gray-300'>
                            <View className='bg-gray-100 rounded-full p-4 mb-3'>
                                <Plus size={24} color='#9CA3AF' />
                            </View>
                            <Text
                                className='text-gray-500 text-center'
                                style={{ fontFamily: "HankenGrotesk_500Medium" }}
                            >
                                No subtasks yet
                            </Text>
                            <Text
                                className='text-gray-400 text-xs text-center mt-1'
                                style={{ fontFamily: "HankenGrotesk_400Regular" }}
                            >
                                Tap the + button to add your first subtask
                            </Text>
                        </Box>
                    </View>
                </View>
            </ScrollView>

            {/* Floating Action Button - Improved */}
            <View className='absolute bottom-6 right-6'>
                <TouchableOpacity
                    onPress={() => router.push({
                        pathname: '/(screen)/GroupTask/SubTask/[id]',
                        params: { id: id },
                    })}

                    className='bg-black rounded-full w-16 h-16 items-center justify-center'
                    activeOpacity={0.8}
                    style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 4.65,
                        elevation: 8,
                    }}
                >
                    <Plus size={28} color='white' strokeWidth={2.5} />
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    )
}