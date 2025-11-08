import React from 'react'
import { View, Text } from 'react-native'
import { Heading } from '@/components/ui/heading';
import { Box } from '@/components/ui/box';
import { VStack } from '../ui/vstack';
import { HStack } from '../ui/hstack';
import {
    Avatar,
    AvatarFallbackText,
    AvatarImage,
    AvatarBadge,
} from '@/components/ui/avatar';

//icon
import { Settings } from "lucide-react-native";
import { HankenGrotesk_800ExtraBold_Italic } from '@expo-google-fonts/hanken-grotesk';

interface HeaderProps{
    name:string,
}
export default function Header({name}:HeaderProps) {
    const sambutan = ()=>{
        const jam = new Date().getHours();
        if (jam >= 5 && jam < 11) return 'Good Morning';
        if (jam >= 11 && jam < 15) return 'Good Afternoon';
        if (jam >= 15) return 'Good Evening';
        return 'Good Night';
    }
    return (
        <>
            <Box className="bg-white py-4" >
                <HStack space="md" reversed={false} className='justify-between items-center px-4'>
                    <HStack className='gap-4 items-center'>
                        <Avatar size="lg" className='border-2 border-[#4b4b4b]'>
                            <AvatarFallbackText>Rayhan Alief F</AvatarFallbackText>
                            <AvatarImage
                                source={{
                                    uri: 'https://i.pinimg.com/736x/91/0a/b5/910ab59abc5aed1805485ddc299a6a11.jpg',
                                }}
                            />
                            <AvatarBadge />
                        </Avatar>
                        <VStack>
                            <Text className='text-[12px]' style={{ fontFamily: "HankenGrotesk_400Regular"}}>{sambutan()}</Text>
                            <Text className='text-[18px] tracking-[-1.1px]' style={{ fontFamily: "HankenGrotesk_700Bold_Italic"}}>
                                {name}
                            </Text>

                        </VStack>
                    </HStack>
                    <Settings color='#4b4b4b' size={24} />
                </HStack>
            </Box>
        </>
    )
}
