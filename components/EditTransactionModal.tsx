import React, { useState, useEffect } from 'react';
import { 
  Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton, 
  ModalBody, ModalFooter, Text, VStack, HStack, Button, ButtonText, 
  Input, InputField, Select, SelectTrigger, SelectInput, SelectIcon, 
  SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicatorWrapper, 
  SelectDragIndicator, SelectItem 
} from '@gluestack-ui/themed';
import { X, CaretDown } from 'phosphor-react-native';
import { Bank, Transaction } from '@/types/money';

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (transactionId: string, updatedTransaction: {
    type: 'income' | 'expense';
    amount: number;
    description: string;
    bankId: string;
    bankName: string;
    category: string;
  }) => void;
  onDelete: (transactionId: string) => void;
  banks: Bank[];
  transaction: Transaction | null;
}

const categories = {
  income: ['Salary', 'Freelance', 'Investment', 'Business', 'Gift', 'Other'],
  expense: ['Food & Beverages', 'Transportation', 'Shopping', 'Bills', 'Entertainment', 'Healthcare', 'Education', 'Transfer', 'Other']
};

export const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  banks,
  transaction
}) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedBankId, setSelectedBankId] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    if (transaction) {
      setAmount(transaction.amount.toString());
      setDescription(transaction.description);
      setSelectedBankId(transaction.bankId);
      setSelectedCategory(transaction.category);
    }
  }, [transaction]);

  const handleSubmit = () => {
    if (!transaction || !amount || !description || !selectedBankId || !selectedCategory) return;

    const selectedBank = banks.find(bank => bank.id === selectedBankId);
    if (!selectedBank) return;

    onSubmit(transaction.id, {
      type: transaction.type,
      amount: parseFloat(amount),
      description,
      bankId: selectedBankId,
      bankName: selectedBank.name,
      category: selectedCategory
    });

    onClose();
  };

  const handleDelete = () => {
    if (transaction) {
      onDelete(transaction.id);
      onClose();
    }
  };

  const formatCurrency = (value: string) => {
    const number = value.replace(/[^\d]/g, '');
    return new Intl.NumberFormat('id-ID').format(parseInt(number) || 0);
  };

  if (!transaction) return null;

  // Warna kuning modal
  const modalBg = '#FFD700'; // gold / kuning
  const modalBorder = modalBg;
  const btnBg = transaction.type === 'income' ? '#32CD32' : '#FF4500'; // income hijau, expense merah

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalBackdrop />

      <ModalContent bg={modalBg} borderColor={modalBorder} borderWidth={1}>
        <ModalHeader borderBottomWidth={1} borderBottomColor={modalBorder}>
          <Text color="black" size="lg" fontWeight="$bold">
            Edit {transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
          </Text>
          <ModalCloseButton>
            <X size={20} color="black" />
          </ModalCloseButton>
        </ModalHeader>
        
        <ModalBody p="$6">
          <VStack space="md">
            <VStack space="xs">
              <Text color="black" size="sm" fontWeight="$medium">Jumlah</Text>
              <Input bg={modalBg} borderColor={modalBorder} h="$12">
                <InputField
                  placeholder="0"
                  value={amount}
                  onChangeText={(text: string) => {
                    const numericValue = text.replace(/[^\d]/g, '');
                    setAmount(numericValue);
                  }}
                  keyboardType="numeric"
                  color="black"
                />
              </Input>
              {amount && (
                <Text color="black" size="xs">
                  Rp {formatCurrency(amount)}
                </Text>
              )}
            </VStack>

            <VStack space="xs">
              <Text color="black" size="sm" fontWeight="$medium">Deskripsi</Text>
              <Input bg={modalBg} borderColor={modalBorder} h="$12">
                <InputField
                  placeholder="Masukkan deskripsi..."
                  value={description}
                  onChangeText={setDescription}
                  color="black"
                />
              </Input>
            </VStack>

            <VStack space="xs">
              <Text color="black" size="sm" fontWeight="$medium">Bank/Wallet</Text>
              <Select selectedValue={selectedBankId} onValueChange={setSelectedBankId}>
                <SelectTrigger bg={modalBg} borderColor={modalBorder} h="$12">
                  <SelectInput placeholder="Pilih bank/wallet" color="black" />
                  <SelectIcon as={() => <CaretDown size={16} color="black" />} mr="$3" />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent bg={modalBg} borderColor={modalBorder}>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    {banks.map((bank) => (
                      <SelectItem key={bank.id} label={bank.name} value={bank.id} />
                    ))}
                  </SelectContent>
                </SelectPortal>
              </Select>
            </VStack>

            <VStack space="xs">
              <Text color="black" size="sm" fontWeight="$medium">Kategori</Text>
              <Select selectedValue={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger bg={modalBg} borderColor={modalBorder} h="$12">
                  <SelectInput placeholder="Pilih kategori" color="black" />
                  <SelectIcon as={() => <CaretDown size={16} color="black" />} mr="$3" />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent bg={modalBg} borderColor={modalBorder}>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    {categories[transaction.type].map((category) => (
                      <SelectItem key={category} label={category} value={category} />
                    ))}
                  </SelectContent>
                </SelectPortal>
              </Select>
            </VStack>
          </VStack>
        </ModalBody>

        <ModalFooter borderTopWidth={1} borderTopColor={modalBorder} p="$6">
          <VStack space="md" flex={1}>
            <HStack space="md" flex={1}>
              <Button
                flex={1}
                variant="outline"
                borderColor="black"
                onPress={onClose}
                h="$12"
              >
                <ButtonText color="black">Batal</ButtonText>
              </Button>
              <Button
                flex={1}
                bg={btnBg}
                onPress={handleSubmit}
                isDisabled={!amount || !description || !selectedBankId || !selectedCategory}
                h="$12"
              >
                <ButtonText color="white">Update</ButtonText>
              </Button>
            </HStack>
            <Button
              flex={1}
              bg="#FF4500"
              onPress={handleDelete}
              h="$12"
            >
              <ButtonText color="white">Hapus Transaksi</ButtonText>
            </Button>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
