import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface FormProgressPickerProps {
  label: string;
  value: number;
  onChange: (progress: number) => void;
  containerClassName?: string;
  labelClassName?: string;
}

const progressOptions = [0, 25, 50, 75, 100];

export default function FormProgressPicker({
  label,
  value,
  onChange,
  containerClassName,
  labelClassName,
}: FormProgressPickerProps) {
  return (
    <VStack className={`gap-2 ${containerClassName || ''}`}>
      <Text 
        className={`text-[14px] ${labelClassName || ''}`} 
        style={{ fontFamily: "HankenGrotesk_500Medium" }}
      >
        {label}
      </Text>
      <HStack className='gap-3'>
        {progressOptions.map((progress) => {
          const isSelected = value === progress;
          return (
            <TouchableOpacity
              key={progress}
              onPress={() => onChange(progress)}
              activeOpacity={0.7}
              className='flex-1'
              style={{ minWidth: 0 }}
            >
              <Box 
                className={`rounded-[8px] py-3 px-2 ${
                  isSelected 
                    ? 'bg-black' 
                    : 'bg-[#F9FAFB] border border-[#E5E7EB]'
                }`}
                style={
                  isSelected
                    ? {
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.15,
                        shadowRadius: 4,
                        elevation: 3,
                      }
                    : {
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.05,
                        shadowRadius: 2,
                        elevation: 1,
                      }
                }
              >
                <Text
                  className={`text-center text-[14px] ${
                    isSelected ? 'text-white' : 'text-[#374151]'
                  }`}
                  style={{ fontFamily: "HankenGrotesk_700Bold" }}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {progress}%
                </Text>
              </Box>
            </TouchableOpacity>
          );
        })}
      </HStack>
    </VStack>
  );
}

