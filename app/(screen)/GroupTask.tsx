import HeaderPage from '@/components/custom/HeaderPage'
import { Center } from '@/components/ui/center'
import { Stack } from 'expo-router'
import React from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function GroupTask() {
    return (
        <View className='flex-1 bg-'>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView className="flex-1 bg-[#F2F2F4]">
                <HeaderPage title='GroupTask' />
                <Center className='text-black items-center flex-1'>Ini Halaman GroupTask Page</Center>
            </SafeAreaView>
        </View>
    )
}
