import React, { useState } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { Box, VStack, Text, HStack } from '@gluestack-ui/themed';
import { useMoney } from '@/hooks/useMoney';
import { TransactionItem } from '@/components/TransactionItem';
import { AddTransactionModal } from '@/components/AddTransactionModal';
import { EditTransactionModal } from '@/components/EditTransactionModal';
import { TransferModal } from '@/components/TransferModal';
import { SearchAndFilter } from '@/components/SearchAndFilter';
import { FunnelSimple as Filter, PlusCircle } from "phosphor-react-native";
import { Transaction } from '@/types/money';

export default function TransactionsScreen() {
    const { banks, transactions, addTransaction, addTransfer, updateTransaction, deleteTransaction } = useMoney();
    const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income');
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBank, setSelectedBank] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const filteredTransactions = transactions.filter((transaction: Transaction) => {
        if (filter === 'all') return true;
        return transaction.type === filter;
    }).filter((transaction: Transaction) => {
        // Search filter
        if (searchQuery && !transaction.description.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }
        // Bank filter
        if (selectedBank && transaction.bankId !== selectedBank) {
            return false;
        }
        // Category filter
        if (selectedCategory && transaction.category !== selectedCategory) {
            return false;
        }
        return true;
    });

    const allCategories = Array.from(new Set(transactions.map(t => t.category)));

    const handleTransferSubmit = (fromBankId: string, toBankId: string, amount: number, description: string) => {
        const success = addTransfer(fromBankId, toBankId, amount, description);
        if (success) {
            setShowTransferModal(false);
        }
    };
    const totalIncome = transactions
        .filter((t: Transaction) => t.type === 'income')
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

    const totalExpense = transactions
        .filter((t: Transaction) => t.type === 'expense')
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#000000', paddingTop: 20 }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Box flex={1} bg="$black" p="$4">
                    <VStack space="lg">
                        {/* Header */}
                        <VStack space="sm">
                            <Text color="$white" size="xl" fontWeight="$bold">
                                Transaksi
                            </Text>
                            <Text color="$gray400" size="sm">
                                Riwayat pemasukan dan pengeluaran
                            </Text>
                        </VStack>

                        {/* Summary Cards */}
                        <HStack space="md">
                            <Box
                                flex={1}
                                bg="$gray900"
                                p="$4"
                                borderRadius="$lg"
                                borderWidth={1}
                                borderColor="$gray800"
                            >
                                <VStack space="xs">
                                    <Text color="$green400" size="sm">
                                        Total Pemasukan
                                    </Text>
                                    <Text color="$white" size="lg" fontWeight="$bold">
                                        {formatCurrency(totalIncome)}
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
                            >
                                <VStack space="xs">
                                    <Text color="$red400" size="sm">
                                        Total Pengeluaran
                                    </Text>
                                    <Text color="$white" size="lg" fontWeight="$bold">
                                        {formatCurrency(totalExpense)}
                                    </Text>
                                </VStack>
                            </Box>
                        </HStack>

                        {/* Filter Buttons */}
                        <HStack space="md" justifyContent="space-between">
                            {(['all', 'income', 'expense'] as const).map((filterType) => (
                                <Box
                                    key={filterType}
                                    flex={1}
                                    bg={filter === filterType ? '$gray700' : '$gray900'}
                                    p="$3"
                                    borderRadius="$lg"
                                    borderWidth={1}
                                    borderColor="$gray800"
                                    onTouchEnd={() => setFilter(filterType)}
                                >
                                    <Text
                                        color="$white"
                                        size="sm"
                                        textAlign="center"
                                        fontWeight={filter === filterType ? '$bold' : '$normal'}
                                    >
                                        {filterType === 'all' ? 'Semua' :
                                            filterType === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                                    </Text>
                                </Box>
                            ))}
                        </HStack>

                        {/* Search and Filter */}
                        <SearchAndFilter
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            selectedBank={selectedBank}
                            onBankChange={setSelectedBank}
                            selectedCategory={selectedCategory}
                            onCategoryChange={setSelectedCategory}
                            banks={banks}
                            categories={allCategories}
                        />

                        {/* Transactions List */}
                        <VStack space="md">
                            <HStack justifyContent="space-between" alignItems="center">
                                <Text color="$white" size="lg" fontWeight="$semibold">
                                    Riwayat Transaksi ({filteredTransactions.length})
                                </Text>
                                <HStack space="md" alignItems="center">
                                    <Box
                                        bg="$blue600"
                                        p="$2"
                                        borderRadius="$full"
                                        onTouchEnd={() => {
                                            setTransactionType('income');
                                            setShowAddModal(true);
                                        }}
                                    >
                                        <PlusCircle size={16} color="#FFFFFF" />
                                    </Box>
                                    <Box
                                        bg="$purple600"
                                        p="$2"
                                        borderRadius="$full"
                                        onTouchEnd={() => setShowTransferModal(true)}
                                    >
                                        <Filter size={16} color="#FFFFFF" />
                                    </Box>
                                </HStack>
                            </HStack>

                            {filteredTransactions.length === 0 ? (
                                <Box
                                    bg="$gray900"
                                    p="$6"
                                    borderRadius="$lg"
                                    borderWidth={1}
                                    borderColor="$gray800"
                                >
                                    <Text color="$gray400" textAlign="center">
                                        Belum ada transaksi
                                    </Text>
                                </Box>
                            ) : (
                                filteredTransactions.map((transaction: Transaction) => (
                                    <TransactionItem
                                        key={transaction.id}
                                        transaction={transaction}
                                        onPress={() => {
                                            setSelectedTransaction(transaction);
                                            setShowEditModal(true);
                                        }}
                                    />
                                ))
                            )}

                            <AddTransactionModal
                                isOpen={showAddModal}
                                onClose={() => setShowAddModal(false)}
                                onSubmit={addTransaction}
                                banks={banks}
                                type={transactionType}
                            />

                            <EditTransactionModal
                                isOpen={showEditModal}
                                onClose={() => {
                                    setShowEditModal(false);
                                    setSelectedTransaction(null);
                                }}
                                onSubmit={updateTransaction}
                                onDelete={deleteTransaction}
                                banks={banks}
                                transaction={selectedTransaction}
                            />

                            <TransferModal
                                isOpen={showTransferModal}
                                onClose={() => setShowTransferModal(false)}
                                onSubmit={handleTransferSubmit}
                                banks={banks}
                            />
                        </VStack>
                    </VStack>
                </Box>
            </ScrollView>
        </SafeAreaView>
    );
}