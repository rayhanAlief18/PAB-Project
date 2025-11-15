import React, { useState } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { Box, VStack, Text, HStack } from '@gluestack-ui/themed';
import { useMoney } from '@/hooks/useMoney';
import { BalanceCard } from '@/components/BalanceCard';
import { QuickActions } from '@/components/QuickActions';
import { BankCard } from '@/components/BankCard';
import { TransactionItem } from '@/components/TransactionItem';
import { AddTransactionModal } from '@/components/AddTransactionModal';
import { TransferModal } from '@/components/TransferModal';
import { Bank, Transaction } from '@/types/money';

export default function HomeScreen() {
  const { banks, transactions, totalBalance, addTransaction, addTransfer } = useMoney();
  const [showBalance, setShowBalance] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income');

  const topBanks = banks
    .sort((a: Bank, b: Bank) => b.balance - a.balance)
    .slice(0, 3);

  const recentTransactions = transactions.slice(0, 5);

  const handleAddIncome = () => {
    setTransactionType('income');
    setShowAddModal(true);
  };

  const handleAddExpense = () => {
    setTransactionType('expense');
    setShowAddModal(true);
  };

  const handleTransfer = () => {
    setShowTransferModal(true);
  };

  const handleTransferSubmit = (fromBankId: string, toBankId: string, amount: number, description: string) => {
    const success = addTransfer(fromBankId, toBankId, amount, description);
    if (success) {
      setShowTransferModal(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000000', paddingTop: 20 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Box flex={1} bg="$black" p="$4">
          <VStack space="lg">
            {/* Header */}
            <VStack space="sm">
              <Text color="$white" size="xl" fontWeight="$bold">
                Money Placement
              </Text>
              <Text color="$gray400" size="sm">
                Kelola dan alokasikan dana Anda
              </Text>
            </VStack>

            {/* Balance Card */}
            <BalanceCard
              balance={totalBalance}
              showBalance={showBalance}
              onToggleBalance={() => setShowBalance(!showBalance)}
            />

            {/* Quick Actions */}
            <QuickActions
              onAddIncome={handleAddIncome}
              onAddExpense={handleAddExpense}
              onTransfer={handleTransfer}
            />

            {/* Top Banks */}
            <VStack space="md">
              <HStack justifyContent="space-between" alignItems="center">
                <Text color="$white" size="lg" fontWeight="$semibold">
                  Bank Teratas
                </Text>
              </HStack>
              
              {topBanks.map((bank: Bank) => (
                <BankCard
                  key={bank.id}
                  bank={bank}
                  showBalance={showBalance}
                />
              ))}
            </VStack>

            {/* Recent Transactions */}
            <VStack space="md">
              <HStack justifyContent="space-between" alignItems="center">
                <Text color="$white" size="lg" fontWeight="$semibold">
                  Transaksi Terakhir
                </Text>
              </HStack>
              
              {recentTransactions.map((transaction: Transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                />
              ))}
            </VStack>

            <AddTransactionModal
              isOpen={showAddModal}
              onClose={() => setShowAddModal(false)}
              onSubmit={addTransaction}
              banks={banks}
              type={transactionType}
            />

            <TransferModal
              isOpen={showTransferModal}
              onClose={() => setShowTransferModal(false)}
              onSubmit={handleTransferSubmit}
              banks={banks}
            />
          </VStack>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}