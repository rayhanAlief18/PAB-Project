import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import React from 'react';
import { Text, TextInput, TextInputProps } from 'react-native';

interface FormInputProps extends TextInputProps {
  label?: string;
  icon?: React.ComponentType<{ size?: number; color?: string }>;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
}

export default function FormInput({
  label,
  icon: Icon,
  containerClassName,
  labelClassName,
  inputClassName,
  ...textInputProps
}: FormInputProps) {
  return (
    <VStack className={`gap-2 ${containerClassName || ''}`}>
      <Text 
        className={`text-[14px] ${labelClassName || ''}`} 
        style={{ fontFamily: "HankenGrotesk_500Medium" }}
      >
        {label}
      </Text>
      <Box className='bg-white border border-gray-300 rounded-full px-4 py-3'>
        {Icon ? (
          <HStack className='items-center gap-2'>
            <Icon size={18} color='#4B4B4B' />
            <TextInput
              {...textInputProps}
              placeholderTextColor='#9CA3AF'
              className={`flex-1 text-[16px] text-black ${inputClassName || ''}`}
              style={{ fontFamily: "HankenGrotesk_400Regular", color: '#000000' }}
            />
          </HStack>
        ) : (
          <TextInput
            {...textInputProps}
            placeholderTextColor='#9CA3AF'
            className={`text-[16px] text-black ${inputClassName || ''}`}
            style={{ fontFamily: "HankenGrotesk_400Regular", color: '#000000' }}
          />
        )}
      </Box>
    </VStack>
  );
}

