// ui import
import { Box } from '@/components/ui/box';
import { Divider } from '@/components/ui/divider';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';

//icon import
import { Wallet } from 'lucide-react-native';

import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

interface customClassType{
    customClass?:string
}
type WeatherData = {
    temperature: number;
    humidity: number;
    weatherCode: number;
};

export default function CardMain({customClass}:customClassType) {
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
                    <View className="bg-white border-2 p-5 w-full rounded-[8px] mb-4">
                        
                        <Text className="text-[#4B4B4B] text-lg font-semibold mt-1">
                            {info?.icon} {info?.label}
                        </Text>

                        <Text className="text-[#4B4B4B] text-4xl font-bold mt-3">{weather?.temperature}°C</Text>

                        <Text className="text-[#4B4B4B] text-sm mt-1">Humidity {weather?.humidity}%</Text>
                    </View>
                </View>
                <Box className="bg-white p-5 border-2 rounded-[8px] py-[18px] px-[24px]">
                    <VStack>
                        <HStack className='items-center gap-2 '>
                            <Wallet color={'#4b4b4b'} />
                            <Text style={{fontFamily:"HankenGrotesk_500Medium"}} className='text-[15px]'>Your All Money</Text>
                        </HStack>
                        <Text style={{fontFamily:"HankenGrotesk_800ExtraBold_Italic"}} className='text-[36px] mt-3'>Rp 8.000.000</Text>
                    </VStack>
                    <Divider className='my-[8px] rounded-full bg-[#4B4B4B] h-[2px]'/>
                    <HStack className='justify-between px-4'>
                        <VStack className='items-center'>
                            <Text style={{fontFamily:"HankenGrotesk_500Medium"}} className='text-[15px] text-[#4B4B4B]'>Today Spend</Text>
                            <Text style={{fontFamily:"HankenGrotesk_700Bold_Italic"}} className='text-[24px] mt-1 text-black'>Rp 25.000</Text>
                        </VStack>
                        <VStack className='items-center'>
                            <Text style={{fontFamily:"HankenGrotesk_500Medium"}} className='text-[15px] text-[#4B4B4B]'>Monthly Spend</Text>
                            <Text style={{fontFamily:"HankenGrotesk_700Bold_Italic"}} className='text-[24px] mt-1 text-black'>Rp 380.000</Text>
                        </VStack>
                    </HStack>
                </Box>
            </View>
        </>
    )
}
