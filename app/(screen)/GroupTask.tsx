import HeaderPage from '@/components/custom/HeaderPage'
import { Box } from '@/components/ui/box'
import { HStack } from '@/components/ui/hstack'
import { VStack } from '@/components/ui/vstack'
import AsyncStorage from "@react-native-async-storage/async-storage"
import { router } from 'expo-router'
import { Briefcase, CircleArrowRight, Clock, Plus, Trash2 } from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import * as Progress from 'react-native-progress'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function GroupTask() {
    const [groupTaskData, setGroupsTaskData] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async () => {
        const local = await AsyncStorage.getItem("groupTasks");
        const parsed = local ? JSON.parse(local) : [];
        setGroupsTaskData(parsed);
    };

    useEffect(() => {
        loadData();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    const getPriorityColor = (priority: string) => {
        switch (priority?.toLowerCase()) {
            case 'high':
                return { bg: 'bg-red-100', border: 'border-red-300', text: 'text-red-700' };
            case 'medium':
                return { bg: 'bg-amber-100', border: 'border-amber-300', text: 'text-amber-700' };
            case 'low':
                return { bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-700' };
            default:
                return { bg: 'bg-gray-100', border: 'border-gray-300', text: 'text-gray-700' };
        }
    };

    const getProgressColor = (percentage: number) => {
        if (percentage >= 75) return '#10B981'; // green
        if (percentage >= 50) return '#3B82F6'; // blue
        if (percentage >= 25) return '#F59E0B'; // amber
        return '#EF4444'; // red
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <HeaderPage title='Group Tasks' />
            
            <ScrollView 
                className='flex-1'
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Stats Header */}
                {groupTaskData.length > 0 && (
                    <View className='px-5 pt-4 pb-2'>
                        <HStack className='gap-3'>
                            <Box className='flex-1 bg-white rounded-2xl p-4 border border-gray-400'>
                                <Text 
                                    className='text-gray-500 text-xs mb-1' 
                                    style={{ fontFamily: "HankenGrotesk_500Medium" }}
                                >
                                    Total Tasks
                                </Text>
                                <Text 
                                    className='text-2xl' 
                                    style={{ fontFamily: "HankenGrotesk_700Bold" }}
                                >
                                    {groupTaskData.length}
                                </Text>
                            </Box>
                            <Box className='flex-1 bg-white rounded-2xl p-4 border border-gray-400'>
                                <Text 
                                    className='text-gray-500 text-xs mb-1' 
                                    style={{ fontFamily: "HankenGrotesk_500Medium" }}
                                >
                                    Completed
                                </Text>
                                <Text 
                                    className='text-2xl text-green-600' 
                                    style={{ fontFamily: "HankenGrotesk_700Bold" }}
                                >
                                    {groupTaskData.filter(t => t.task_success === t.task_all).length}
                                </Text>
                            </Box>
                        </HStack>
                    </View>
                )}

                <VStack className='px-5 py-4 gap-4'>
                    {groupTaskData.length === 0 ? (
                        // Empty State
                        <View className='flex-1 items-center justify-center py-20'>
                            <View className='bg-gray-100 rounded-full p-6 mb-4'>
                                <Briefcase size={48} color='#9CA3AF' strokeWidth={1.5} />
                            </View>
                            <Text 
                                className='text-xl text-gray-900 mb-2' 
                                style={{ fontFamily: "HankenGrotesk_700Bold" }}
                            >
                                No Group Tasks Yet
                            </Text>
                            <Text 
                                className='text-gray-500 text-center px-8' 
                                style={{ fontFamily: "HankenGrotesk_400Regular" }}
                            >
                                Create your first group task to start collaborating with your team
                            </Text>
                        </View>
                    ) : (
                        groupTaskData.map((item, index) => {
                            const percentage = Math.round((item.task_success / item.task_all) * 100);
                            const progress = percentage / 100;
                            const progressColor = getProgressColor(percentage);
                            const isCompleted = item.task_success === item.task_all;
                            
                            const deadline = new Date(item.deadline).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            });

                            const priority = getPriorityColor(item.priority || 'medium');

                            return (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => router.push({
                                        pathname: '/(screen)/GroupTask/[id]',
                                        params: { id: item.id }
                                    })}
                                    activeOpacity={0.7}
                                >
                                    <Box className='bg-white rounded-2xl p-5 border border-gray-400 shadow-sm'>
                                        {/* Header */}
                                        <HStack className='justify-between items-start mb-3'>
                                            <View className='flex-1 pr-3'>
                                                <Text 
                                                    className='text-xl leading-6 text-gray-900 mb-1' 
                                                    style={{ fontFamily: "HankenGrotesk_700Bold" }}
                                                    numberOfLines={2}
                                                >
                                                    {item.name}
                                                </Text>
                                            </View>
                                            {isCompleted && (
                                                <View className='bg-red-100 rounded-full p-1.5'>
                                                    <Trash2 size={20} color='#EF4444' strokeWidth={2.5} />
                                                </View>
                                            )}
                                        </HStack>

                                        {/* Description */}
                                        {item.description && (
                                            <Text 
                                                className='text-sm text-gray-600 mb-4 leading-5' 
                                                style={{ fontFamily: "HankenGrotesk_400Regular" }}
                                                numberOfLines={2}
                                            >
                                                {item.description}
                                            </Text>
                                        )}

                                        {/* Progress Section */}
                                        <View className='mb-4'>
                                            <HStack className='justify-between items-center mb-2'>
                                                <Text 
                                                    className='text-xs text-gray-500' 
                                                    style={{ fontFamily: "HankenGrotesk_500Medium" }}
                                                >
                                                    Progress
                                                </Text>
                                                <HStack className='items-center gap-1'>
                                                    <Text 
                                                        className='text-sm' 
                                                        style={{ fontFamily: "HankenGrotesk_600SemiBold" }}
                                                    >
                                                        {item.task_success}/{item.task_all}
                                                    </Text>
                                                    <Text 
                                                        className='text-xs text-gray-500' 
                                                        style={{ fontFamily: "HankenGrotesk_500Medium" }}
                                                    >
                                                        tasks
                                                    </Text>
                                                </HStack>
                                            </HStack>
                                            <HStack className='items-center gap-3'>
                                                <Progress.Bar 
                                                    progress={20 / 100} 
                                                    width={null}
                                                    style={{ flex: 1 }}
                                                    animated 
                                                    color={progressColor}
                                                    unfilledColor='#E5E7EB'
                                                    borderWidth={0}
                                                    height={6}
                                                    borderRadius={3}
                                                />
                                                <Text 
                                                    className='text-sm min-w-[45px] text-right' 
                                                    style={{ 
                                                        fontFamily: "HankenGrotesk_700Bold",
                                                        color: progressColor 
                                                    }}
                                                >
                                                    {percentage}%
                                                </Text>
                                            </HStack>
                                        </View>

                                        {/* Divider */}
                                        <View className='h-[1px] bg-gray-100 mb-4' />

                                        {/* Footer */}
                                        <HStack className='justify-between items-center'>
                                            <HStack className='items-center gap-2 flex-1'>
                                                <View className='bg-blue-50 rounded-full p-1.5'>
                                                    <Clock size={14} color='#3B82F6' />
                                                </View>
                                                <Text 
                                                    className='text-xs text-gray-600 flex-1' 
                                                    style={{ fontFamily: "HankenGrotesk_500Medium" }}
                                                    numberOfLines={1}
                                                >
                                                    {deadline}
                                                </Text>
                                            </HStack>

                                            <HStack className='items-center gap-2'>
                                                {item.priority && (
                                                    <Box className={`${priority.bg} ${priority.border} border rounded-full px-3 py-1`}>
                                                        <Text 
                                                            className={`${priority.text} text-[10px] font-semibold uppercase`}
                                                            style={{ fontFamily: "HankenGrotesk_600SemiBold" }}
                                                        >
                                                            {item.priority}
                                                        </Text>
                                                    </Box>
                                                )}
                                                <View className='bg-gray-100 rounded-full p-1.5'>
                                                    <CircleArrowRight size={16} color='#4B5563' />
                                                </View>
                                            </HStack>
                                        </HStack>
                                    </Box>
                                </TouchableOpacity>
                            );
                        })
                    )}
                </VStack>

                {/* Bottom Spacing */}
                <View className='h-24' />
            </ScrollView>

            {/* Floating Action Button */}
            <View className='absolute bottom-6 right-6'>
                <TouchableOpacity
                    onPress={() => router.push('/(screen)/GroupTask/CreateGroupTask')}
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
    );
}