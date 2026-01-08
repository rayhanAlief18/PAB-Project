import { VStack } from "@/components/ui/vstack";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

interface customClassType {
    customClass?: string
}
type WeatherData = {
    temperature: number;
    humidity: number;
    weatherCode: number;
};

export default function CardMain({ customClass }: customClassType) {
    /**
    * States
    *
    */
    const weatherMap: Record<number, { label: string; icon: string }> = {
        0: { label: "Clear Sky", icon: "☀️" },
        1: { label: "Mostly Clear", icon: "🌤️" },
        2: { label: "Partly Cloudy", icon: "⛅" },
        3: { label: "Cloudy", icon: "☁️" },
        61: { label: "Rain", icon: "🌧️" },
        80: { label: "Rain Shower", icon: "🌦️" },
    };
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [info, setInfoWeather] = useState<{ label: string; icon: string }>();

    /**
     * Methods
     *
     */

    const fetchWeather = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        let isEnabled = false;
        let { latitude, longitude } = { latitude: -6.2, longitude: 106.8 };

        try {
            isEnabled = await Location.hasServicesEnabledAsync();
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });
            if (status === "granted" && isEnabled) {
                latitude = location.coords.latitude;
                longitude = location.coords.longitude;
            }
        } catch (error) {
            isEnabled = false;
        }

        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code`)
            .then((res) => res.json())
            .then((data) => {
                setWeather({
                    temperature: data.current.temperature_2m,
                    humidity: data.current.relative_humidity_2m,
                    weatherCode: data.current.weather_code,
                });
            });
    };

    /**
     * Deps
     *
     */
    useEffect(() => {
        fetchWeather();
    }, []);

    useEffect(() => {
        if (weather?.weatherCode) {
            setInfoWeather(weatherMap[weather.weatherCode]);
        } else {
            setInfoWeather({ label: "Unknown", icon: "❓" });
        }
    }, [weather]);
    return (
        <>
            <View className={`mt-3 ${customClass}`}>
                <View>
                    <VStack className="gap-2 mb-4">
                        <Text className="text-2xl" style={{ fontFamily: "HankenGrotesk_500Medium" }}>
                            Cuaca lokasi Anda:
                        </Text>
                        <Text className="text-md opacity-60" style={{ fontFamily: "HankenGrotesk_400Regular" }}>
                            Weather Sikki version
                        </Text>
                    </VStack>
                    <View className="bg-white border-2 p-5 w-full rounded-[8px] mb-4">
                        <Text className="text-[#4B4B4B] text-lg font-semibold mt-1">
                            {info?.icon} {info?.label}
                        </Text>
                        <Text className="text-[#4B4B4B] text-4xl font-bold mt-3">{weather?.temperature}°C</Text>
                        <Text className="text-[#4B4B4B] text-sm mt-1">Humidity {weather?.humidity}%</Text>
                    </View>
                </View>
            </View>
        </>
    )
}