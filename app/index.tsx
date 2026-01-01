import { router, Stack } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function index() {
    useEffect(() => {
        const timer = setTimeout(() => {
            // pindah ke halaman utama
            router.replace('/(auth)/Login');
        },3000);

        return () => clearTimeout(timer);
    }, []);


    // Splash Screen Broo
    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />

            <SafeAreaView className="flex-1 bg-white justify-center items-center">
                {/* Keyword bubbles */}
                <View className="absolute top-48 flex-row gap-3">
                    {["income", "balance", "expenses"].map((item) => (
                        <View
                            key={item}
                            className="border border-gray-300 px-3 py-1 rounded-full"
                        >
                            <Text className="text-xs text-gray-500">{item}</Text>
                        </View>
                    ))}
                </View>

                <View className="absolute top-40 flex-row gap-3">
                    {["Act", "To-do", "Plan"].map((item) => (
                        <View
                            key={item}
                            className="border border-gray-300 px-3 py-1 rounded-full"
                        >
                            <Text className="text-xs text-gray-500">{item}</Text>
                        </View>
                    ))}
                </View>

                {/* Lottie animation */}
                <LottieView
                    source={require("../assets/Lottie/Loader cat.json")}
                    autoPlay
                    loop
                    style={{ width: 220, height: 220 }}
                />

                {/* Branding */}
                <View className="items-center mt-8">
                    <Text
                        className="text-2xl font-extrabold tracking-tight"
                        style={{ fontFamily: "HankenGrotesk_800ExtraBold" }}
                    >
                        pemi
                    </Text>

                    <Text
                        className="text-gray-500 mt-4"
                        style={{ fontFamily: "HankenGrotesk_400regular" }}
                    >
                        your personal optimization
                    </Text>
                </View>
            </SafeAreaView>
        </>
    );
}
