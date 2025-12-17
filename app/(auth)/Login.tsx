import { FormInput } from "@/components/custom/Form";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { VStack } from "@/components/ui/vstack";
import { router, Stack } from "expo-router";
import { LockKeyholeOpen, Mail } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


// Image
export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const handleLogin = () => {
        setError("");

        if (!username || !password) {
            setError("Semua field wajib diisi");
            return;
        }

        if (password.length < 8) {
            setError("Password minimal 8 karakter");
            return;
        }



        const login = {
            username,
            password,
        };

        router.push('/(tabs)/Dashboard');
        console.log(login);
        // kirim ke backend
    };

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView className="flex-1 bg-[#F2F2F4] flex-1 ">
                <View className={'px-[30px] mt-20 px-[50px] flex-1'}>
                    <VStack className="gap-2 items-center mt-[30px]">
                        <Text className="text-4xl tracking-tighter" style={{ fontFamily: "HankenGrotesk_800ExtraBold" }}>We Say Hello !</Text>
                        <VStack className="items-center mt-[20px]">
                            <Text className="text-[#4b4b4b] text-md" style={{ fontFamily: "HankenGrotesk_400regular" }}>Welcome back, Use your email</Text>
                            <Text className="text-[#4b4b4b] text-md" style={{ fontFamily: "HankenGrotesk_400regular" }}>and password to log in.</Text>
                        </VStack>
                    </VStack>

                    {/* form */}
                    <VStack className="mt-[30px] gap-8 justify-between">
                        <FormInput
                            icon={Mail}
                            label="Email"
                            placeholder="Email"
                            value={username}
                            onChangeText={setUsername}
                        />

                        <FormInput
                            icon={LockKeyholeOpen}
                            label="Password"
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                        />
                        {error ? (
                            <Text
                                className="text-red-500 text-center"
                                style={{ fontFamily: "HankenGrotesk_400regular" }}
                            >
                                {error}
                            </Text>
                        ) : null}

                        <Button className="bg-[#2B8D47] rounded-full mt-5 h-12 justify-center items-center" onPress={handleLogin}>
                            <Text className="text-white text-center text-[16px]" style={{ fontFamily: "HankenGrotesk_500Medium" }}>Login</Text>
                        </Button>


                        <HStack className="justify-center mt-2">
                            <Pressable onPress={() => router.push('/(auth)/Register')}>
                                <Text className="text-center text-[#4b4b4b]" style={{ fontFamily: "HankenGrotesk_400regular" }}>
                                    Don't have an account? <Text className="text-[#2B8D47]" style={{ fontFamily: "HankenGrotesk_500Medium" }}>Register</Text>
                                </Text>
                            </Pressable>
                        </HStack>

                        <Text className="text-center text-[#4b4b4b] mt-4" style={{ fontFamily: "HankenGrotesk_400regular" }}>
                            Or Login With
                        </Text>

                        <HStack className="justify-center">
                            <Box className="bg-white rounded-md p-3 mx-2 shadow-xs">
                                <Image
                                    size="xs"
                                    source={
                                        require('../../src/assets/image/google.png')
                                    }
                                    alt="image"
                                />
                            </Box>
                        </HStack>
                    </VStack>
                </View>
            </SafeAreaView>
        </>
    );
}
