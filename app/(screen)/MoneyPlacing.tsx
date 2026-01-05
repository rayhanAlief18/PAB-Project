import HeaderPage from '@/components/custom/HeaderPage';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { Text, View, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, TrendingUp, TrendingDown } from 'lucide-react-native';
import { useMoneyPlacing, MoneyPlacement } from '@/contexts/MoneyPlacingContext';
import { useCashflow } from '@/contexts/CashflowContext';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { ActivityIndicator, Box } from '@/components/ui/gluestack-ui-components';

export default function MoneyPlacing() {
    const router = useRouter();
    const { placements, loading, deletePlacement, getPlacements } = useMoneyPlacing();
    const { cashflows } = useCashflow();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    // Fungsi untuk menghitung total perubahan dari cashflow
    const calculateCashflowChanges = (placementId: string) => {
        const relatedCashflows = cashflows.filter(cf => cf.moneyPlacementId === placementId);

        let totalTambah = 0;
        let totalKurang = 0;

        relatedCashflows.forEach(cf => {
            if (cf.condition === 'tambah') {
                totalTambah += cf.nominal;
            } else {
                totalKurang += cf.nominal;
            }
        });

        const totalChange = totalTambah - totalKurang;
        const finalBalance = relatedCashflows.length > 0
            ? placements.find(p => p.id === placementId)?.nominal || 0
            : 0;

        const initialBalance = finalBalance - totalChange;

        return {
            totalTambah,
            totalKurang,
            totalChange,
            initialBalance,
            transactionCount: relatedCashflows.length
        };
    };

    // Fungsi untuk memformat tanggal menjadi format yang lebih singkat
    const formatShortDate = (date: Date) => {
        return format(date, 'dd/MM/yyyy', { locale: id });
    };

    const onRefresh = async () => {
        await getPlacements();
    };

    const renderItem = ({ item }: { item: MoneyPlacement }) => {
        const cashflowData = calculateCashflowChanges(item.id);

        return (
            <Box className="bg-white rounded-xl p-5 mb-4 mx-4 shadow-sm border border-gray-100">
                <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                        {/* Header dengan jenis dan nama */}
                        <View className="flex-row items-center justify-between mb-3">
                            <View className="flex-row items-center space-x-2">
                                <View className={`px-3 py-1.5 rounded-full ${item.type === 'bank' ? 'bg-blue-100' : 'bg-green-100'}`}>
                                    <Text className={`text-sm font-semibold ${item.type === 'bank' ? 'text-blue-800' : 'text-green-800'}`}>
                                        {item.type === 'bank' ? 'Bank' : 'e-Wallet'}
                                    </Text>
                                </View>
                                <View className="bg-gray-100 px-2 py-1 rounded-md">
                                    <Text className="text-xs text-gray-600">
                                        {cashflowData.transactionCount} transaksi
                                    </Text>
                                </View>
                            </View>

                            {/* Button actions */}
                            <View className="flex-row space-x-2">
                                <TouchableOpacity
                                    onPress={() => router.push(`/edit-money-placing/${item.id}`)}
                                    className="bg-blue-500 px-3 py-1.5 rounded-lg active:bg-blue-600"
                                >
                                    <Text className="text-white text-xs font-medium">Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => deletePlacement(item.id)}
                                    className="bg-red-500 px-3 py-1.5 rounded-lg active:bg-red-600"
                                >
                                    <Text className="text-white text-xs font-medium">Hapus</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Nama Money Placement */}
                        <Text className="text-xl font-bold text-gray-900 mb-1">{item.name}</Text>

                        {/* Saldo Saat Ini */}
                        <View className="mb-4">
                            <Text className="text-sm text-gray-600 mb-1">Saldo Saat Ini</Text>
                            <Text className="text-3xl font-bold text-emerald-600">
                                {formatCurrency(item.nominal)}
                            </Text>
                        </View>

                        {/* Info Cashflow */}
                        {cashflowData.transactionCount > 0 && (
                            <View className="bg-gray-50 rounded-lg p-3 mb-4">
                                <Text className="text-sm font-medium text-gray-800 mb-2">Riwayat Perubahan</Text>

                                <View className="flex-row justify-between mb-2">
                                    <View className="flex-row items-center">
                                        <TrendingUp size={14} color="#10B981" />
                                        <Text className="text-xs text-gray-600 ml-1">Pemasukan:</Text>
                                    </View>
                                    <Text className="text-sm font-semibold text-emerald-600">
                                        +{formatCurrency(cashflowData.totalTambah)}
                                    </Text>
                                </View>

                                <View className="flex-row justify-between mb-2">
                                    <View className="flex-row items-center">
                                        <TrendingDown size={14} color="#EF4444" />
                                        <Text className="text-xs text-gray-600 ml-1">Pengeluaran:</Text>
                                    </View>
                                    <Text className="text-sm font-semibold text-red-600">
                                        -{formatCurrency(cashflowData.totalKurang)}
                                    </Text>
                                </View>

                                <View className="flex-row justify-between mb-1">
                                    <Text className="text-xs text-gray-600">Saldo Awal:</Text>
                                    <Text className="text-sm font-semibold text-gray-800">
                                        {formatCurrency(cashflowData.initialBalance)}
                                    </Text>
                                </View>
                            </View>
                        )}

                        {/* Info Tanggal */}
                        <View className="border-t border-gray-200 pt-3">
                            <Text className="text-xs text-gray-500">
                                📅 Dibuat: {formatShortDate(item.createdAt)}
                            </Text>
                            {item.updatedAt && (
                                <Text className="text-xs text-gray-500 mt-1">
                                    🔄 Diperbarui: {formatShortDate(item.updatedAt)}
                                </Text>
                            )}
                        </View>

                        {/* Quick Action Button untuk Cashflow */}
                        <TouchableOpacity
                            onPress={() => router.push('/create-cashflow')}
                            className="mt-4 bg-blue-500 py-2.5 rounded-lg active:bg-blue-600"
                        >
                            <Text className="text-white text-center font-medium">
                                + Tambah Transaksi Cashflow
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Box>
        );
    };

    // Fungsi untuk menghitung total semua Money Placement
    const calculateTotalBalance = () => {
        return placements.reduce((total, placement) => total + placement.nominal, 0);
    };

    // Render header dengan summary
    const renderHeader = () => (
        <View className="px-4 pb-6">
            {/* Summary Card */}
            <View className="bg-gradient-to-br from-green-400 to-emerald-600 rounded-3xl p-6 mb-6 shadow-2xl shadow-green-500/40">
                <View className="flex-row items-center mb-3">
                    <View className="bg-white/20 p-2 rounded-full mr-3">
                    </View>
                    <Text className="text-black/90 text-sm font-medium">Total Saldo Money Placement</Text>
                </View>
                <View className="flex-row items-baseline justify-center mb-2">
                    <Text className="text-4xl font-black text-black text-center">
                        {formatCurrency(calculateTotalBalance())}
                    </Text>
                </View>
                <View className="flex-row justify-between items-center mt-4 pt-4 border-t border-white/20">
                    <View className="flex-row items-center">
                        <View className="bg-white/20 w-2 h-2 rounded-full mr-2"></View>
                        <Text className="text-emerald-100 text-sm font-extrabold">
                            {placements.length} Akun
                        </Text>
                    </View>
                    <View className="flex-row items-center">
                        <View className="bg-white/20 w-2 h-2 rounded-full mr-2"></View>
                        <Text className="text-emerald-100 text-sm font-medium">
                            {cashflows.length} Transaksi
                        </Text>
                    </View>
                </View>
            </View>

            {/* Info Tips Card */}
            <View className="bg-gradient-to-br from-green-400 to-emerald-600 rounded-3xl p-6 mb-6 shadow-2xl border-2 border-emerald-700">
                <View className="flex-row items-start">
                    <View className="bg-cyan-100 p-2 rounded-lg mr-3">
                    </View>
                    <View className="flex-1">
                        <Text className="text-cyan-800 font-bold text-sm mb-1">
                            Tips Manajemen Uang
                        </Text>
                        <Text className="text-gray-700 text-sm leading-5">
                            Tambahkan transaksi Cashflow untuk mengelola pemasukan dan pengeluaran pada Money Placement dengan lebih efektif.
                        </Text>
                    </View>
                </View>
            </View>

            {/* Section Title */}
            <View className="flex-row justify-between items-center mb-4">
                <View>
                    <Text className="text-2xl font-bold text-gray-900">
                        Daftar Money Placement
                    </Text>
                    <Text className="text-gray-500 text-sm mt-1">
                        Kelola semua investasi dan tabungan Anda
                    </Text>
                </View>
                <View className="bg-gray-100 p-2 rounded-full">
                </View>
            </View>
        </View>
    );

    if (loading && placements.length === 0) {
        return (
            <View className="flex-1 bg-[#F2F2F4] justify-center items-center">
                <ActivityIndicator size="large" />
                <Text className="text-gray-500 mt-4">Memuat data...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-[#F2F2F4]">
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView className="flex-1">
                <HeaderPage title="Money Placing" />

                {placements.length === 0 ? (
                    <View className="flex-1 justify-center items-center px-8">
                        <View className="bg-white p-8 rounded-2xl shadow-sm items-center">
                            <View className="w-24 h-24 bg-emerald-100 rounded-full justify-center items-center mb-6">
                            </View>
                            <Text className="text-gray-800 text-xl font-bold text-center mb-3">
                                Belum Ada Money Placement
                            </Text>
                            <Text className="text-gray-500 text-center mb-2">
                                Mulai dengan membuat akun bank atau e-wallet
                            </Text>
                            <Text className="text-gray-500 text-center mb-6">
                                untuk mencatat dan mengelola keuangan Anda
                            </Text>
                            <TouchableOpacity
                                onPress={() => router.push('/create-money-placing')}
                                className="bg-emerald-500 w-full py-3.5 rounded-lg active:bg-emerald-600"
                            >
                                <Text className="text-white text-center font-semibold text-lg">
                                    + Buat Money Placement
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => router.push('/Cashflow')}
                                className="mt-4"
                            >
                                <Text className="text-blue-500 text-sm font-medium">
                                    Lihat Transaksi Cashflow →
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <FlatList
                        data={placements}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={{ paddingTop: 16, paddingBottom: 80 }}
                        ListHeaderComponent={renderHeader}
                        refreshControl={
                            <RefreshControl
                                refreshing={loading}
                                onRefresh={onRefresh}
                                colors={['#10B981']}
                            />
                        }
                        showsVerticalScrollIndicator={false}
                    />
                )}

                {placements.length > 0 && (
                    <TouchableOpacity
                        onPress={() => router.push('/create-money-placing')}
                        className="absolute bottom-6 right-6 bg-emerald-500 w-16 h-16 rounded-full justify-center items-center shadow-xl active:opacity-80"
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.15,
                            shadowRadius: 8,
                            elevation: 8,
                        }}
                    >
                        <Plus size={28} color="white" />
                    </TouchableOpacity>
                )}

                {/* Quick Navigation to Cashflow */}
                {placements.length > 0 && (
                    <TouchableOpacity
                        onPress={() => router.push('/Cashflow')}
                        className="absolute bottom-6 left-6 bg-blue-500 px-4 py-3 rounded-full flex-row items-center shadow-xl active:opacity-80"
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.15,
                            shadowRadius: 8,
                            elevation: 8,
                        }}
                    >
                        <Text className="text-white font-medium mr-2">Cashflow</Text>
                    </TouchableOpacity>
                )}
            </SafeAreaView>
        </View>
    );
}