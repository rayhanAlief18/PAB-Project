import ButtonCustome from '@/components/custom/Button'
import { FormPriorityPicker } from '@/components/custom/Form'
import HeaderPage from '@/components/custom/HeaderPage'
import FormInputs from '@/components/custom/Input/FormInput'
import { VStack } from '@/components/ui/vstack'
import AsyncStorage from "@react-native-async-storage/async-storage"
import { router, useLocalSearchParams } from 'expo-router'
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore"
import { AlertCircle, ListCollapseIcon, LucideListPlus } from 'lucide-react-native'
import React, { useState } from 'react'
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { db } from "../../../../config/Firebase"

interface SubtaskProps {
    id: string,
    task: string,
    priority: 'Low' | 'Medium' | 'High',
    description?: string,
    status: 'On Progress' | 'Done',
    createdAt: Date,
}

interface GroupTaskData {
    id: string;
    name: string;
    description: string;
    deadline: Date | null;
    status: 'On Progress' | 'Done';
    priority: 'Low' | 'Medium' | 'High';
    task: SubtaskProps[];
    createdAt: string;
    synced?: boolean;
}

export default function SubTask() {
    const id = useLocalSearchParams<{ id: string }>().id;

    const [task, setTask] = useState('');
    const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
    const [description, setDescription] = useState('');
    const [estimatedTime, setEstimatedTime] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [errors, setErrors] = useState({
        task: '',
    });

    const validateForm = () => {
        const newErrors = {
            task: '',
        };

        if (!task.trim()) {
            newErrors.task = 'SubTask name wajib di isi';
        }

        setErrors(newErrors);
        return !newErrors.task;
    };

    const buildSubTaskData = (): SubtaskProps => {
        return {
            id: id + Date.now().toString(),
            task,
            priority,
            description: description ? description : 'Jangan lupa untuk diselesaikan.',
            status: 'On Progress',
            createdAt: new Date(),
        }
    }

    const updateAsyncStorage = async (subtask: SubtaskProps) => {
        try {
            const existingGroupTask = await AsyncStorage.getItem('groupTasks');
            const groupTasks = existingGroupTask ? JSON.parse(existingGroupTask) : [];

            const updateGroupTasks = groupTasks.map((groupTasksItem: GroupTaskData) => {
                if (groupTasksItem.id === id) {
                    return {
                        ...groupTasksItem,
                        task: [...groupTasksItem.task, subtask],
                        synced: false,
                    };
                }
                return groupTasksItem;
            })

            await AsyncStorage.setItem('groupTasks', JSON.stringify(updateGroupTasks));
            console.log('SubTask sudah ditambahkan ke asyncstorage GroupTask id', id);
            return true;
        } catch (error) {
            console.error('Error updating AsyncStorage:', error);
            return false;
        }

    }

    const updateFireStore = async (subtask: SubtaskProps) => {
        try {
            //cari dokumen groupTask dengan id
            const groupTaskRef = doc(db, 'groupTasks', id);
            const docSnap = await getDoc(groupTaskRef);

            if (!docSnap.exists()) {
                console.error('Dokumen tidak ada di firestore')
                return false
            }

            await updateDoc(groupTaskRef, {
                task: arrayUnion(subtask)
            })
            console.log('SubTask tersimpan di Firestore');
            return true;
        } catch (error) {
            console.error('Error updating Firestore:', error);
            return false;
        }
    }

    const macthAsyncStorageWithFireStore = async () => {
        try {
            const existingData = await AsyncStorage.getItem('groupTasks');
            const groupTask = existingData ? JSON.parse(existingData) : [];

            const updateDataFireStore = groupTask.map((groupTask: GroupTaskData) => {
                if (groupTask.id === id) {
                    return {
                        ...groupTask,
                        synced: true
                    }
                }
                return groupTask;
            });

            await AsyncStorage.setItem('groupTasks',
                JSON.stringify(updateDataFireStore)
            )
            console.log('✅ AsyncStorage synced with Firestore');
        } catch (error) {

        }
    }

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }
        if (!id) {
            Alert.alert('Error', 'Group Task ID not found');
            return;
        }

        setIsLoading(true);

        try {
            const subTaskData = buildSubTaskData();
            const asyncSuccess = await updateAsyncStorage(subTaskData);

            if (!asyncSuccess) {
                throw new Error('Failed to save to AsyncStorage');
            }

            //save ke firestore
            const firestoreSuccess = await updateFireStore(subTaskData);

            if (firestoreSuccess) {
                await macthAsyncStorageWithFireStore();
                Alert.alert('Success', 'SubTask created and synced successfully!');
            } else {
                Alert.alert('Saved Locally', 'SubTask saved locally. Will sync when online.');
            }
            router.back();
            console.log('Data AsyncStorage: ', AsyncStorage.getItem('groupTasks'));

        } catch (error) {
            console.error('❌ Error creating subtask:', error);
            Alert.alert('Error', 'Failed to create subtask. Please try again.');
            setIsLoading(false);
        }
    };
    return (
        <SafeAreaView className='flex-1 bg-[#F8F9FA]'>
            <HeaderPage title='Buat Sub Task' />

            <ScrollView
                className='flex-1'
            >
                <View className='px-6 mt-8 bg-[#F8F9FA]'>
                    {/* Main Card */}
                    <View className='rounded-2xl shadow-sm px-5 bg-[#F8F9FA]'>
                        {/* Form Fields */}
                        <VStack className='gap-5 bg-[#F8F9FA]'>
                            {/* SubTask Name */}
                            <View  className='bg-[#F8F9FA]'>
                                <FormInputs
                                    title='Nama Tugas'
                                    value={task}
                                    isRequired={true}
                                    typeInput='default'
                                    variant='rounded'
                                    setOnChange={setTask}
                                    placeholder='Masukkan nama tugas...'
                                    isPassword={false}
                                    icon={ListCollapseIcon}
                                />

                                {/* Error Message */}
                                {errors.task ? (
                                    <View className='flex-row items-center mt-2 bg-red-50 p-3 rounded-lg'>
                                        <AlertCircle size={16} color='#DC2626' />
                                        <Text className='text-red-600 text-sm ml-2 flex-1'>
                                            {errors.task}
                                        </Text>
                                    </View>
                                ) : null}
                            </View>

                            {/* Description */}
                            <View>
                                <FormInputs
                                    title='Deskripsi (Opsional)'
                                    value={description}
                                    isRequired={false}
                                    typeInput='default'
                                    variant='rounded'
                                    setOnChange={setDescription}
                                    placeholder='Masukkan deskripsi...'
                                    isPassword={false}
                                    icon={LucideListPlus}
                                />
                            </View>

                            {/* Priority Picker */}
                            <View>
                                <FormPriorityPicker
                                    label='Prioritas'
                                    value={priority}
                                    onChange={setPriority}
                                />
                            </View>
                        </VStack>
                    </View>
                    {/* Action Buttons */}
                    <VStack className='gap-3 px-2'>
                        <ButtonCustome
                            color='green'
                            title={isLoading ? 'Creating SubTask...' : 'Create SubTask'}
                            onPress={handleSubmit}
                        />

                        <TouchableOpacity
                            className='py-4 rounded-full border-2 border-gray-200 bg-white'
                            onPress={() => {
                                setTask('');
                                setDescription('');
                                setEstimatedTime('');
                                setPriority('Medium');
                            }}
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
