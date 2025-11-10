import { Divider } from '@/components/ui/divider';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { CirclePlus } from "lucide-react-native";
import React from 'react';
import { Text, View } from 'react-native';
import { PieChart } from "react-native-gifted-charts";


interface customClassType {
    customClass?: string
}

export default function PieChartDashboard({ customClass }: customClassType) {
    const chartData = [
        {
            value: 250000,
            text: 'Kategori 1',
            color: '#000000', // Hitam Penuh (Sesuai dengan slice terbesar di gambar)
            textColor: '#FFFFFF'
        },
        {
            value: 150000,
            text: 'Kategori 2',
            color: '#363636', // Abu-abu Gelap
            textColor: '#FFFFFF'
        },
        {
            value: 100000,
            text: 'Kategori 3',
            color: '#707070', // Abu-abu Sedang
            textColor: '#FFFFFF'
        },
        {
            value: 80000,
            text: 'Kategori 4',
            color: '#A9A9A9', // Abu-abu Terang
            textColor: '#000000'
        },
        {
            value: 50000,
            text: 'Kategori 5',
            color: '#D3D3D3', // Hampir Putih
            textColor: '#000000'
        },
    ];
    const totalSpend = chartData.reduce((sum, item) => sum + item.value, 0);



    return (
        <View className={`${customClass}`}>
            <VStack>
                <Text className='text-[18px] text-[#4B4B4B]' style={{ fontFamily: "HankenGrotesk_800ExtraBold_Italic" }}>TOTAL SPEND (This Month)</Text>
                <HStack className='mt-[12px] justify-between items-center'>
                    <View className='w-[50%] p-[10px]'>
                        <PieChart
                            data={chartData}
                            donut
                            radius={80}
                            innerCircleColor="#F5F5F5"
                            showText={false}
                            textSize={8}
                            strokeWidth={2}
                            strokeColor="#F5F5F5"
                        />

                        {/* Konten Tengah (Seperti Solusi Masalah Sebelumnya) */}

                    </View>
                    <VStack className='w-[50%] pl-2'>
                        <View className=''>
                            <HStack className='justify-between items-center'>
                                <VStack className=''>
                                    <Text className='text-[#4B4B4B] text-[12px]' style={{ fontFamily: "HankenGrotesk_500Medium", }}>Makan Minum</Text>
                                    <Text className='text-[14px]' style={{ fontFamily: "HankenGrotesk_700Bold_Italic" }}>Rp 125.000</Text>
                                </VStack>
                                <CirclePlus size={24} />
                            </HStack>
                            <Divider className='mt-[4px] h-[2px] rounded-full bg-black pr-8' />
                        </View>
                        <View className='mt-[14px]'>
                            <HStack className='justify-between items-center'>
                                <VStack className=''>
                                    <Text className='text-[#4B4B4B] text-[12px]' style={{ fontFamily: "HankenGrotesk_500Medium" }}>Makan Minum</Text>
                                    <Text className='text-[14px]' style={{ fontFamily: "HankenGrotesk_700Bold_Italic" }}>Rp 125.000</Text>
                                </VStack>
                                <CirclePlus size={24} />
                            </HStack>
                            <Divider className='mt-[4px] h-[2px] rounded-full bg-black pr-8' />
                        </View>
                        <View className='mt-[14px]'>
                            <HStack className='justify-between items-center'>
                                <VStack className=''>
                                    <Text className='text-[#4B4B4B] text-[12px]' style={{ fontFamily: "HankenGrotesk_500Medium" }}>Makan Minum</Text>
                                    <Text className='text-[14px]' style={{ fontFamily: "HankenGrotesk_700Bold_Italic" }}>Rp 125.000</Text>
                                </VStack>
                                <CirclePlus size={24} />
                            </HStack>
                            <Divider className='mt-[4px] h-[2px] rounded-full bg-black pr-8' />
                        </View>
                    </VStack>
                </HStack>
            </VStack>
            <Divider className='h-[2px] bg-[#4B4B4B] rounded-full px-[30px] mt-[30px]' />
        </View>
    )
}
