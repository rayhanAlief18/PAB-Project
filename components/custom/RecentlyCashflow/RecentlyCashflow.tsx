import {
    Avatar,
    AvatarFallbackText,
    AvatarImage
} from '@/components/ui/avatar'
import React from 'react'
import { Text, View } from 'react-native'
import { Divider } from '../../ui/divider'
import { HStack } from '../../ui/hstack'
import { VStack } from '../../ui/vstack'


interface customClassType{
    customClass?:string,
}

export default function RecentlyCashflow({customClass}:customClassType) {
    const DateNow = new Date().toLocaleDateString('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).replace(/-/g, '/')
    return (
        <View className={`${customClass}`}>
            <HStack className='justify-between mt-[30px] items-center'>
                <Text className='tracking-[-1.1px] text-[24px] ' style={{ fontFamily: "HankenGrotesk_800ExtraBold_Italic" }}>Recently Cashflow </Text>
                <Text className='text-[14px]' style={{ fontFamily: "HankenGrotesk_500Medium_Italic" }}>{DateNow}</Text>
            </HStack>
            <Divider className='h-[2px] rounded-full mt-[14px]' />

            {/* Cashflow */}
            <HStack className='justify-between items-center'>
                <HStack className='gap-4 items-center mt-[14px]'>
                    <Avatar size="lg" className='border-2 border-[#4b4b4b]'>
                        <AvatarFallbackText>Rayhan Alief F</AvatarFallbackText>
                        <AvatarImage
                            source={{
                                uri: 'https://i.pinimg.com/1200x/b1/9b/0b/b19b0b737b291dd10b1593bb906b8ef3.jpg',
                            }}
                        />
                    </Avatar>
                    <VStack>
                        <Text className='text-[18px] tracking-[-1px]' style={{ fontFamily: "HankenGrotesk_700Bold" }} >Makan Minum</Text>
                        <Text className='text-[14px] tracking-[-1px]' style={{ fontFamily: "HankenGrotesk_500Medium_Italic" }}>
                            WIB: 07:30
                        </Text>
                    </VStack>
                </HStack>
                <Text className='text-[18px]' style={{ fontFamily: "HankenGrotesk_900Black_Italic" }}>Rp 13.000</Text>
            </HStack>

            <HStack className='justify-between items-center'>
                <HStack className='gap-4 items-center mt-[14px]'>
                    <Avatar size="lg" className='border-2 border-[#4b4b4b]'>
                        <AvatarFallbackText>Rayhan Alief F</AvatarFallbackText>
                        <AvatarImage
                            source={{
                                uri: 'https://i.pinimg.com/1200x/b1/9b/0b/b19b0b737b291dd10b1593bb906b8ef3.jpg',
                            }}
                        />
                    </Avatar>
                    <VStack>
                        <Text className='text-[18px] tracking-[-1px]' style={{ fontFamily: "HankenGrotesk_700Bold" }} >Makan Minum</Text>
                        <Text className='text-[14px] tracking-[-1px]' style={{ fontFamily: "HankenGrotesk_500Medium_Italic" }}>
                            WIB: 07:30
                        </Text>
                    </VStack>
                </HStack>
                <Text className='text-[18px]' style={{ fontFamily: "HankenGrotesk_900Black_Italic" }}>Rp 13.000</Text>
            </HStack>

            <HStack className='justify-between items-center'>
                <HStack className='gap-4 items-center mt-[14px]'>
                    <Avatar size="lg" className='border-2 border-[#4b4b4b]'>
                        <AvatarFallbackText>Rayhan Alief F</AvatarFallbackText>
                        <AvatarImage
                            source={{
                                uri: 'https://i.pinimg.com/1200x/b1/9b/0b/b19b0b737b291dd10b1593bb906b8ef3.jpg',
                            }}
                        />
                    </Avatar>
                    <VStack>
                        <Text className='text-[18px] tracking-[-1px]' style={{ fontFamily: "HankenGrotesk_700Bold" }} >Makan Minum</Text>
                        <Text className='text-[14px] tracking-[-1px]' style={{ fontFamily: "HankenGrotesk_500Medium_Italic" }}>
                            WIB: 07:30
                        </Text>
                    </VStack>
                </HStack>
                <Text className='text-[18px]' style={{ fontFamily: "HankenGrotesk_900Black_Italic" }}>Rp 13.000</Text>
            </HStack>

            <HStack className='justify-between items-center'>
                <HStack className='gap-4 items-center mt-[14px]'>
                    <Avatar size="lg" className='border-2 border-[#4b4b4b]'>
                        <AvatarFallbackText>Rayhan Alief F</AvatarFallbackText>
                        <AvatarImage
                            source={{
                                uri: 'https://i.pinimg.com/1200x/b1/9b/0b/b19b0b737b291dd10b1593bb906b8ef3.jpg',
                            }}
                        />
                    </Avatar>
                    <VStack>
                        <Text className='text-[18px] tracking-[-1px]' style={{ fontFamily: "HankenGrotesk_700Bold" }} >Makan Minum</Text>
                        <Text className='text-[14px] tracking-[-1px]' style={{ fontFamily: "HankenGrotesk_500Medium_Italic" }}>
                            WIB: 07:30
                        </Text>
                    </VStack>
                </HStack>
                <Text className='text-[18px]' style={{ fontFamily: "HankenGrotesk_900Black_Italic" }}>Rp 13.000</Text>
            </HStack>
        </View>
    )
}
