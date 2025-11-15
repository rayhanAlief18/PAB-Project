import { useState, useMemo } from 'react';
import { Bank, Transaction } from '@/types/money';

const initialBanks: Bank[] = [
  // BUMN Banks
  { id: 'bri', name: 'Bank Rakyat Indonesia (BRI)', type: 'bumn', balance: 5000000, color: '#1E40AF' },
  { id: 'mandiri', name: 'Bank Mandiri', type: 'bumn', balance: 3500000, color: '#059669' },
  { id: 'bni', name: 'Bank Negara Indonesia (BNI)', type: 'bumn', balance: 2800000, color: '#DC2626' },
  { id: 'btn', name: 'Bank Tabungan Negara (BTN)', type: 'bumn', balance: 1200000, color: '#7C3AED' },
  
  // Private Banks
  { id: 'bca', name: 'Bank Central Asia (BCA)', type: 'swasta', balance: 4200000, color: '#1F2937' },
  { id: 'cimb', name: 'Bank CIMB Niaga', type: 'swasta', balance: 1800000, color: '#374151' },
  { id: 'danamon', name: 'Bank Danamon', type: 'swasta', balance: 2100000, color: '#4B5563' },
  { id: 'permata', name: 'Bank Permata', type: 'swasta', balance: 1500000, color: '#6B7280' },
  { id: 'panin', name: 'Panin Bank', type: 'swasta', balance: 950000, color: '#9CA3AF' },
  
  // Syariah Banks
  { id: 'bsi', name: 'Bank Syariah Indonesia (BSI)', type: 'syariah', balance: 2300000, color: '#059669' },
  { id: 'bca-syariah', name: 'BCA Syariah', type: 'syariah', balance: 1100000, color: '#065F46' },
  { id: 'mega-syariah', name: 'Bank Mega Syariah', type: 'syariah', balance: 800000, color: '#047857' },
  
  // Digital Wallets
  { id: 'ovo', name: 'OVO', type: 'digital', balance: 750000, color: '#7C3AED' },
  { id: 'gopay', name: 'GoPay', type: 'digital', balance: 650000, color: '#059669' },
  { id: 'dana', name: 'DANA', type: 'digital', balance: 450000, color: '#DC2626' },
  { id: 'linkaja', name: 'LinkAja', type: 'digital', balance: 300000, color: '#EA580C' },
  
  // Cash
  { id: 'cash', name: 'Cash', type: 'cash', balance: 500000, color: '#374151' },
];

const initialTransactions: Transaction[] = [
  {
    id: '1',
    type: 'income',
    amount: 5000000,
    description: 'Gaji Bulanan',
    bankId: 'bri',
    bankName: 'Bank Rakyat Indonesia (BRI)',
    date: new Date('2024-01-15'),
    category: 'Salary'
  },
  {
    id: '2',
    type: 'expense',
    amount: 150000,
    description: 'Belanja Groceries',
    bankId: 'bca',
    bankName: 'Bank Central Asia (BCA)',
    date: new Date('2024-01-16'),
    category: 'Food & Beverages'
  },
  {
    id: '3',
    type: 'expense',
    amount: 50000,
    description: 'Transportasi Online',
    bankId: 'gopay',
    bankName: 'GoPay',
    date: new Date('2024-01-16'),
    category: 'Transportation'
  },
  {
    id: '4',
    type: 'income',
    amount: 1200000,
    description: 'Freelance Project',
    bankId: 'dana',
    bankName: 'DANA',
    date: new Date('2024-01-17'),
    category: 'Freelance'
  }
];

