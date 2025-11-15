import React, { useState } from 'react';
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  VStack,
  HStack,
  Button,
  ButtonText,
  Input,
  InputField,
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem
} from '@gluestack-ui/themed';
import { X, CaretDown } from 'phosphor-react-native';
import { Bank } from '@/types/money';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (transaction: {
    type: 'income' | 'expense';
    amount: number;
    description: string;
    bankId: string;
    bankName: string;
    category: string;
  }) => void;
  banks: Bank[];
  type: 'income' | 'expense';
}

const categories = {
  income: ['Salary', 'Freelance', 'Investment', 'Business', 'Gift', 'Other'],
  expense: [
    'Food & Beverages', 'Transportation', 'Shopping', 'Bills',
    'Entertainment', 'Healthcare', 'Education', 'Transfer', 'Other'
  ]
};

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  banks,
  type
}) => {

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedBankId, setSelectedBankId] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleSubmit = () => {
    if (!amount || !description || !selectedBankId || !selectedCategory) return;

    const selectedBank = banks.find((bank) => bank.id === selectedBankId);
    if (!selectedBank) return;

    onSubmit({
      type,
      amount: parseFloat(amount),
      description,
      bankId: selectedBankId,
      bankName: selectedBank.name,
      category: selectedCategory
    });

    setAmount('');
    setDescription('');
    setSelectedBankId('');
    setSelectedCategory('');
    onClose();
  };

  const formatCurrency = (value: string) => {
    const number = value.replace(/[^\d]/g, '');
    return new Intl.NumberFormat('id-ID').format(parseInt(number) || 0);
  };

  const modalBg = type === 'income' ? '#7CFC00' : '#FF6347'; // hijau terang / merah terang
  const modalBorder = modalBg;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalBackdrop />

      <ModalContent bg={modalBg} borderColor={modalBorder} borderWidth={1}>
        <ModalHeader borderBottomWidth={1} borderBottomColor={modalBorder}>
          <Text color="black" size="lg" fontWeight="$bold">
            Tambah {type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
          </Text>
          <ModalCloseButton>
            <X size={20} color="black" />
          </ModalCloseButton>
        </ModalHeader>

        <ModalBody p="$6">
          <VStack space="md">

            {/* Amount */}
            <VStack space="xs">
              <Text color="black" size="sm" fontWeight="$medium">Jumlah</Text>
              <Input bg={modalBg} borderColor={modalBorder} h="$12">
                <InputField
                  placeholder="0"
                  placeholderTextColor="black"
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

            {/* Description */}
            <VStack space="xs">
              <Text color="black" size="sm" fontWeight="$medium">Deskripsi</Text>
              <Input bg={modalBg} borderColor={modalBorder} h="$12">
                <InputField
                  placeholder="Masukkan deskripsi..."
                  placeholderTextColor="black"
                  value={description}
                  onChangeText={setDescription}
                  color="black"
                />
              </Input>
            </VStack>

            {/* Bank */}
            <VStack space="xs">
              <Text color="black" size="sm" fontWeight="$medium">Bank/Wallet</Text>
              <Select selectedValue={selectedBankId} onValueChange={setSelectedBankId}>
                <SelectTrigger bg={modalBg} borderColor={modalBorder} h="$12">
                  <SelectInput placeholder="Pilih bank/wallet" placeholderTextColor="black" color="black" />
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

            {/* Category */}
            <VStack space="xs">
              <Text color="black" size="sm" fontWeight="$medium">Kategori</Text>
              <Select selectedValue={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger bg={modalBg} borderColor={modalBorder} h="$12">
                  <SelectInput placeholder="Pilih kategori" placeholderTextColor="black" color="black" />
                  <SelectIcon as={() => <CaretDown size={16} color="black" />} mr="$3" />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent bg={modalBg} borderColor={modalBorder}>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    {categories[type].map((category) => (
                      <SelectItem key={category} label={category} value={category} />
                    ))}
                  </SelectContent>
                </SelectPortal>
              </Select>
            </VStack>

          </VStack>
        </ModalBody>

        <ModalFooter borderTopWidth={1} borderTopColor={modalBorder} p="$6">
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
              bg={type === 'income' ? '$green600' : '$red600'}
              onPress={handleSubmit}
              isDisabled={!amount || !description || !selectedBankId || !selectedCategory}
              h="$12"
            >
              <ButtonText color="white">Simpan</ButtonText>
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
