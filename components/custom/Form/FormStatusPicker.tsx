import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

export type TaskStatus = 'On Progress' | 'Done';

interface FormStatusPickerProps {
  label: string;
  value: TaskStatus;
  onChange: (status: TaskStatus) => void;
  containerClassName?: string;
  labelClassName?: string;
}

export default function FormStatusPicker({
  label,
  value,
  onChange,
  containerClassName,
  labelClassName,
}: FormStatusPickerProps) {
  const statusOptions: TaskStatus[] = ['On Progress', 'Done'];

  return (
    <VStack className={`gap-2 ${containerClassName || ''}`}>
      <Text 
        className={`text-[14px] ${labelClassName || ''}`} 
        style={{ fontFamily: "HankenGrotesk_500Medium" }}
      >
        {label}
      </Text>
      <HStack className='gap-3'>
        {statusOptions.map((status) => (
          <TouchableOpacity
            key={status}
            onPress={() => onChange(status)}
            activeOpacity={0.7}
            className='flex-1'
          >
            <Box 
              className={`border-2 rounded-[8px] py-3 px-4 ${
                value === status 
                  ? 'bg-black border-black' 
                  : 'bg-white border-[#E5E5E5]'
              }`}
            >
              <Text
                className={`text-center text-[14px] ${
                  value === status ? 'text-white' : 'text-[#4B4B4B]'
                }`}
                style={{ fontFamily: "HankenGrotesk_500Medium" }}
              >
                {status}
              </Text>
            </Box>
          </TouchableOpacity>
        ))}
      </HStack>
    </VStack>
  );
}

