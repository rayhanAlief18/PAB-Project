import React from 'react';
import { Box, Text, VStack, HStack } from '@gluestack-ui/themed';
import { Plus, Minus, ArrowDown, ArrowUp } from 'phosphor-react-native';

interface QuickActionsProps {
    onAddIncome: () => void;
    onAddExpense: () => void;
    onTransfer: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
    onAddIncome,
    onAddExpense,
    onTransfer
}) => {
    return (
        <HStack space="md" justifyContent="space-between">
            <Box
                flex={1}
                bg="$gray900"
                p="$4"
                borderRadius="$lg"
                borderWidth={1}
                borderColor="$gray800"
                onTouchEnd={onAddIncome}
            >
                <VStack space="xs" alignItems="center">
                    <Box
                        bg="$green600"
                        p="$2"
                        borderRadius="$full"
                    >
                        <Plus size={20} color="#FFFFFF" />
                    </Box>
                    <Text color="$white" size="sm" textAlign="center">
                        Pemasukan
                    </Text>
                </VStack>
            </Box>

            <Box
                flex={1}
                bg="$gray900"
                p="$4"
                borderRadius="$lg"
                borderWidth={1}
                borderColor="$gray800"
                onTouchEnd={onAddExpense}
            >
                <VStack space="xs" alignItems="center">
                    <Box
                        bg="$red600"
                        p="$2"
                        borderRadius="$full"
                    >
                        <Minus size={20} color="#FFFFFF" />
                    </Box>
                    <Text color="$white" size="sm" textAlign="center">
                        Pengeluaran
                    </Text>
                </VStack>
            </Box>

            <Box
                flex={1}
                bg="$gray900"
                p="$4"
                borderRadius="$lg"
                borderWidth={1}
                borderColor="$gray800"
                onTouchEnd={onTransfer}
            >
                <VStack space="xs" alignItems="center">
                    <Box
                        bg="$blue600"
                        p="$2"
                        borderRadius="$full"
                    >
                        <ArrowUp size={16} color="#FFFFFF" />
                        <ArrowDown size={16} color="#FFFFFF" />
                    </Box>
                    <Text color="$white" size="sm" textAlign="center">
                        Transfer
                    </Text>
                </VStack>
            </Box>
        </HStack>
    );
};