import { FormInput } from "@/components/custom/Form";
import { Button } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { router, Stack } from "expo-router";
import { LockKeyholeOpen, Mail, User } from "lucide-react-native";
import React, { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

//register
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../config/Firebase/index";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nama, setNama] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleRegister = async () => {
        setError("");

        if (!email || !password || !confirmPassword || !nama) {
            setError("Semua field wajib diisi");
            return;
        }

        if (password.length < 8) {
            setError("Password minimal 8 karakter");
            return;
        }

        if (password !== confirmPassword) {
            setError("Password dan konfirmasi tidak sama");
            return;
        }

        try {
            const payload = {
                email,
                password,
                nama,
            };

            console.log(payload);

            const userCredential = await createUserWithEmailAndPassword(auth, email, password,);
            await updateProfile(userCredential.user, {
                displayName: nama,
            });

            
                Alert.alert(
                    "Registrasi Berhasil",
                    "Akun berhasil dibuat. Silakan login.",
                    [
                        {
                            text: "Login",
                            onPress: () => router.replace("/(auth)/Login"),
                        },
                    ]
                );
        

            router.push('/(auth)/Login');
        }
        catch (error: any) {
            console.log("REGISTER ERROR:", error.code);
            if (error.code === "auth/email-already-in-use") {
                setError("Email sudah terdaftar");
            } else if (error.code === "auth/invalid-email") {
                setError("Format email tidak valid");
            } else if (error.code === "auth/weak-password") {
                setError("Password terlalu lemah");
            } else {
                setError("Register gagal, coba lagi");
            }
        }


        // kirim ke backend
    };

    const clearMessages = () => {
        setError("");
        setSuccess("");
    }

    
    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />

            <SafeAreaView className="flex-1 bg-[#F2F2F4]">
                <View className="px-[50px] mt-20 flex-1">
                    {/* Header */}
                    <VStack className="gap-2 items-center mt-[30px]">
                        <Text
                            className="text-4xl tracking-tighter"
                            style={{ fontFamily: "HankenGrotesk_800ExtraBold" }}
                        >
                            Create Account
                        </Text>

                        <VStack className="items-center mt-[20px]">
                            <Text
                                className="text-[#4b4b4b] text-md"
                                style={{ fontFamily: "HankenGrotesk_400regular" }}
                            >
                                Fill your data below
                            </Text>
                        </VStack>
                    </VStack>

                    {/* Form */}
                    <VStack className="mt-[30px] gap-2">
                        <FormInput
                            icon={User}
                            label="Nama"
                            placeholder="Nama lengkap"
                            value={nama}
                            onChangeText={setNama}
                        />

                        <FormInput
                            icon={Mail}
                            label="Email"
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                        />

                        <FormInput
                            icon={LockKeyholeOpen}
                            label="Password"
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                        <FormInput
                            icon={LockKeyholeOpen}
                            label="Confirm Password"
                            placeholder="Ulangi password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                        />

                        {error ? (
                            <Text
                                className="text-red-500 text-center"
                                style={{ fontFamily: "HankenGrotesk_400regular" }}
                            >
                                {error}
                            </Text>
                        ) : null}

                        <Button
                            className="bg-[#2B8D47] rounded-full mt-8 h-12 mb-12"
                            onPress={handleRegister}
                        >
                            <Text
                                className="text-white text-center text-[16px]"
                                style={{ fontFamily: "HankenGrotesk_500Medium" }}
                            >
                                Register
                            </Text>
                        </Button>

                        <HStack className="justify-center">
                            <Pressable onPress={() => router.push('/(auth)/Login')}>
                                <Text
                                    className="text-center text-[#4b4b4b]"
                                    style={{ fontFamily: "HankenGrotesk_400regular" }}
                                >
                                    Already have an account?{" "}
                                    <Text
                                        className="text-[#2B8D47]"
                                        style={{ fontFamily: "HankenGrotesk_500Medium" }}
                                    >
                                        Login
                                    </Text>
                                </Text>
                            </Pressable>
                        </HStack>
                    </VStack>
                </View>
            </SafeAreaView>
        </>
    );
}
