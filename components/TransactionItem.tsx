import React from 'react';
import { Box, Text, VStack, HStack } from '@gluestack-ui/themed';
import { Transaction } from '@/types/money';
import { ArrowUpRight, ArrowDownLeft, DotsThreeVertical  as MoreVertical } from 'phosphor-react-native';

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: () => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onPress }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <Box
      bg="$gray900"
      p="$4"
      borderRadius="$lg"
      borderWidth={1}
      borderColor="$gray800"
      mb="$3"
      onTouchEnd={onPress}
    >
      <HStack justifyContent="space-between" alignItems="center">
        <HStack space="md" alignItems="center" flex={1}>
          <Box
            bg={transaction.type === 'income' ? '$green600' : '$red600'}
            p="$2"
            borderRadius="$full"
          >
            {transaction.type === 'income' ? (
              <ArrowDownLeft size={16} color="#FFFFFF" />
            ) : (
              <ArrowUpRight size={16} color="#FFFFFF" />
            )}
          </Box>
          
          <VStack space="xs" flex={1}>
            <Text
              color="$white"
              size="sm"
              fontWeight="$medium"
              numberOfLines={1}
            >
              {transaction.description}
            </Text>
            <Text color="$gray400" size="xs">
              {transaction.bankName} • {formatDate(transaction.date)}
            </Text>
          </VStack>
        </HStack>
        
        <HStack space="md" alignItems="center">
          <Text
            color={transaction.type === 'income' ? '$green400' : '$red400'}
            size="sm"
            fontWeight="$bold"
          >
            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
          </Text>
          {onPress && (
            <MoreVertical size={16} color="#9CA3AF" />
          )}
        </HStack>
      </HStack>
    </Box>
  );
};