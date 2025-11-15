import React, { useState } from 'react';
import { 
  Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton, 
  ModalBody, ModalFooter, Box, Text, VStack, HStack, Button, ButtonText, 
  Input, InputField, Select, SelectTrigger, SelectInput, SelectIcon, 
  SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicatorWrapper, 
  SelectDragIndicator, SelectItem 
} from '@gluestack-ui/themed';
import { X, CaretDown, ArrowRight } from 'phosphor-react-native';
import { Bank } from '@/types/money';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (fromBankId: string, toBankId: string, amount: number, description: string) => void;
  banks: Bank[];
}

export const TransferModal: React.FC<TransferModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  banks
}) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [fromBankId, setFromBankId] = useState('');
  const [toBankId, setToBankId] = useState('');

  const handleSubmit = () => {
    if (!amount || !description || !fromBankId || !toBankId || fromBankId === toBankId) {
      return;
    }

    onSubmit(fromBankId, toBankId, parseFloat(amount), description);

    setAmount('');
    setDescription('');
    setFromBankId('');
    setToBankId('');
    onClose();
  };

  const formatCurrency = (value: string) => {
    const number = value.replace(/[^\d]/g, '');
    return new Intl.NumberFormat('id-ID').format(parseInt(number) || 0);
  };

  const fromBank = banks.find(bank => bank.id === fromBankId);
  const availableBalance = fromBank ? fromBank.balance : 0;

  // Warna modal biru terang
  const modalBg = '#87CEFA'; // light blue
  const modalBorder = modalBg;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalBackdrop />

      <ModalContent bg={modalBg} borderColor={modalBorder} borderWidth={1}>
        <ModalHeader borderBottomWidth={1} borderBottomColor={modalBorder}>
          <Text color="black" size="lg" fontWeight="$bold">
            Transfer Dana
          </Text>
          <ModalCloseButton>
            <X size={20} color="black" />
          </ModalCloseButton>
        </ModalHeader>
        
        <ModalBody p="$6">
          <VStack space="lg">
            <VStack space="sm">
              <Text color="black" size="sm" fontWeight="$medium">Dari Bank/Wallet</Text>
              <Select selectedValue={fromBankId} onValueChange={setFromBankId}>
                <SelectTrigger bg={modalBg} borderColor={modalBorder} h="$12">
                  <SelectInput placeholder="Pilih sumber dana" color="black" />
                  <SelectIcon as={() => <CaretDown size={16} color="black" />} mr="$3" />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent bg={modalBg} borderColor={modalBorder}>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    {banks.map((bank) => (
                      <SelectItem key={bank.id} label={`${bank.name} - ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(bank.balance)}`} value={bank.id} />
                    ))}
                  </SelectContent>
                </SelectPortal>
              </Select>
              {fromBank && (
                <Text color="black" size="xs">
                  Saldo tersedia: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(availableBalance)}
                </Text>
              )}
            </VStack>

            <Box alignItems="center" py="$2">
              <ArrowRight size={24} color="black" />
            </Box>

            <VStack space="sm">
              <Text color="black" size="sm" fontWeight="$medium">Ke Bank/Wallet</Text>
              <Select selectedValue={toBankId} onValueChange={setToBankId}>
                <SelectTrigger bg={modalBg} borderColor={modalBorder} h="$12">
                  <SelectInput placeholder="Pilih tujuan transfer" color="black" />
                  <SelectIcon as={() => <CaretDown size={16} color="black" />} mr="$3" />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent bg={modalBg} borderColor={modalBorder}>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    {banks.filter(bank => bank.id !== fromBankId).map((bank) => (
                      <SelectItem key={bank.id} label={bank.name} value={bank.id} />
                    ))}
                  </SelectContent>
                </SelectPortal>
              </Select>
            </VStack>

            <VStack space="sm">
              <Text color="black" size="sm" fontWeight="$medium">Jumlah Transfer</Text>
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

            <VStack space="sm">
              <Text color="black" size="sm" fontWeight="$medium">Catatan Transfer</Text>
              <Input bg={modalBg} borderColor={modalBorder} h="$12">
                <InputField
                  placeholder="Masukkan catatan..."
                  value={description}
                  onChangeText={setDescription}
                  color="black"
                />
              </Input>
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
              bg="#1E90FF" // tombol biru tua
              onPress={handleSubmit}
              isDisabled={!amount || !description || !fromBankId || !toBankId || fromBankId === toBankId || parseFloat(amount) > availableBalance}
              h="$12"
            >
              <ButtonText color="white">Transfer</ButtonText>
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