export const useMoney = () => {
  const [banks, setBanks] = useState<Bank[]>(initialBanks);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  const totalBalance = useMemo(() => {
    return banks.reduce((sum, bank) => sum + bank.balance, 0);
  }, [banks]);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      date: new Date(),
    };

    setTransactions(prev => [newTransaction, ...prev]);
    
    // Update bank balance
    setBanks(prev => prev.map(bank => {
      if (bank.id === transaction.bankId) {
        const newBalance = transaction.type === 'income' 
          ? bank.balance + transaction.amount
          : bank.balance - transaction.amount;
        return { ...bank, balance: Math.max(0, newBalance) };
      }
      return bank;
    }));
  };

  const updateTransaction = (transactionId: string, updatedTransaction: Omit<Transaction, 'id' | 'date'>) => {
    const oldTransaction = transactions.find(t => t.id === transactionId);
    if (!oldTransaction) return;

    // Revert old transaction effect on bank balance
    setBanks(prev => prev.map(bank => {
      if (bank.id === oldTransaction.bankId) {
        const revertedBalance = oldTransaction.type === 'income'
          ? bank.balance - oldTransaction.amount
          : bank.balance + oldTransaction.amount;
        return { ...bank, balance: Math.max(0, revertedBalance) };
      }
      return bank;
    }));

    // Apply new transaction effect on bank balance
    setBanks(prev => prev.map(bank => {
      if (bank.id === updatedTransaction.bankId) {
        const newBalance = updatedTransaction.type === 'income'
          ? bank.balance + updatedTransaction.amount
          : bank.balance - updatedTransaction.amount;
        return { ...bank, balance: Math.max(0, newBalance) };
      }
      return bank;
    }));

    // Update transaction
    setTransactions(prev => prev.map(transaction => {
      if (transaction.id === transactionId) {
        return {
          ...updatedTransaction,
          id: transactionId,
          date: transaction.date, // Keep original date
        };
      }
      return transaction;
    }));
  };

  const deleteTransaction = (transactionId: string) => {
    const transactionToDelete = transactions.find(t => t.id === transactionId);
    if (!transactionToDelete) return;

    // Revert transaction effect on bank balance
    setBanks(prev => prev.map(bank => {
      if (bank.id === transactionToDelete.bankId) {
        const revertedBalance = transactionToDelete.type === 'income'
          ? bank.balance - transactionToDelete.amount
          : bank.balance + transactionToDelete.amount;
        return { ...bank, balance: Math.max(0, revertedBalance) };
      }
      return bank;
    }));

    // Remove transaction
    setTransactions(prev => prev.filter(transaction => transaction.id !== transactionId));
  };

  const transferMoney = (fromBankId: string, toBankId: string, amount: number) => {
    const fromBank = banks.find(b => b.id === fromBankId);
    const toBank = banks.find(b => b.id === toBankId);
    
    if (!fromBank || !toBank || fromBank.balance < amount) {
      return false;
    }

    setBanks(prev => prev.map(bank => {
      if (bank.id === fromBankId) {
        return { ...bank, balance: Math.max(0, bank.balance - amount) };
      }
      if (bank.id === toBankId) {
        return { ...bank, balance: bank.balance + amount };
      }
      return bank;
    }));

    return true;
  };

  const addTransfer = (fromBankId: string, toBankId: string, amount: number, description: string) => {
    const fromBank = banks.find(b => b.id === fromBankId);
    const toBank = banks.find(b => b.id === toBankId);
    
    if (!fromBank || !toBank || fromBank.balance < amount) {
      return false;
    }

    // Update balances
    setBanks(prev => prev.map(bank => {
      if (bank.id === fromBankId) {
        return { ...bank, balance: bank.balance - amount };
      }
      if (bank.id === toBankId) {
        return { ...bank, balance: bank.balance + amount };
      }
      return bank;
    }));

    // Add transfer out transaction
    const transferOutTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'expense',
      amount,
      description: `Transfer ke ${toBank.name} - ${description}`,
      bankId: fromBankId,
      bankName: fromBank.name,
      date: new Date(),
      category: 'Transfer'
    };

    // Add transfer in transaction
    const transferInTransaction: Transaction = {
      id: (Date.now() + 1).toString(),
      type: 'income',
      amount,
      description: `Transfer dari ${fromBank.name} - ${description}`,
      bankId: toBankId,
      bankName: toBank.name,
      date: new Date(),
      category: 'Transfer'
    };

    setTransactions(prev => [transferOutTransaction, transferInTransaction, ...prev]);
    return true;
  };

  const getBanksByType = (type: Bank['type']) => {
    return banks.filter(bank => bank.type === type);
  };

  return {
    banks,
    transactions,
    totalBalance,
    addTransaction,
    addTransfer,
    updateTransaction,
    deleteTransaction,
    transferMoney,
    getBanksByType,
  };
};