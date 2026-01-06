import HeaderPage from '@/components/custom/HeaderPage'
import { Center } from '@/components/ui/center'
import { Stack } from 'expo-router'
import React from 'react'
import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Cashflow() {
  return (
    <View className='flex-1 '>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-[#F2F2F4] ">
        <HeaderPage title='Cashflow' />
        <Text className='text-black items-center flex-1'>Ini Halaman Cashflow</Text>
      </SafeAreaView>
    </View>
  )
}
