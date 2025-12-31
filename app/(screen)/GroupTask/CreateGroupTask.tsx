import { FormDatePicker } from '@/components/custom/Form'
import HeaderPage from '@/components/custom/HeaderPage'
import FormInputs from '@/components/custom/Input/FormInput'
import { VStack } from '@/components/ui/vstack'
import { Calendar } from 'lucide-react-native'
import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ButtonCustome from '../../../components/custom/Button'

// data
import AsyncStorage from "@react-native-async-storage/async-storage"
import { router } from 'expo-router'
import { addDoc, collection } from "firebase/firestore"
import { db } from "../../../config/Firebase"

export default function CreateGroupTask() {
    const [name, setName] = useState('');
    const [deadline, setDeadline] = useState<Date | null>(null);
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<'On Progress' | 'Done'>('On Progress');
    const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');

    const [errors, setErrors] = useState({
        deadline: '',
    });

    // Set minimum date to today
    const today = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(today.getFullYear() + 1);

    const validateForm = () => {
        const newErrors = {
            deadline: '',
        };

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
        return !newErrors.deadline;
    };

    const Input = {
        name,
        description,
        deadline,
        status,
        priority,
    }

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
    // const buildGroupTaskData:GroupTaskData ={
    //     id: Date.now().toString(),
    //     name,
    //     description,
    //     deadline,
    //     status,
    //     priority,
    //     task:[],
    //     createdAt : new Date().toISOString(),
    //     synced:false,
    // }

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
        await addDoc(
            collection(db, 'groupTasks'),
            { ...groupTaskData, synced: true }
        );
    };


    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }
        const taskData = buildGroupTaskData();
        try {
            await saveToAsyncStorage(taskData);
            await saveToFirestore({ ...taskData});

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
            router.replace('/(screen)/GroupTask')
        } catch (error) {
            console.error("❌ Gagal sync Firestore, data tetap di lokal", error);
        }
    }


    console.log('Deadline selected:', deadline);
    return (
        <SafeAreaView className='flex-1 bg-[#F2F2F7]' >
            <HeaderPage title='Create Group Task' />
            <ScrollView className='flex-1'>
                <VStack>
                    {/* <Text className='text-black items-center flex-1'>Ini Halaman Create Group Task Page</Text> */}
                    <VStack className='px-[35px] mt-[20px] gap-4'>
                        <FormInputs
                            typeInput='default'
                            isPassword={false}
                            value={name}
                            title='Group Name'
                            placeholder="Masukkan nama group"
                            setOnChange={setName}
                            variant='rounded'
                        />

                        <FormInputs
                            typeInput='default'
                            isPassword={false}
                            value={description}
                            title='Deskripsi'
                            placeholder="Masukkan deskripsi"
                            setOnChange={setDescription}
                            variant='rounded'
                        />

                        {/* Deadline Date Picker */}
                        <FormDatePicker
                            label="Deadline"
                            icon={Calendar}
                            value={deadline}
                            onChange={setDeadline}
                            placeholder='Pilih tanggal deadline'
                            minimumDate={new Date()}
                        />

                        {/* <Button
                            className="bg-[#2B8D47] rounded-full px-8 h-14 mt-12 
                            active:bg-[#1E6B38] shadow-lg shadow-[#2B8D47]/30
                            transition-all duration-200 ease-in-out"
                            isHovered={false}
                        >
                            <Text
                                className="text-white text-lg font-semibold tracking-wider"
                                style={{ fontFamily: "HankenGrotesk_500Medium" }}
                            >
                                Simpan
                            </Text>
                        </Button> */}

                        <ButtonCustome
                            color='green'
                            title='Simpan'
                            onPress={handleSubmit}
                        />

                    </VStack>
                </VStack>
            </ScrollView>
        </SafeAreaView >
    )
}
