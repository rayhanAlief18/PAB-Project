import { Header } from '@/components/custom';
import FormDatePicker from '@/components/custom/Form/FormDatePicker';
import FormInput from '@/components/custom/Form/FormInput';
import FormTextArea from '@/components/custom/Form/FormTextArea';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { useDebts } from '@/contexts/DebtContext';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Calendar, User } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateDebtScreen() {
  const { addDebt, updateDebt, debts } = useDebts();
  const params = useLocalSearchParams();
  const isEditMode = !!params.id;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [creditor, setCreditor] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);

  // Load debt data if editing
  useEffect(() => {
    if (isEditMode && params.id) {
      const debt = debts.find(d => d.id === params.id);
      if (debt) {
        setTitle(debt.title);
        setDescription(debt.description);
        setAmount(debt.amount.toString());
        setCreditor(debt.creditor);
        setDueDate(debt.dueDate);
      }
    }
  }, [isEditMode, params.id, debts]);

  const handleSave = () => {
    if (!title || !description || !amount || !creditor || !dueDate) {
      // TODO: Show validation error
      return;
    }

    const amountNumber = parseFloat(amount.replace(/[^\d]/g, ''));
    if (isNaN(amountNumber) || amountNumber <= 0) {
      // TODO: Show validation error
      return;
    }

    const debtData = {
      title,
      description,
      amount: amountNumber,
      dueDate,
      status: (isEditMode ? debts.find(d => d.id === params.id)?.status : 'Unpaid') as 'Unpaid' | 'Paid',
      creditor,
    };

    // Console log untuk melihat data yang dibuat/diupdate
    console.log('=== Debt Data ===');
    console.log('Mode:', isEditMode ? 'Edit' : 'Create');
    console.log('Debt Data:', {
      title: debtData.title,
      description: debtData.description,
      amount: debtData.amount,
      creditor: debtData.creditor,
      dueDate: debtData.dueDate?.toISOString() || null,
      status: debtData.status,
    });
    console.log('================');

    if (isEditMode && params.id) {
      updateDebt(params.id as string, debtData);
      console.log('Debt updated successfully');
    } else {
      addDebt(debtData);
      console.log('Debt created successfully');
    }
    router.back();
  };

  const formatAmount = (value: string): string => {
    // Remove all non-digit characters
    const numbers = value.replace(/[^\d]/g, '');
    if (!numbers) return '';
    
    // Format as currency
    return new Intl.NumberFormat('id-ID').format(parseInt(numbers));
  };

  const handleAmountChange = (value: string) => {
    const formatted = formatAmount(value);
    setAmount(formatted);
  };

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
            {isEditMode ? 'Edit Hutang' : 'Tambah Hutang Baru'}
          </Text>

          {/* Form */}
          <VStack className='gap-4'>
            {/* Title Input */}
            <FormInput
              label="Nama Hutang"
              value={title}
              onChangeText={setTitle}
              placeholder='Masukkan nama hutang'
            />

            {/* Description Input */}
            <FormTextArea
              label="Deskripsi"
              value={description}
              onChangeText={setDescription}
              placeholder='Masukkan deskripsi hutang'
              rows={4}
            />

            {/* Amount Input */}
            <FormInput
              label="Jumlah Hutang"
              value={amount}
              onChangeText={handleAmountChange}
              placeholder='Masukkan jumlah hutang'
              keyboardType="numeric"
            />

            {/* Creditor Input */}
            <FormInput
              label="Pemberi Hutang"
              icon={User}
              value={creditor}
              onChangeText={setCreditor}
              placeholder='Masukkan nama pemberi hutang'
            />

            {/* Due Date Input - Menggunakan Date Picker */}
            <FormDatePicker
              label="Tanggal Jatuh Tempo"
              icon={Calendar}
              value={dueDate}
              onChange={setDueDate}
              placeholder='Pilih tanggal jatuh tempo'
              minimumDate={new Date()}
            />
          </VStack>

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSave}
            className='bg-black rounded-[8px] py-4 mt-4 mb-8'
            activeOpacity={0.8}
          >
            <Text
              className='text-white text-center text-[16px]'
              style={{ fontFamily: "HankenGrotesk_700Bold" }}
            >
              {isEditMode ? 'Update Hutang' : 'Simpan Hutang'}
            </Text>
          </TouchableOpacity>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}




