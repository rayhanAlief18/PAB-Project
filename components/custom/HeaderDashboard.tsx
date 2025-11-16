import {
    Avatar,
    AvatarBadge,
    AvatarFallbackText,
    AvatarImage,
} from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import React from 'react';
import { Pressable, Text } from 'react-native';
import { HStack } from '../ui/hstack';
import { VStack } from '../ui/vstack';

//icon
import { router } from 'expo-router';
import { UserRoundCog } from "lucide-react-native";

interface HeaderProps {
    name: string,
    customClass?: string,
}
export default function HeaderDashboard({ name, customClass }: HeaderProps) {
    const sambutan = () => {
        const jam = new Date().getHours();
        if (jam >= 5 && jam < 11) return 'Good Morning';
        if (jam >= 11 && jam < 15) return 'Good Evening';
        if (jam >= 15 && jam < 20) return 'Good Afternoon';
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
                            <Text className='text-[12px]' style={{ fontFamily: "HankenGrotesk_400Regular" }}>{sambutan()}</Text>
                            <Text className='text-[18px] tracking-[-1.1px]' style={{ fontFamily: "HankenGrotesk_700Bold_Italic" }}>
                                {name}
                            </Text>

                        </VStack>
                    </HStack>
                    <Pressable onPress={()=>router.push("/UpdateProfile")}>
                        <UserRoundCog color='#4b4b4b' size={24} />
                    </Pressable>
                </HStack>
            </Box>
        </>
    )
}
