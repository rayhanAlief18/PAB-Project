import HeaderPage from '@/components/custom/HeaderPage'
import { Stack } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function MoneyPlacing() {
    return (
        <View className='flex-1 bg-'>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView className="flex-1 bg-[#F2F2F4]">
                <HeaderPage title='Money Placing' />
                <Text className='text-black items-center flex-1'>Ini Halaman Money Placing</Text>
            </SafeAreaView>
        </View>
    )
}
