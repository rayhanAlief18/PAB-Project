import HeaderPage from '@/components/custom/HeaderPage';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, TrendingUp, TrendingDown } from 'lucide-react-native';
import { useCashflow, Cashflow } from '@/contexts/CashflowContext';
import { useMoneyPlacing } from '@/contexts/MoneyPlacingContext';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Box, Button, ButtonText, ActivityIndicator } from '@/components/ui/gluestack-ui-components';

export default function CashflowScreen() {
  const router = useRouter();
  const { cashflows, loading, deleteCashflow, getCashflows } = useCashflow();
  const { placements } = useMoneyPlacing();
  const [filter, setFilter] = useState<'all' | 'tambah' | 'kurang'>('all');
  const [refreshing, setRefreshing] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return format(date, 'dd MMM yyyy HH:mm', { locale: id });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Pendapatan': 'bg-green-100 text-green-800',
      'Gaji': 'bg-emerald-100 text-emerald-800',
      'Investasi': 'bg-teal-100 text-teal-800',
      'Makan/Minum': 'bg-amber-100 text-amber-800',
      'Bensin': 'bg-orange-100 text-orange-800',
      'Jajan': 'bg-yellow-100 text-yellow-800',
      'Online Shop': 'bg-pink-100 text-pink-800',
      'Transportasi': 'bg-blue-100 text-blue-800',
      'Hiburan': 'bg-purple-100 text-purple-800',
      'Kesehatan': 'bg-red-100 text-red-800',
      'Pendidikan': 'bg-indigo-100 text-indigo-800',
      'Tagihan': 'bg-gray-100 text-gray-800',
      'Lain-lain': 'bg-gray-100 text-gray-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getMoneyPlacementName = (id: string) => {
    const placement = placements.find(p => p.id === id);
    return placement ? placement.name : 'Unknown';
  };

  const filteredCashflows = cashflows.filter(cashflow => {
    if (filter === 'all') return true;
    return cashflow.condition === filter;
  });

  const totalTambah = cashflows
    .filter(c => c.condition === 'tambah')
    .reduce((sum, c) => sum + c.nominal, 0);

  const totalKurang = cashflows
    .filter(c => c.condition === 'kurang')
    .reduce((sum, c) => sum + c.nominal, 0);

  const totalBalance = totalTambah - totalKurang;

  const onRefresh = async () => {
    setRefreshing(true);
    await getCashflows();
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: Cashflow }) => (
    <Box className="bg-white rounded-lg p-4 mb-3 mx-4 shadow-sm">
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center space-x-2">
              {item.condition === 'tambah' ? (
                <TrendingUp size={16} color="#10B981" />
              ) : (
                <TrendingDown size={16} color="#EF4444" />
              )}
              <View className={`px-2 py-1 rounded-full ${getCategoryColor(item.category)}`}>
                <Text className="text-xs font-semibold">{item.category}</Text>
              </View>
            </View>
            <Text className={`text-lg font-bold ${item.condition === 'tambah' ? 'text-emerald-600' : 'text-red-600'}`}>
              {item.condition === 'tambah' ? '+' : '-'}{formatCurrency(item.nominal)}
            </Text>
          </View>
          
          <Text className="text-sm text-gray-900 font-medium mb-1">
            {getMoneyPlacementName(item.moneyPlacementId)}
          </Text>
          
          {item.note && (
            <Text className="text-sm text-gray-600 mb-2 italic">{item.note}</Text>
          )}
          
          <Text className="text-xs text-gray-500">
            {formatDate(item.createdAt)}
          </Text>
        </View>
        
        <View className="flex-row space-x-2 ml-2">
          <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/edit-cashflow/[id]',
                  params: { id: item.id },
                })
              }
              className="bg-blue-500 px-3 py-1 rounded"
            >
              <Text className="text-white text-xs">Edit</Text>
            </TouchableOpacity>
          <TouchableOpacity
            onPress={() => deleteCashflow(item.id)}
            className="bg-red-500 px-3 py-1 rounded-md"
          >
            <Text className="text-white text-xs">Hapus</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Box>
  );

  const renderHeader = () => (
    <View className="px-4 pb-4">
      {/* Summary Cards */}
      <View className="flex-row justify-between mb-4">
        <View className="bg-white rounded-xl p-4 flex-1 mr-2 shadow-sm">
          <Text className="text-sm text-gray-500 mb-1">Total Pendapatan</Text>
          <Text className="text-2xl font-bold text-emerald-600">
            {formatCurrency(totalTambah)}
          </Text>
        </View>
        <View className="bg-white rounded-xl p-4 flex-1 ml-2 shadow-sm">
          <Text className="text-sm text-gray-500 mb-1">Total Pengeluaran</Text>
          <Text className="text-2xl font-bold text-red-600">
            {formatCurrency(totalKurang)}
          </Text>
        </View>
      </View>
      
      {/* Balance Card */}
      <View className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-5 mb-4 shadow-sm">
        <Text className="text-black text-sm mb-1">Saldo Bersih</Text>
        <Text className="text-3xl font-bold text-black">
          {formatCurrency(totalBalance)}
        </Text>
      </View>
      
      {/* Filter Buttons */}
      <View className="flex-row space-x-2 mb-4">
        <TouchableOpacity
          onPress={() => setFilter('all')}
          className={`px-4 py-2 rounded-full ${filter === 'all' ? 'bg-blue-500' : 'bg-gray-200'}`}
        >
          <Text className={`font-medium ${filter === 'all' ? 'text-white' : 'text-gray-700'}`}>
            Semua
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilter('tambah')}
          className={`px-4 py-2 rounded-full ${filter === 'tambah' ? 'bg-emerald-500' : 'bg-gray-200'}`}
        >
          <View className="flex-row items-center">
            <TrendingUp size={14} color={filter === 'tambah' ? 'white' : '#374151'} />
            <Text className={`font-medium ml-1 ${filter === 'tambah' ? 'text-white' : 'text-gray-700'}`}>
              Masuk
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilter('kurang')}
          className={`px-4 py-2 rounded-full ${filter === 'kurang' ? 'bg-red-500' : 'bg-gray-200'}`}
        >
          <View className="flex-row items-center">
            <TrendingDown size={14} color={filter === 'kurang' ? 'white' : '#374151'} />
            <Text className={`font-medium ml-1 ${filter === 'kurang' ? 'text-white' : 'text-gray-700'}`}>
              Keluar
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      
      {/* Title */}
      <Text className="text-lg font-bold text-gray-900 mb-2">
        Riwayat Transaksi
      </Text>
    </View>
  );

  if (loading && cashflows.length === 0) {
    return (
      <View className="flex-1 bg-[#F2F2F4] justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F2F2F4]">
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1">
        <HeaderPage title="Cashflow" />
        
        {cashflows.length === 0 ? (
          <View className="flex-1 justify-center items-center px-8">
            <View className="bg-white p-8 rounded-2xl shadow-sm items-center">
              <View className="w-20 h-20 bg-blue-100 rounded-full justify-center items-center mb-4">
                <TrendingUp size={32} color="#3B82F6" />
              </View>
              <Text className="text-gray-700 text-lg text-center mb-2">
                Belum ada transaksi cashflow
              </Text>
              <Text className="text-gray-500 text-center mb-6">
                Mulai catat pemasukan dan pengeluaran Anda
              </Text>
              <Button 
                onPress={() => router.push('/create-cashflow')}
                className="bg-blue-500"
              >
                <ButtonText>Tambah Transaksi</ButtonText>
              </Button>
            </View>
          </View>
        ) : (
          <FlatList
            data={filteredCashflows}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingTop: 16, paddingBottom: 80 }}
            ListHeaderComponent={renderHeader}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}

        {cashflows.length > 0 && (
          <TouchableOpacity
            onPress={() => router.push('/create-cashflow')}
            className="absolute bottom-6 right-6 bg-blue-500 w-14 h-14 rounded-full justify-center items-center shadow-lg"
          >
            <Plus size={24} color="white" />
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </View>
  );
}