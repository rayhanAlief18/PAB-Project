import React from 'react';
import { Box, Text, VStack, HStack } from '@gluestack-ui/themed';
import { Bank } from '@/types/money';

interface BankCardProps {
  bank: Bank;
  showBalance?: boolean;
}

export const BankCard: React.FC<BankCardProps> = ({ bank, showBalance = true }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getBankTypeColor = (type: Bank['type']) => {
    switch (type) {
      case 'bumn': return '$blue600';
      case 'swasta': return '$gray600';
      case 'syariah': return '$green600';
      case 'digital': return '$purple600';
      case 'cash': return '$yellow600';
      default: return '$gray600';
    }
  };

  const getBankTypeName = (type: Bank['type']) => {
    switch (type) {
      case 'bumn': return 'BUMN';
      case 'swasta': return 'Swasta';
      case 'syariah': return 'Syariah';
      case 'digital': return 'Digital';
      case 'cash': return 'Cash';
      default: return 'Unknown';
    }
  };

  return (
    <Box
      bg="$gray900"
      p="$4"
      borderRadius="$lg"
      borderWidth={1}
      borderColor="$gray800"
      mb="$3"
    >
      <VStack space="sm">
        <HStack justifyContent="space-between" alignItems="flex-start">
          <VStack space="xs" flex={1}>
            <Text
              color="$white"
              size="sm"
              fontWeight="$medium"
              numberOfLines={2}
            >
              {bank.name}
            </Text>
            <Box
              bg={getBankTypeColor(bank.type)}
              px="$2"
              py="$1"
              borderRadius="$sm"
              alignSelf="flex-start"
            >
              <Text color="$white" size="xs">
                {getBankTypeName(bank.type)}
              </Text>
            </Box>
          </VStack>
        </HStack>
        
        {showBalance && (
          <Text
            color="$white"
            size="lg"
            fontWeight="$bold"
            textAlign="right"
          >
            {formatCurrency(bank.balance)}
          </Text>
        )}
      </VStack>
    </Box>
  );
};