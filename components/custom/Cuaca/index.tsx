import { Box } from '@/components/ui/box'
import { HStack } from '@/components/ui/hstack'
import { VStack } from '@/components/ui/vstack'
import { CloudCheckIcon, CloudIcon, CloudRain, CloudSnowIcon, MoonStar, SunIcon, Sunrise, Sunset, WindIcon } from 'lucide-react-native'
import React, { useState } from 'react'
import { Text, View } from 'react-native'

interface weatherProps {
    wind: number,
    cloud: number,
    temperature: number,
    temperature_min: number,
    temperature_max: number,
    sunrise: number,
    sunset: number,
}

interface weather {
    weather: weatherProps
}
export default function index({ weather }: weather) {
    const { wind, cloud, temperature, temperature_min, temperature_max, sunrise, sunset } = weather;

    const [time, setTime] = useState(new Date());
    const currentHour = time.getHours();
    const timer = setInterval(() => {
        setTime(new Date());
    }, 1000);
    const formatTime = (date: any) => {
        return date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        });
    };

    const toWIBTime = (unixTimestamp: number) => {
        const dateUTC = new Date(unixTimestamp * 1000)

        return dateUTC.toLocaleTimeString('id-ID', {
            timeZone: 'Asia/Jakarta', // Memastikan output SELALU WIB
            hour: '2-digit',
            minute: '2-digit',
            hour12: false, // Format 24 jam
        });
    }

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    let statusAwan = "";
    let iconCuaca = <CloudIcon color='white' size={20} />;
    if (cloud === 0) {
        iconCuaca = <CloudCheckIcon color='white' size={20} />;
        statusAwan = "Langit Cerah";
    } else if (cloud < 30) {
        iconCuaca = <CloudIcon color='white' size={20} />;
        statusAwan = "Sedikit Berawan";
    } else if (cloud < 70) {
        iconCuaca = <CloudSnowIcon color='white' size={20} />;
        statusAwan = "Berawan";
    } else {
        iconCuaca = <CloudRain color='white' size={20} />;
        statusAwan = "Mendung";
    }

    const day = () => {
        if (currentHour >= 18 || currentHour < 5) {
            return (
                <>
                    <MoonStar color='white' size={24} />
                    <Text className='text-white text-base font-medium'>Night </Text>
                </>
            );
        } else {
            // WAJIB pakai return agar komponen Text keluar ke layar
            return (
                <>
                    <SunIcon color='white' size={24} />
                    <Text className='text-white text-base font-medium'>Sunny Go</Text>
                </>
            );
        }
    };
    return (
        <View className='px-[30px] py-4 mt-2'>
            <Box className='border bg-gray-800 rounded-xl p-6 shadow-lg'>
                {/* Header Section */}
                <HStack className='justify-between items-start mb-6'>
                    <VStack className='gap-8'>
                        <HStack className='items-center gap-2'>
                            {day()}
                        </HStack>
                        <View>
                            <Text className='text-white text-5xl font-light'>{`${temperature}°` || '--:--'}</Text>
                            <Text className='text-gray-400 text-lg mt-2'>{`${temperature_min}° / ${temperature_max}°` || '--:--'}</Text>
                        </View>
                    </VStack>

                    <VStack className='items-end gap-1'>
                        <Text className='text-white text-xl font-light' style={{ fontFamily: "HankenGrotesk_500Medium" }}>{`${formatTime(time)} WIB`}</Text>
                        <Text className='text-gray-400 text-sm'>{`${formatDate(time)}`}</Text>
                    </VStack>
                </HStack>

                {/* Weekly Forecast */}
                <HStack className='justify-between items-center pt-4 border-t border-gray-700'>
                    <VStack className='items-center gap-1'>
                        <WindIcon color='white' size={20} />
                        <Text className='text-gray-400 text-sm'>Wind</Text>
                        <Text className='text-gray-400 text-sm'>{`${wind}°` || '--:--'}</Text>
                    </VStack>

                    <VStack className='items-center gap-1'>
                        <CloudIcon color='white' size={20} />
                        <Text className='text-gray-400 text-sm text-center'>Cuaca</Text>
                        <Text className='text-gray-400 text-sm text-center'>
                            {statusAwan}
                        </Text>
                    </VStack>

                    <VStack className='items-center gap-1'>
                        <Sunrise color='white' size={20} />
                        <Text className='text-gray-400 text-sm'>Sunrise</Text>
                        <Text className='text-gray-400 text-sm'>{`${toWIBTime(Number(sunrise))}` || '--:--'}</Text>
                    </VStack>

                    <VStack className='items-center gap-1'>
                        <Sunset color='white' size={20} />
                        <Text className='text-gray-400 text-sm'>Sunset</Text>
                        <Text className='text-gray-400 text-sm'>{`${toWIBTime(Number(sunset))}` || '--:--'}</Text>
                    </VStack>
                </HStack>
            </Box>
        </View>
    )
}