import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

export type TaskPriority = 'Low' | 'Medium' | 'High';

interface FormPriorityPickerProps {
  label: string;
  value: TaskPriority;
  onChange: (priority: TaskPriority) => void;
  containerClassName?: string;
  labelClassName?: string;
}

export default function FormPriorityPicker({
  label,
  value,
  onChange,
  containerClassName,
  labelClassName,
}: FormPriorityPickerProps) {
  const priorityOptions: TaskPriority[] = ['Low', 'Medium', 'High'];

  const getPriorityColor = (priority: TaskPriority): string => {
    switch (priority) {
      case 'High':
        return 'bg-[#EF4444] border-[#EF4444]';
      case 'Medium':
        return 'bg-[#F59E0B] border-[#F59E0B]';
      case 'Low':
        return 'bg-[#10B981] border-[#10B981]';
      default:
        return 'bg-[#E5E5E5] border-[#E5E5E5]';
    }
  };

  return (
    <VStack className={`gap-2 ${containerClassName || ''}`}>
      <Text 
        className={`text-[14px] ${labelClassName || ''}`} 
        style={{ fontFamily: "HankenGrotesk_500Medium" }}
      >
        {label}
      </Text>
      <HStack className='gap-3'>
        {priorityOptions.map((priority) => (
          <TouchableOpacity
            key={priority}
            onPress={() => onChange(priority)}
            activeOpacity={0.7}
            className='flex-1'
          >
            <Box 
              className={`border-2 rounded-[8px] py-3 px-4 ${
                value === priority 
                  ? getPriorityColor(priority)
                  : 'bg-white border-[#E5E5E5]'
              }`}
            >
              <Text
                className={`text-center text-[14px] ${
                  value === priority ? 'text-white' : 'text-[#4B4B4B]'
                }`}
                style={{ fontFamily: "HankenGrotesk_700Bold" }}
              >
                {priority}
              </Text>
            </Box>
          </TouchableOpacity>
        ))}
      </HStack>
    </VStack>
  );
}

