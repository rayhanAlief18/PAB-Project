import { Button } from '@/components/ui/button'
import React from 'react'
import { Text } from 'react-native'
interface buttonPropsType{
    color: "green" | "red",
    title: string,
    onPress: () => void,
}
export default function index(props: buttonPropsType) {
    return (
        <Button
            onPress={props.onPress}
            className={`${props.color == 'green' ? 'bg-[#2B8D47]' : 'bg-[#B93737]'} rounded-full px-8 h-14 mt-12 
                            active:bg-[#1E6B38] shadow-lg shadow-[#2B8D47]/30
                            transition-all duration-200 ease-in-out`}
            isHovered={false}
        >
            <Text
                className="text-white text-lg font-semibold tracking-wider"
                style={{ fontFamily: "HankenGrotesk_500Medium" }}
            >
                {props.title}
            </Text>
        </Button>
    )
}
