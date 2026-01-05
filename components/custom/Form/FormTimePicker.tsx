import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Modal, Platform, Text, TouchableOpacity, View } from 'react-native';

interface FormTimePickerProps {
  label: string;
  value: Date | null;
  onChange: (date: Date) => void;
  icon?: React.ComponentType<{ size?: number; color?: string }>;
  containerClassName?: string;
  labelClassName?: string;
  placeholder?: string;
}

export default function FormTimePicker({
  label,
  value,
  onChange,
  icon: Icon,
  containerClassName,
  labelClassName,
  placeholder = 'Pilih waktu',
}: FormTimePickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(value || new Date());

  const formatTime = (date: Date | null): string => {
    if (!date) return '';
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatTimeForWeb = (date: Date | null): string => {
    if (!date) return '';
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
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
      // Web: handle time input
      if (selectedDate) {
        onChange(selectedDate);
        setShowPicker(false);
      }
    }
  };

  const handleWebTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = e.target.value;
    if (timeValue) {
      const [hours, minutes] = timeValue.split(':').map(Number);
      const newDate = new Date();
      newDate.setHours(hours, minutes, 0, 0);
      onChange(newDate);
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

  // Web version - use HTML5 time input
  if (Platform.OS === 'web') {
    const timeValue = value ? formatTimeForWeb(value) : '';
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
              type="time"
              value={timeValue}
              onChange={handleWebTimeChange}
              className="flex-1 text-[16px] bg-transparent border-none outline-none text-black"
              style={{ fontFamily: "HankenGrotesk_400Regular", width: '100%' }}
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
              {value ? formatTime(value) : placeholder}
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
                    mode="time"
                    is24Hour={true}
                    display="spinner"
                    onChange={handleTimeChange}
                  />
                </View>
              </View>
            </Modal>
          ) : (
            <DateTimePicker
              value={value || new Date()}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={handleTimeChange}
            />
          )}
        </>
      )}
    </VStack>
  );
}

