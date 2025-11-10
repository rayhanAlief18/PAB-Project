import {
    Avatar,
    AvatarBadge,
    AvatarFallbackText,
    AvatarImage,
} from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import React from 'react';
import { Text } from 'react-native';
import { HStack } from '../ui/hstack';
import { VStack } from '../ui/vstack';

//icon
import { Settings } from "lucide-react-native";

interface HeaderProps{
    name:string,
    customClass?:string,
}
export default function Header({name, customClass}:HeaderProps) {
    const sambutan = ()=>{
        const jam = new Date().getHours();
        if (jam >= 5 && jam < 11) return 'Good Morning';
        if (jam >= 11 && jam < 15) return 'Good Afternoon';
        if (jam >= 15) return 'Good Evening';
        return 'Good Night';
    }
    return (
        <>
            <Box className={`bg-transparent py-4 ${customClass}`} >
                <HStack space="md" reversed={false} className='justify-between items-center'>
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
