import { Header } from '@/components/custom';
import { Box } from '@/components/ui/box';
import { Divider } from '@/components/ui/divider';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Debt, useDebts } from '@/contexts/DebtContext';
import { router } from 'expo-router';
import { ArrowLeft, Check, Edit, MoreVertical, Plus, Trash2, Wallet } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DebtsScreen() {
  const { debts, deleteDebt, toggleDebtStatus } = useDebts();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [debtToDelete, setDebtToDelete] = useState<string | null>(null);

  // Console log untuk melihat semua debts (hanya di development)
  React.useEffect(() => {
    if (__DEV__ && debts.length > 0) {
      const debtsData = debts.map((debt) => ({
        id: debt.id,
        title: debt.title,
        description: debt.description,
        amount: debt.amount,
        dueDate: debt.dueDate?.toISOString() || null,
        status: debt.status,
        creditor: debt.creditor,
        createdAt: debt.createdAt?.toISOString() || null,
      }));
      console.log('=== All Debts ===', { total: debts.length, debts: debtsData });
    }
  }, [debts]);

  const handleDelete = (id: string) => {
    setDebtToDelete(id);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (debtToDelete) {
      deleteDebt(debtToDelete);
      setDeleteModalVisible(false);
      setDebtToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteModalVisible(false);
    setDebtToDelete(null);
  };

  const handleEdit = (debt: Debt) => {
    router.push({
      pathname: '/create-debt',
      params: {
        id: debt.id,
      },
    });
  };

  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null);
  const [actionModalVisible, setActionModalVisible] = useState(false);

  const handleMorePress = (debt: Debt) => {
    setSelectedDebt(debt);
    setActionModalVisible(true);
  };

  const closeActionModal = () => {
    setActionModalVisible(false);
    setSelectedDebt(null);
  };

  // Calculate totals
  const { totalUnpaid, totalAll, unpaidCount, paidCount } = useMemo(() => {
    const unpaid = debts.filter(d => d.status === 'Unpaid');
    const totalUnpaid = unpaid.reduce((sum, debt) => sum + debt.amount, 0);
    const totalAll = debts.reduce((sum, debt) => sum + debt.amount, 0);
    return {
      totalUnpaid,
      totalAll,
      unpaidCount: unpaid.length,
      paidCount: debts.filter(d => d.status === 'Paid').length,
    };
  }, [debts]);

  return (
    <SafeAreaView className='flex-1 bg-[#F2F2F7]'>
      <Header name='Azhim' customClass='px-[30px]' />
      <ScrollView className='flex-1'>
        <VStack className='px-[30px] py-[20px] gap-5'>
          {/* Back Button */}
          <TouchableOpacity onPress={() => router.back()} className='mb-2'>
            <HStack className='items-center gap-2'>
              <ArrowLeft size={24} color='#4B4B4B' />
              <Text className='text-[16px]' style={{ fontFamily: "HankenGrotesk_500Medium" }}>
                Kembali
              </Text>
            </HStack>
          </TouchableOpacity>

          {/* Title */}
          <Text className='text-[24px] tracking-[-1.1px]' style={{ fontFamily: "HankenGrotesk_800ExtraBold_Italic" }}>
            Daftar Hutang
          </Text>

          {/* Balance Card */}
          <Box className="bg-white p-5 border-[2px] rounded-[8px] py-[18px] px-[24px]">
            <VStack>
              <HStack className='items-center gap-2'>
                <Wallet size={20} color='#4B4B4B' />
                <Text style={{ fontFamily: "HankenGrotesk_500Medium" }} className='text-[15px]'>
                  Total Hutang Belum Lunas
                </Text>
              </HStack>
              <Text style={{ fontFamily: "HankenGrotesk_800ExtraBold_Italic" }} className='text-[36px] mt-3'>
                {formatCurrency(totalUnpaid)}
              </Text>
            </VStack>
            <Divider className='my-[8px] rounded-full bg-[#4B4B4B] h-[2px]' />
            <HStack className='justify-between px-4'>
              <VStack className='items-center'>
                <Text style={{ fontFamily: "HankenGrotesk_500Medium" }} className='text-[15px] text-[#4B4B4B]'>
                  Belum Lunas
                </Text>
                <Text style={{ fontFamily: "HankenGrotesk_700Bold_Italic" }} className='text-[24px] mt-1 text-black'>
                  {unpaidCount}
                </Text>
              </VStack>
              <VStack className='items-center'>
                <Text style={{ fontFamily: "HankenGrotesk_500Medium" }} className='text-[15px] text-[#4B4B4B]'>
                  Total Hutang
                </Text>
                <Text style={{ fontFamily: "HankenGrotesk_700Bold_Italic" }} className='text-[24px] mt-1 text-black'>
                  {formatCurrency(totalAll)}
                </Text>
              </VStack>
            </HStack>
          </Box>

          {/* Debt List - Table Format */}
          {debts.length === 0 ? (
            <VStack className='items-center justify-center py-20'>
              <Text className='text-[16px] text-[#9CA3AF]' style={{ fontFamily: "HankenGrotesk_400Regular" }}>
                Belum ada hutang
              </Text>
              <Text className='text-[14px] text-[#9CA3AF] mt-2' style={{ fontFamily: "HankenGrotesk_400Regular" }}>
                Tekan tombol + untuk menambah hutang baru
              </Text>
            </VStack>
          ) : (
            <View className='bg-white rounded-[8px] mb-8 overflow-hidden'>
              {debts.map((debt, index) => (
                <TouchableOpacity
                  key={debt.id}
                  onPress={() => toggleDebtStatus(debt.id)}
                  activeOpacity={0.7}
                  className={`py-4 px-4 ${
                    index !== debts.length - 1 ? 'border-b border-[#E5E7EB]' : ''
                  }`}
                >
                  <HStack className='items-center justify-between'>
                    {/* Left: Icon and Info */}
                    <HStack className='flex-1 items-center gap-3'>
                      {/* Checkbox */}
                      <View 
                        className={`w-5 h-5 border-2 rounded-[4px] items-center justify-center ${
                          debt.status === 'Paid' 
                            ? 'bg-black border-black' 
                            : 'bg-white border-[#4B4B4B]'
                        }`}
                      >
                        {debt.status === 'Paid' && (
                          <Check size={14} color='white' />
                        )}
                      </View>

                      {/* Icon */}
                      <View className='w-10 h-10 rounded-full bg-[#F3F4F6] items-center justify-center'>
                        <Wallet size={20} color={debt.status === 'Paid' ? '#9CA3AF' : '#4B4B4B'} />
                      </View>

                      {/* Info */}
                      <VStack className='flex-1 gap-1'>
                        <Text 
                          className={`text-[16px] ${
                            debt.status === 'Paid' ? 'line-through text-[#9CA3AF]' : 'text-black'
                          }`}
                          style={{ fontFamily: "HankenGrotesk_700Bold" }}
                          numberOfLines={1}
                        >
                          {debt.title}
                        </Text>
                        <Text 
                          className='text-[12px] text-[#6B7280]' 
                          style={{ fontFamily: "HankenGrotesk_400Regular" }}
                          numberOfLines={1}
                        >
                          {debt.creditor} • {formatDate(debt.dueDate)}
                        </Text>
                      </VStack>
                    </HStack>

                    {/* Right: Amount and Actions */}
                    <HStack className='items-center gap-3'>
                      <VStack className='items-end'>
                        <Text 
                          className={`text-[16px] ${
                            debt.status === 'Paid' ? 'text-[#9CA3AF]' : 'text-black'
                          }`}
                          style={{ fontFamily: "HankenGrotesk_700Bold" }}
                        >
                          {formatCurrency(debt.amount)}
                        </Text>
                        {debt.status === 'Unpaid' && (
                          <View className='bg-[#FEE2E2] px-2 py-0.5 rounded mt-1'>
                            <Text 
                              className='text-[10px] text-[#EF4444]'
                              style={{ fontFamily: "HankenGrotesk_700Bold" }}
                            >
                              Belum Lunas
                            </Text>
                          </View>
                        )}
                      </VStack>

                      {/* More Actions Button */}
                      <TouchableOpacity
                        onPress={(e) => {
                          e.stopPropagation();
                          handleMorePress(debt);
                        }}
                        activeOpacity={0.7}
                        className='p-2'
                      >
                        <MoreVertical size={20} color='#6B7280' />
                      </TouchableOpacity>
                    </HStack>
                  </HStack>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </VStack>
      </ScrollView>
      
      {/* Floating Action Button - Bottom Right */}
      <View className='absolute bottom-16 right-6'>
        <TouchableOpacity
          onPress={() => router.push('/create-debt')}
          className='bg-black rounded-full w-20 h-20 flex items-center justify-center shadow-lg'
          activeOpacity={0.8}
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <Plus size={32} color='white' />
        </TouchableOpacity>
      </View>

      {/* Action Modal (Edit/Delete) */}
      <Modal
        transparent
        visible={actionModalVisible}
        animationType="fade"
        onRequestClose={closeActionModal}
      >
        <View className='flex-1 justify-center items-center bg-black/50 px-6'>
          <TouchableOpacity
            activeOpacity={1}
            onPress={closeActionModal}
            className='absolute inset-0'
          />
          <View className='bg-white rounded-[16px] p-4 w-full max-w-xs'>
            <VStack className='gap-2'>
              <TouchableOpacity
                onPress={() => {
                  if (selectedDebt) {
                    closeActionModal();
                    handleEdit(selectedDebt);
                  }
                }}
                className='flex-row items-center gap-3 p-3 rounded-[8px] active:bg-[#F3F4F6]'
                activeOpacity={0.7}
              >
                <Edit size={20} color='#4B4B4B' />
                <Text 
                  className='text-[16px] text-black flex-1'
                  style={{ fontFamily: "HankenGrotesk_500Medium" }}
                >
                  Edit Hutang
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  if (selectedDebt) {
                    closeActionModal();
                    handleDelete(selectedDebt.id);
                  }
                }}
                className='flex-row items-center gap-3 p-3 rounded-[8px] active:bg-[#FEE2E2]'
                activeOpacity={0.7}
              >
                <Trash2 size={20} color='#EF4444' />
                <Text 
                  className='text-[16px] text-[#EF4444] flex-1'
                  style={{ fontFamily: "HankenGrotesk_500Medium" }}
                >
                  Hapus Hutang
                </Text>
              </TouchableOpacity>
            </VStack>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        transparent
        visible={deleteModalVisible}
        animationType="fade"
        onRequestClose={cancelDelete}
      >
        <View className='flex-1 justify-center items-center bg-black/50 px-6'>
          <View className='bg-white rounded-[16px] p-6 w-full max-w-sm'>
            <VStack className='gap-5'>
              {/* Icon and Title */}
              <VStack className='items-center gap-3'>
                <View className='bg-[#FEE2E2] rounded-full p-4'>
                  <Trash2 size={32} color='#EF4444' />
                </View>
                <Text 
                  className='text-[20px] text-center'
                  style={{ fontFamily: "HankenGrotesk_800ExtraBold_Italic" }}
                >
                  Hapus Hutang?
                </Text>
                <Text 
                  className='text-[14px] text-[#4B4B4B] text-center'
                  style={{ fontFamily: "HankenGrotesk_400Regular" }}
                >
                  Apakah Anda yakin ingin menghapus hutang ini? Tindakan ini tidak dapat dibatalkan.
                </Text>
              </VStack>

              {/* Buttons */}
              <HStack className='gap-3'>
                <TouchableOpacity
                  onPress={cancelDelete}
                  className='flex-1 border-2 border-[#E5E5E5] rounded-[8px] py-3'
                  activeOpacity={0.7}
                >
                  <Text 
                    className='text-center text-[16px] text-[#4B4B4B]'
                    style={{ fontFamily: "HankenGrotesk_700Bold" }}
                  >
                    Batal
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={confirmDelete}
                  className='flex-1 bg-[#EF4444] rounded-[8px] py-3'
                  activeOpacity={0.8}
                >
                  <Text 
                    className='text-center text-[16px] text-white'
                    style={{ fontFamily: "HankenGrotesk_700Bold" }}
                  >
                    Hapus
                  </Text>
                </TouchableOpacity>
              </HStack>
            </VStack>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

