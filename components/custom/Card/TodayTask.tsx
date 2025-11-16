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
    return (
        <View className='mb-[80px]'>
            <Text className='tracking-[-1.1px] text-[24px] px-[30px]' style={{ fontFamily: "HankenGrotesk_800ExtraBold_Italic" }}>Group Task</Text>
            <ScrollView 
            className='mt-[14px]'
            horizontal showsHorizontalScrollIndicator={true}>
                <HStack className='gap-3 ml-[30px] mb-[30px]'>
                    <Tab name='All' isActive={active === 'All'} onPress={()=>setActive('All')}/>
                    <Tab name='On Progress' isActive={active === 'On Progress'} onPress={()=>setActive('On Progress')}/>
                    <Tab name='Done' isActive={active === 'Done'} onPress={()=>setActive('Done')}/>
                </HStack>
            </ScrollView>
            <VStack className={`${customClass} gap-5`}>
                <ListTodo 
                    title='Activity 1' 
                    description='Makan minum lari ngoding tidur' 
                    start_time='08:30' 
                    end_time='22:00' 
                    status='On Progress'/>
                <ListTodo title='Activity 1' description='Makan minum lari ngoding tidur' start_time='08:30' end_time='22:00' status='Success'/>
                <ListTodo title='Activity 1' description='Makan minum lari ngoding tidur' start_time='08:30' end_time='22:00' status='On Progress'/>
            </VStack>
        </View>
    )
}