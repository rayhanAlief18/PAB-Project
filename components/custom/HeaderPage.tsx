import { ChevronLeft, UserRoundPen } from 'lucide-react-native'
import React from 'react'
import { Pressable, Text, Touchable, View } from 'react-native'
import { Box } from '../ui/box'
import { HStack } from '../ui/hstack'
import { useNavigation } from 'expo-router'

interface headerPropsType {
    title: string,
}
export default function HeaderPage({ title }: headerPropsType) {
    const navigation = useNavigation();
    return (
        <>
            <View className='mt-[30px] px-[30px]'>
                <Box>
                    <HStack className='items-center justify-between'>
                        <Pressable onPress={()=>navigation.goBack()}>
                            <HStack className='items-center'>
                                <ChevronLeft color={'#4B4B4B'} />
                                <Text className='text-lg text-[#4b4b4b]' style={{ fontFamily: "HankenGrotesk_300Light" }}>Back</Text>
                            </HStack>
                        </Pressable>
                        <Text className='pr-[40px] text-lg mb-[-4px]' style={{ fontFamily: "HankenGrotesk_400Regular" }}>{title}</Text>
                        <UserRoundPen color={'#4B4B4B'} />
                    </HStack>
                </Box>
            </View>
        </>
    )
}
