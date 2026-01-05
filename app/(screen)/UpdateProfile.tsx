import { FormInput } from "@/components/custom/Form";
import HeaderPage from "@/components/custom/HeaderPage";

import {
    Avatar,
    AvatarBadge,
    AvatarFallbackText,
    AvatarImage,
} from '@/components/ui/avatar';
import { Button } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { router, Stack } from "expo-router";
import { onAuthStateChanged, signOut, updatePassword, updateProfile } from "firebase/auth";
import { LockKeyholeOpen, Mail, UserCircle } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../../config/Firebase";

export default function EditProfileScreen() {
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>("");
    const [name, setName] = useState("");
    const [userLogins, setUserLogins] = useState<any>(null);

    useEffect(() => {
        const userLogin = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserLogins(user);
                setEmail(user.email || "");
                setName(user.displayName || "");
                setPassword("********");
                console.log("adakah ? ", user.email, user.displayName);
            }
        });

        return userLogin;
    }, []);
    const handleLogout = async () => {
        

        try {
            await signOut(auth);
            Alert.alert(
                "Logout Berhasil",
                "Anda telah keluar dari akun.",
                [
                    {
                        text: "OK",
                        onPress: () => {
                            router.replace("/(auth)/Login");
                        },
                    },
                ]
            );
            router.replace('/(auth)/Login');
        } catch (error: any) {
            console.log("LOGOUT ERROR:", error);
            Alert.alert("Error", "Gagal logout, coba lagi", error);
        }
    }

    const updateProfileUser = async () => {
        const user = auth.currentUser;

        if (!user) {
            Alert.alert("Error", "User tidak terautentikasi");
            return;
        }
        try {
            await updateProfile(user, {
                displayName: name,
            });

            // harus ada verifikasi kalo ganti email
            // if (email && email !== user.email) {
            //     await updateEmail(user, email);
            // }

            if (password.length >= 8) {
                await updatePassword(user,password);
            }

            Alert.alert("Berhasil", "Profile berhasil diperbarui");

        } catch (error: any) {
            console.log("UPDATE PROFILE ERROR:", error);
            Alert.alert("Error", "Gagal update profile");
        }
    }


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
                    <VStack className="px-4 space-y-4 gap-3">
                        <FormInput
                            icon={Mail}
                            label="Email"
                            placeholder="Your Email"
                            value={email}
                            onChangeText={setEmail}
                        />

                        <FormInput
                            icon={LockKeyholeOpen}
                            label="Password"
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={true}
                        />

                        <FormInput
                            icon={UserCircle}
                            label="Name"
                            placeholder="Your Name"
                            value={name}
                            onChangeText={setName}
                        />

                    </VStack>
                    <VStack className="px-4">
                        <Button
                            className="bg-[#2B8D47] rounded-full px-8 py-4 h-14 mt-12"
                            isHovered={false}
                            onPress={updateProfileUser}
                        >
                            <Text
                                className="text-white text-md tracking-[1px]"
                                style={{ fontFamily: "HankenGrotesk_400Regular" }}>Save</Text>
                        </Button>

                        <Button
                            className="bg-[#ba2e2e] rounded-full px-8 py-4 h-14 mt-[80px]"
                            isHovered={false}
                            onPress={handleLogout}
                        >
                            <Text
                                className="text-white text-md tracking-[1px]"
                                style={{ fontFamily: "HankenGrotesk_400Regular" }}>Logout</Text>
                        </Button>
                    </VStack>
                </View>
            </SafeAreaView>
        </>
    );
}
