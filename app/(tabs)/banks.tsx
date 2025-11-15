import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Pressable } from 'react-native';
import { Box, VStack, Text, HStack } from '@gluestack-ui/themed';
import { useMoney } from '@/hooks/useMoney';
import { BankCard } from '@/components/BankCard';
import { Bank } from '@/types/money';

export default function BanksScreen() {
  const { banks, getBanksByType } = useMoney();
  const [selectedType, setSelectedType] = useState<Bank['type'] | 'all'>('all');

  const bankTypes: { key: Bank['type'] | 'all'; label: string }[] = [
    { key: 'all', label: 'Semua' },
    { key: 'bumn', label: 'BUMN' },
    { key: 'swasta', label: 'Swasta' },
    { key: 'syariah', label: 'Syariah' },
    { key: 'digital', label: 'Digital' },
    { key: 'cash', label: 'Cash' },
  ];

  const filteredBanks =
    selectedType === 'all' ? banks : getBanksByType(selectedType);

  const totalByType = filteredBanks.reduce(
    (sum: number, bank: Bank) => sum + bank.balance,
    0
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000000' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Box flex={1} bg="$black" p="$4">
          <VStack space="lg">
            {/* Header */}
            <VStack space="sm">
              <Text color="$white" size="xl" fontWeight="$bold">
                Bank & Wallet
              </Text>
              <Text color="$gray400" size="sm">
                Kelola alokasi dana di berbagai platform
              </Text>
            </VStack>

            {/* Total */}
            <Box
              bg="$gray900"
              p="$4"
              borderRadius="$lg"
              borderWidth={1}
              borderColor="$gray800"
            >
              <VStack space="xs">
                <Text color="$gray400" size="sm">
                  Total{' '}
                  {selectedType === 'all'
                    ? 'Semua Platform'
                    : bankTypes.find((t) => t.key === selectedType)?.label}
                </Text>
                <Text color="$white" size="xl" fontWeight="$bold">
                  {formatCurrency(totalByType)}
                </Text>
              </VStack>
            </Box>

            {/* Type Filter */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <HStack space="sm" px="$1">
                {bankTypes.map((type) => (
                  <Pressable key={type.key} onPress={() => setSelectedType(type.key)}>
                    <Box
                      bg={selectedType === type.key ? '$gray700' : '$gray900'}
                      px="$4"
                      py="$2"
                      borderRadius="$full"
                      borderWidth={1}
                      borderColor="$gray800"
                    >
                      <Text
                        color="$white"
                        size="sm"
                        fontWeight={
                          selectedType === type.key ? '$bold' : '$normal'
                        }
                      >
                        {type.label}
                      </Text>
                    </Box>
                  </Pressable>
                ))}
              </HStack>
            </ScrollView>

            {/* Banks List */}
            <VStack space="md">
              <Text color="$white" size="lg" fontWeight="$semibold">
                Daftar Platform ({filteredBanks.length})
              </Text>

              {filteredBanks
                .sort((a: Bank, b: Bank) => b.balance - a.balance)
                .map((bank: Bank) => (
                  <BankCard key={bank.id} bank={bank} />
                ))}

              {filteredBanks.length === 0 && (
                <Box
                  bg="$gray900"
                  p="$6"
                  borderRadius="$lg"
                  borderWidth={1}
                  borderColor="$gray800"
                >
                  <Text color="$gray400" textAlign="center">
                    Tidak ada platform untuk kategori ini
                  </Text>
                </Box>
              )}
            </VStack>
          </VStack>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
