import React from 'react';
import { Box, Text, VStack, HStack } from '@gluestack-ui/themed';
import { Eye, EyeClosed } from 'phosphor-react-native';

interface BalanceCardProps {
    balance: number;
    showBalance: boolean;
    onToggleBalance: () => void;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
    balance,
    showBalance,
    onToggleBalance
}) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <Box
            bg="$black"
            p="$6"
            borderRadius="$lg"
            borderWidth={1}
            borderColor="$gray800"
        >
            <VStack space="md">
                <HStack justifyContent="space-between" alignItems="center">
                    <Text color="$gray400" size="sm">
                        Total Saldo
                    </Text>
                    <Box onTouchEnd={onToggleBalance} p="$1">
                        {showBalance ? (
                            <Eye size={20} color="#9CA3AF" />
                        ) : (
                            <EyeClosed size={20} color="#9CA3AF" />
                        )}
                    </Box>
                </HStack>

                <Text
                    color="$white"
                    size="2xl"
                    fontWeight="$bold"
                >
                    {showBalance ? formatCurrency(balance) : '••••••••'}
                </Text>
            </VStack>
        </Box>
    );
};