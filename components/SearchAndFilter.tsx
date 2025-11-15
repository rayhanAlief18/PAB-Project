import React from 'react';
import { Box, Text, VStack, HStack, Input, InputField, Select, SelectTrigger, SelectInput, SelectIcon, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicatorWrapper, SelectDragIndicator, SelectItem } from '@gluestack-ui/themed';
import { CaretDown, MagnifyingGlass } from 'phosphor-react-native';
import { Bank } from '@/types/money';

interface SearchAndFilterProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    selectedBank: string;
    onBankChange: (bankId: string) => void;
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    banks: Bank[];
    categories: string[];
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
    searchQuery,
    onSearchChange,
    selectedBank,
    onBankChange,
    selectedCategory,
    onCategoryChange,
    banks,
    categories
}) => {
    return (
        <VStack space="md">
            {/* Search */}
            <VStack space="xs">
                <Text color="$white" size="sm" fontWeight="$medium">
                    Cari Transaksi
                </Text>
                <Box position="relative">
                    <Input bg="$gray800" borderColor="$gray600" h="$12">
                        <InputField
                            placeholder="Cari berdasarkan deskripsi..."
                            value={searchQuery}
                            onChangeText={onSearchChange}
                            color="$white"
                            pl="$10"
                        />
                    </Input>
                    <Box position="absolute" left="$3" top="50%" transform={[{ translateY: -10 }]}>
                        <MagnifyingGlass size={16} color="#9CA3AF" />
                    </Box>
                </Box>
            </VStack>

            {/* Filters */}
            <HStack space="md">
                <VStack space="xs" flex={1}>
                    <Text color="$white" size="sm" fontWeight="$medium">
                        Bank/Wallet
                    </Text>
                    <Select selectedValue={selectedBank} onValueChange={onBankChange}>
                        <SelectTrigger bg="$gray800" borderColor="$gray600" h="$12">
                            <SelectInput placeholder="Semua Bank" color="$white" />
                            <SelectIcon as={() => <CaretDown size={16} color="#FFFFFF" />} mr="$3" />
                        </SelectTrigger>
                        <SelectPortal>
                            <SelectBackdrop />
                            <SelectContent bg="$gray800" borderColor="$gray600">
                                <SelectDragIndicatorWrapper>
                                    <SelectDragIndicator />
                                </SelectDragIndicatorWrapper>
                                <SelectItem label="Semua Bank" value="" />
                                {banks.map((bank) => (
                                    <SelectItem key={bank.id} label={bank.name} value={bank.id} />
                                ))}
                            </SelectContent>
                        </SelectPortal>
                    </Select>
                </VStack>

                <VStack space="xs" flex={1}>
                    <Text color="$white" size="sm" fontWeight="$medium">
                        Kategori
                    </Text>
                    <Select selectedValue={selectedCategory} onValueChange={onCategoryChange}>
                        <SelectTrigger bg="$gray800" borderColor="$gray600" h="$12">
                            <SelectInput placeholder="Semua Kategori" color="$white" />
                            <SelectIcon as={() => <CaretDown size={16} color="#FFFFFF" />} mr="$3" />
                        </SelectTrigger>
                        <SelectPortal>
                            <SelectBackdrop />
                            <SelectContent bg="$gray800" borderColor="$gray600">
                                <SelectDragIndicatorWrapper>
                                    <SelectDragIndicator />
                                </SelectDragIndicatorWrapper>
                                <SelectItem label="Semua Kategori" value="" />
                                {categories.map((category) => (
                                    <SelectItem key={category} label={category} value={category} />
                                ))}
                            </SelectContent>
                        </SelectPortal>
                    </Select>
                </VStack>
            </HStack>
        </VStack>
    );
};