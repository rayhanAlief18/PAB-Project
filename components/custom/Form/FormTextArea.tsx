import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import React from 'react';
import { Text, TextInput, TextInputProps } from 'react-native';

interface FormTextAreaProps extends TextInputProps {
  label: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  rows?: number;
}

export default function FormTextArea({
  label,
  containerClassName,
  labelClassName,
  inputClassName,
  rows = 4,
  ...textInputProps
}: FormTextAreaProps) {
  return (
    <VStack className={`gap-2 ${containerClassName || ''}`}>
      <Text 
        className={`text-[14px] ${labelClassName || ''}`} 
        style={{ fontFamily: "HankenGrotesk_500Medium" }}
      >
        {label}
      </Text>
      <Box className='bg-white border-2 rounded-[8px] px-4 py-3 min-h-[100px]'>
        <TextInput
          {...textInputProps}
          placeholderTextColor='#9CA3AF'
          multiline
          numberOfLines={rows}
          textAlignVertical='top'
          className={`text-[16px] text-black ${inputClassName || ''}`}
          style={{ fontFamily: "HankenGrotesk_400Regular", color: '#000000' }}
        />
      </Box>
    </VStack>
  );
}

