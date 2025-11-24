import HeaderPage from "@/components/custom/HeaderPage";
import FormInput from "@/components/custom/Input/FormInput";
import {
    Avatar,
    AvatarBadge,
    AvatarFallbackText,
    AvatarImage,
} from '@/components/ui/avatar';
import { Button } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { Stack } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function EditProfileScreen() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [age, setAge] = useState("");

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView className="flex-1 bg-[#F2F2F4]">
                <HeaderPage title="Account Setting" />
                <View className=" px-[35px]">
                    {/* HEADER */}
                    {/* PROFILE PICTURE */}
                    <VStack className="mt-6 mb-4 items-center">
                        <Avatar size="xl" className='border-4 border-[#4b4b4b]'>
                            <AvatarFallbackText>Rayhan Alief F</AvatarFallbackText>
                            <AvatarImage
                                source={{
                                    uri: 'https://i.pinimg.com/736x/91/0a/b5/910ab59abc5aed1805485ddc299a6a11.jpg',
                                }}
                            />
                            <AvatarBadge />
                        </Avatar>
                        <TouchableOpacity>
                            <Text className="text-sm text-[#4B4B4B] mt-2" style={{ fontFamily: "HankenGrotesk_400Regular" }}>
                                Change Profile Picture
                            </Text>
                        </TouchableOpacity>
                    </VStack>

                    {/* FORM */}
                    <VStack className="px-4 space-y-4 gap-3 pb-10">
                        <FormInput
                            typeInput="default"
                            title="Username"
                            isPassword={false}
                            value={username}
                            placeHolder="Username..."
                            setOnchange={setUsername} />

                        <FormInput
                            typeInput="default"
                            isPassword={true}
                            title="Password"
                            value={password}
                            placeHolder="Password..."
                            setOnchange={setPassword} />

                        <FormInput
                            typeInput="default"
                            title="Nama Lengkap"
                            isPassword={false}
                            value={fullName}
                            placeHolder="Nama Lengkap..."
                            setOnchange={setFullName} />

                        <FormInput
                            typeInput="numeric"
                            title="Umur"
                            isPassword={false}
                            value={age}
                            placeHolder="Umur anda..."
                            setOnchange={setAge} />

                    </VStack>
                    <View className="px-4">
                        <Button
                            className="bg-[#2B8D47] rounded-2xl px-8 py-4"
                            isHovered={false}
                        >
                            <Text
                                className="text-white text-md tracking-[1px]"
                                style={{ fontFamily: "HankenGrotesk_400Regular" }}>Save Change</Text>
                        </Button>
                    </View>
                </View>
            </SafeAreaView>
        </>
    );
}
