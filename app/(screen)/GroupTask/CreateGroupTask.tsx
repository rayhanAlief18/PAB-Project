import { FormDatePicker, FormPriorityPicker } from '@/components/custom/Form';
import { TaskPriority } from '@/components/custom/Form/FormPriorityPicker';
import HeaderPage from '@/components/custom/HeaderPage';
import FormInputs from '@/components/custom/Input/FormInput';
import { VStack } from '@/components/ui/vstack';
import { AlertCircle, BookAIcon, Calendar, Clock, TextInitial } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ButtonCustome from '../../../components/custom/Button';

// data
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from 'expo-router';
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../config/Firebase";


export default function CreateGroupTask() {
    const [name, setName] = useState('');
    const [deadline, setDeadline] = useState<Date | null>(null);
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<'On Progress' | 'Done'>('On Progress');
    const [isLoading, setIsLoading] = useState(false);
    const [priority, setPriority] = useState<TaskPriority>('Medium');


    const [errors, setErrors] = useState({
        name: '',
        deadline: '',
    });

    // Set minimum date to today
    const today = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(today.getFullYear() + 1);

    const validateForm = () => {
        const newErrors = {
            name: '',
            deadline: '',
        };

        if (!name.trim()) {
            newErrors.name = 'Nama group harus diisi';
        }

        if (!deadline) {
            newErrors.deadline = 'Deadline harus dipilih';
        } else {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const selectedDate = new Date(deadline);
            selectedDate.setHours(0, 0, 0, 0);
            if (selectedDate < today) {
                newErrors.deadline = 'Deadline tidak boleh lebih kecil dari hari ini';
            }
        }

        setErrors(newErrors);
        return !newErrors.name && !newErrors.deadline;
    };

    interface GroupTaskData {
        id: string;
        name: string;
        description: string;
        deadline: Date | null;
        status: 'On Progress' | 'Done';
        priority: 'Low' | 'Medium' | 'High';
        task: any[];
        createdAt: string;
        synced?: boolean;
    }

    const buildGroupTaskData = (): GroupTaskData => {
        return {
            id: Date.now().toString(),
            name,
            description,
            deadline,
            status,
            priority,
            task: [],
            createdAt: new Date().toISOString(),
            synced: false,
        };
    };

    const saveToAsyncStorage = async (groupTaskData: GroupTaskData) => {
        const existing = await AsyncStorage.getItem('groupTasks');
        const data = existing ? JSON.parse(existing) : [];

        await AsyncStorage.setItem(
            'groupTasks',
            JSON.stringify([...data, groupTaskData])
        );
    };

    const saveToFirestore = async (groupTaskData: GroupTaskData) => {
        const docRef = doc(db, 'groupTasks', groupTaskData.id);
        await setDoc(docRef, {
            ...groupTaskData,
            synced: true
        }, { merge: true });
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        const taskData = buildGroupTaskData();

        try {
            await saveToAsyncStorage(taskData);
            await saveToFirestore({ ...taskData });

            const lokal = await AsyncStorage.getItem('groupTasks');
            const parsed = lokal ? JSON.parse(lokal) : [];

            const updateLokal = parsed.map((item: GroupTaskData) =>
                item.id === taskData.id ? { ...item, synced: true } : item
            );

            await AsyncStorage.setItem(
                'groupTasks',
                JSON.stringify(updateLokal)
            )

            console.log('Group task saved and synced successfully.');
            Alert.alert('Berhasil', 'Group task berhasil dibuat!', [
                { text: 'OK', onPress: () => router.replace('/(screen)/GroupTask') }
            ]);
        } catch (error) {
            console.error("❌ Gagal sync Firestore, data tetap di lokal", error);
            Alert.alert('Tersimpan Lokal', 'Task tersimpan di lokal. Akan disinkronkan saat online.');
        } finally {
            setIsLoading(false);
        }
    }

    const getDaysUntilDeadline = () => {
        if (!deadline) return null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const deadlineDate = new Date(deadline);
        deadlineDate.setHours(0, 0, 0, 0);
        const diffTime = deadlineDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    console.log('Deadline selected:', deadline);

    return (
        <SafeAreaView className='flex-1 bg-[#F8F9FA]'>
            <HeaderPage title='Create Group Task' />

            <ScrollView
                className='flex-1'
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                <View className="px-6 bg-[#F8F9FA] pt-6">
                    {/* Main Form Card */}
                    <View className="bg-[#F8F9FA] px-4">
                        <VStack className='gap-5 bg-[#F8F9FA]'>
                            {/* Group Name Input */}
                            <View className='bg-[#F8F9FA]'>
                                <FormInputs
                                    typeInput='default'
                                    isPassword={false}
                                    value={name}
                                    title='Group Name'
                                    placeholder="Enter group name"
                                    setOnChange={setName}
                                    variant='rounded'
                                    icon={BookAIcon}
                                />

                                {/* Error Message */}
                                {errors.name ? (
                                    <View className='flex-row items-center mt-2 bg-red-50 p-3 rounded-lg'>
                                        <AlertCircle size={16} color='#DC2626' />
                                        <Text className='text-red-600 text-sm ml-2 flex-1'>
                                            {errors.name}
                                        </Text>
                                    </View>
                                ) : null}
                            </View>

                            {/* Description Input */}
                            <View>
                                <FormInputs
                                    typeInput='default'
                                    isPassword={false}
                                    value={description}
                                    title='Description'
                                    placeholder="Add description for this group"
                                    setOnChange={setDescription}
                                    variant='rounded'
                                    icon={TextInitial}
                                />
                            </View>

                            {/* Priority Selector */}
                            <FormPriorityPicker
                                label="Tingkat Prioritas"
                                value={priority}
                                onChange={setPriority}
                            />

                            {/* Deadline Date Picker */}
                            <View>
                                <FormDatePicker
                                    label="Deadline"
                                    icon={Calendar}
                                    value={deadline}
                                    onChange={setDeadline}
                                    placeholder='Select deadline date'
                                    minimumDate={new Date()}
                                />

                                {/* Error Message */}
                                {errors.deadline ? (
                                    <View className='flex-row items-center mt-2 bg-red-50 p-3 rounded-lg'>
                                        <AlertCircle size={16} color='#DC2626' />
                                        <Text className='text-red-600 text-sm ml-2 flex-1'>
                                            {errors.deadline}
                                        </Text>
                                    </View>
                                ) : null}

                                {/* Days Counter */}
                                {deadline && !errors.deadline && (
                                    <View className="mt-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
                                        <View className="flex-row items-center">
                                            <Clock size={16} color="#2563EB" />
                                            <Text className="text-blue-700 text-sm ml-2 font-semibold">
                                                {getDaysUntilDeadline() === 0
                                                    ? 'Due today!'
                                                    : getDaysUntilDeadline() === 1
                                                        ? 'Due tomorrow'
                                                        : `${getDaysUntilDeadline()} days until deadline`
                                                }
                                            </Text>
                                        </View>
                                    </View>
                                )}
                            </View>
                        </VStack>
                    </View>

                    {/* Action Buttons */}
                    <VStack className="gap-3 px-4">
                        <ButtonCustome
                            color='green'
                            title={isLoading ? 'Creating...' : 'Create Group Task'}
                            onPress={handleSubmit}
                        />

                        <TouchableOpacity
                            className='py-4 rounded-full border-2 border-gray-400 bg-white'
                            onPress={() => {
                                setName('');
                                setDescription('');
                                setDeadline(null);
                                setPriority('Medium');
                                setErrors({ name: '', deadline: '' });
                            }}
                            disabled={isLoading}
                        >
                            <Text className='text-center text-gray-700 font-semibold'>
                                Clear Form
                            </Text>
                        </TouchableOpacity>
                    </VStack>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}