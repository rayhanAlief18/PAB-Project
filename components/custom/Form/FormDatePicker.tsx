import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Modal, Platform, Text, TouchableOpacity, View } from 'react-native';

interface FormDatePickerProps {
  label: string;
  value: Date | null;
  onChange: (date: Date) => void;
  icon?: React.ComponentType<{ size?: number; color?: string }>;
  containerClassName?: string;
  labelClassName?: string;
  placeholder?: string;
  minimumDate?: Date;
}

export default function FormDatePicker({
  label,
  value,
  onChange,
  icon: Icon,
  containerClassName,
  labelClassName,
  placeholder = 'Pilih tanggal',
  minimumDate,
}: FormDatePickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(value || new Date());

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDateForWeb = (date: Date | null): string => {
    if (!date) return '';
    // Pastikan date adalah Date object yang valid
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) return '';
    
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
      if (event.type === 'set' && selectedDate) {
        onChange(selectedDate);
      }
    } else if (Platform.OS === 'ios') {
      // iOS: update temp date
      if (selectedDate) {
        setTempDate(selectedDate);
      }
    } else {
      // Web: handle date input
      if (selectedDate) {
        onChange(selectedDate);
        setShowPicker(false);
      }
    }
  };

  const handleWebDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    if (dateValue) {
      // Parse date value yang sudah dalam format yyyy-MM-dd
      const newDate = new Date(dateValue + 'T00:00:00');
      if (!isNaN(newDate.getTime())) {
        onChange(newDate);
      }
    }
  };

  const handleConfirm = () => {
    onChange(tempDate);
    setShowPicker(false);
  };

  const handleCancel = () => {
    setTempDate(value || new Date());
    setShowPicker(false);
  };

  // Web version - use HTML5 date input
  if (Platform.OS === 'web') {
    // Pastikan format date benar untuk web
    let dateValue = '';
    if (value) {
      try {
        dateValue = formatDateForWeb(value);
      } catch (error) {
        console.error('Error formatting date for web:', error);
        dateValue = '';
      }
    }
    
    let minDateValue = '';
    if (minimumDate) {
      try {
        minDateValue = formatDateForWeb(minimumDate);
      } catch (error) {
        console.error('Error formatting minimum date for web:', error);
        minDateValue = '';
      }
    }
    
    return (
      <VStack className={`gap-2 ${containerClassName || ''}`}>
        <Text 
          className={`text-[14px] ${labelClassName || ''}`} 
          style={{ fontFamily: "HankenGrotesk_500Medium" }}
        >
          {label}
        </Text>
        <Box className='bg-white border-2 rounded-[8px] px-4 py-3'>
          <HStack className='items-center gap-2'>
            {Icon && <Icon size={18} color='#4B4B4B' />}
            {/* @ts-ignore - HTML input for web platform */}
            <input
              type="date"
              value={dateValue}
              onChange={handleWebDateChange}
              min={minDateValue || undefined}
              className="flex-1 text-[16px] bg-transparent border-none outline-none text-black"
              style={{ fontFamily: "HankenGrotesk_400Regular", width: '100%', color: '#000000' }}
              placeholder={placeholder}
            />
          </HStack>
        </Box>
      </VStack>
    );
  }

  return (
    <VStack className={`gap-2 ${containerClassName || ''}`}>
      <Text 
        className={`text-[14px] ${labelClassName || ''}`} 
        style={{ fontFamily: "HankenGrotesk_500Medium" }}
      >
        {label}
      </Text>
      <TouchableOpacity onPress={() => {
        setTempDate(value || new Date());
        setShowPicker(true);
      }} activeOpacity={0.7}>
        <Box className='bg-white border-2 rounded-[8px] px-4 py-3'>
          <HStack className='items-center gap-2'>
            {Icon && <Icon size={18} color='#4B4B4B' />}
            <Text 
              className={`flex-1 text-[16px] ${value ? 'text-black' : 'text-[#9CA3AF]'}`}
              style={{ fontFamily: "HankenGrotesk_400Regular" }}
            >
              {value ? formatDate(value) : placeholder}
            </Text>
          </HStack>
        </Box>
      </TouchableOpacity>
      {showPicker && (
        <>
          {Platform.OS === 'ios' ? (
            <Modal
              transparent
              animationType="slide"
              visible={showPicker}
              onRequestClose={handleCancel}
            >
              <View className='flex-1 justify-end bg-black/50'>
                <View className='bg-white rounded-t-[20px] p-5'>
                  <HStack className='justify-between items-center mb-4'>
                    <TouchableOpacity onPress={handleCancel}>
                      <Text 
                        className='text-[16px] text-[#9CA3AF]'
                        style={{ fontFamily: "HankenGrotesk_500Medium" }}
                      >
                        Batal
                      </Text>
                    </TouchableOpacity>
                    <Text 
                      className='text-[18px]'
                      style={{ fontFamily: "HankenGrotesk_700Bold" }}
                    >
                      {label}
                    </Text>
                    <TouchableOpacity onPress={handleConfirm}>
                      <Text 
                        className='text-[16px] text-black'
                        style={{ fontFamily: "HankenGrotesk_700Bold" }}
                      >
                        Selesai
                      </Text>
                    </TouchableOpacity>
                  </HStack>
                  <DateTimePicker
                    value={tempDate}
                    mode="date"
                    display="spinner"
                    onChange={handleDateChange}
                    minimumDate={minimumDate}
                  />
                </View>
              </View>
            </Modal>
          ) : (
            <DateTimePicker
              value={value || new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={minimumDate}
            />
          )}
        </>
      )}
    </VStack>
  );
}

