import { HStack } from '@/components/ui/hstack'
import { VStack } from '@/components/ui/vstack'
import React, { useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import Tab from '../Tab/Tab'
import ListTodo from '../ToDo/ListTodo'


interface customClassType {
    customClass?: string
}

export default function TodayTask({ customClass }: customClassType) {

    const [active, setActive] = useState('All');
    const tasks = [
        {
            id: 1,
            title: "Activity 1",
            description: "Makan minum lari ngoding tidur",
            start_time: "08:30",
            end_time: "22:00",
            status: "On Progress",
        },
        {
            id: 2,
            title: "Activity 2",
            description: "Belajar React Native",
            start_time: "10:00",
            end_time: "12:00",
            status: "Success",
        },
        {
            id: 3,
            title: "Activity 3",
            description: "Meeting dengan team",
            start_time: "14:00",
            end_time: "15:00",
            status: "On Progress",
        },
    ];

    const filterTask = tasks.filter(task=>{
        if(active === 'All') return true;
        return task.status === active;
    })
    return (
        <View className='mb-[80px]'>
            <Text className='tracking-[-1.1px] text-[24px] px-[30px]' style={{ fontFamily: "HankenGrotesk_800ExtraBold_Italic" }}>Today Task</Text>
            <ScrollView
                className='mt-[14px]'
                horizontal showsHorizontalScrollIndicator={false}>
                <HStack className='gap-3 ml-[30px] mb-[30px]'>
                    <Tab name='All' isActive={active === 'All'} onPress={() => setActive('All')} />
                    <Tab name='On Progress' isActive={active === 'On Progress'} onPress={() => setActive('On Progress')} />
                    <Tab name='Success' isActive={active === 'Success'} onPress={() => setActive('Success')} />
                </HStack>
            </ScrollView>
            <VStack className={`${customClass} gap-5`}>
                {filterTask.map(task=>(
                    <ListTodo
                        title={task.title}
                        description={task.description}
                        start_time={task.start_time}
                        end_time={task.end_time}
                        status={task.status} 
                        />
                ))}
            </VStack>
        </View>
    )
}
