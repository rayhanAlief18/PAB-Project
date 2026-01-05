import { Box } from '@/components/ui/box'
import React from 'react'
import { Pressable, Text } from 'react-native'

interface customClassType {
    customClass?: string
    name: string,
    isActive?: boolean,
    onPress?: () => void,
}

export default function Tab({ customClass, name, isActive, onPress }: customClassType) {
    return (
        <Pressable onPress={onPress}>
            <Box className={`rounded-full border-[2px] px-[28px] py-[8px] ${isActive ? 'bg-[#2B8D47] border-gray-200' : 'bg-white border-[#4b4b4b]'}`}>
                <Text className={`text-[18px] ${isActive ? 'text-white' : 'text-[#4b4b4b]'}`}
                    style={{ fontFamily: 'HankenGrotesk_500Medium' }}>
                    {name}
                </Text>
            </Box>
        </Pressable>
    )
}
