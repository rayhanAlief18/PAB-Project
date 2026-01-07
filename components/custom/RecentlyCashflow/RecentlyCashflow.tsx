import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Avatar, AvatarFallbackText } from '@/components/ui/avatar';
import { Divider } from '../../ui/divider';
import { HStack } from '../../ui/hstack';
import { VStack } from '../../ui/vstack';
import { useCashflow } from '@/contexts/CashflowContext';
import { useMoneyPlacing } from '@/contexts/MoneyPlacingContext';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useRouter } from 'expo-router';

interface CustomClassType {
    customClass?: string;
}

export default function RecentlyCashflow({ customClass }: CustomClassType) {
    const { cashflows } = useCashflow();
    const { placements } = useMoneyPlacing();
    const router = useRouter();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatTime = (date: Date | string) => {
        return format(new Date(date), 'HH:mm', { locale: id });
    };

    const getMoneyPlacementName = (id: string) => {
        const placement = placements.find(p => p.id === id);
        return placement ? placement.name : 'Unknown';
    };

    // Sort cashflows terbaru
    const sortedCashflows = [...cashflows].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return (
        <View className={customClass}>
            {/* Header */}
            <HStack className="justify-between mt-[30px] items-center">
                <Text
                    className="tracking-[-1.1px] text-[22px]"
                    style={{ fontFamily: 'HankenGrotesk_800ExtraBold_Italic' }}
                >
                    RECENTLY CASHFLOW
                </Text>
                <Text
                    className="text-[16px]"
                    style={{ fontFamily: 'HankenGrotesk_500Medium_Italic' }}
                >
                    {new Date().toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                    })}
                </Text>
            </HStack>

            <Divider className="h-[2px] rounded-full mt-[14px]" />

            {/* Cashflow List */}
            <ScrollView className="mt-[14px]">
                {sortedCashflows.map(item => (
                    <HStack key={item.id} className="justify-between items-center mb-4">
                        <HStack className="gap-4 items-center flex-1">
                            <Avatar size="lg" className="border-2 border-[#4b4b4b]">
                                <AvatarFallbackText>CF</AvatarFallbackText>
                            </Avatar>

                            <VStack>
                                <Text
                                    className="text-[18px] tracking-[-1px]"
                                    style={{ fontFamily: 'HankenGrotesk_700Bold' }}
                                >
                                    {getMoneyPlacementName(item.moneyPlacementId)}
                                </Text>
                                <Text
                                    className="text-[14px] tracking-[-1px]"
                                    style={{ fontFamily: 'HankenGrotesk_500Medium_Italic' }}
                                >
                                    {formatTime(item.createdAt)} WIB
                                </Text>
                            </VStack>
                        </HStack>

                        {/* NOMINAL — FIXED */}
                        <View className="min-w-[120px] items-end mt-5">
                            <Text
                                numberOfLines={1}
                                adjustsFontSizeToFit
                                className="text-[18px]"
                                style={{
                                    fontFamily: 'HankenGrotesk_900Black_Italic',
                                    color: item.condition === 'tambah' ? '#10B981' : '#EF4444',
                                    textAlign: 'right',
                                }}
                            >
                                {item.condition === 'tambah' ? '+' : '-'}
                                {formatCurrency(item.nominal)}
                            </Text>
                        </View>
                    </HStack>

                ))}

                {/* Jika kosong */}
                {sortedCashflows.length === 0 && (
                    <View className="items-center py-8">
                        <Text className="text-gray-500">Belum ada transaksi</Text>
                        <TouchableOpacity
                            onPress={() => router.push('/create-cashflow')}
                            className="bg-blue-500 px-4 py-2.5 rounded-lg mt-4"
                        >
                            <Text className="text-white font-medium">
                                + Tambah Transaksi
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
