import { FormPriorityPicker } from '@/components/custom/Form'
import HeaderPage from '@/components/custom/HeaderPage'
import FormInputs from '@/components/custom/Input/FormInput'
import { TaskPriority } from '@/contexts/TaskContext'
import React, { useState } from 'react'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
export default function SubTask() {
    const [task, setTask] = useState('');
    const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
    
    useState
    return (
        <SafeAreaView className='flex-1 bg-gray-50'>
            <HeaderPage title='Create SubTask' />
            <View className='px-5 mt-4 mb-6'>
                <FormInputs 
                    title='SubTask Name'
                    value={task}
                    isRequired={true}
                    typeInput='default'
                    variant='rounded'
                    setOnChange={setTask}
                    placeholder='Enter subtask name...' 
                    />

                <FormPriorityPicker 
                label='Priority'
                value={priority}
                onChange={setPriority}

                />
            </View>
            <Text>SubTask Page</Text>
        </SafeAreaView>
    )
}
