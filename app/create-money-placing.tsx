import HeaderPage from '@/components/custom/HeaderPage';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { useMoneyPlacing } from '@/contexts/MoneyPlacingContext';
import { Box, Button, ButtonText } from '@/components/ui/gluestack-ui-components';

const BANKS = [
    'Bank Central Asia (BCA)',
    'Bank Rakyat Indonesia (BRI)',
    'Bank Mandiri',
    'Bank Negara Indonesia (BNI)',
    'Bank Syariah Indonesia (BSI)',
    'CIMB Niaga',
    'Permata Bank',
    'Danamon',
];

const E_WALLETS = [
    'DANA',
    'OVO',
    'GoPay',
    'ShopeePay',
    'LinkAja',
    'AstraPay',
    'Jenius',
    'iSaku',
    'MyWallet',
];

export default function CreateMoneyPlacing() {
    const router = useRouter();
    const { addPlacement, loading } = useMoneyPlacing();

    const [formData, setFormData] = useState({
        name: '',
        type: 'bank' as 'bank' | 'e-wallet',
        nominal: '',
    });

    const [showBankDropdown, setShowBankDropdown] = useState(false);
    const [showEWalletDropdown, setShowEWalletDropdown] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Nama harus diisi';
        }

        if (!formData.nominal.trim()) {
            newErrors.nominal = 'Nominal harus diisi';
        } else if (isNaN(Number(formData.nominal.replace(/\./g, '')))) {
            newErrors.nominal = 'Nominal harus berupa angka';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            const nominalNumber = parseInt(formData.nominal.replace(/\./g, ''), 10);

            await addPlacement({
                name: formData.name,
                type: formData.type,
                nominal: nominalNumber,
            });

            router.back();
        } catch (error) {
            console.error('Error creating placement:', error);
        }
    };

    const formatCurrency = (value: string) => {
        const numeric = value.replace(/\./g, '');
        if (numeric === '') return '';
        return new Intl.NumberFormat('id-ID').format(Number(numeric));
    };

    const handleNominalChange = (text: string) => {
        const formatted = formatCurrency(text);
        setFormData({ ...formData, nominal: formatted });

        if (errors.nominal) {
            setErrors({ ...errors, nominal: '' });
        }
    };

    const selectItem = (item: string, type: 'bank' | 'e-wallet') => {
        setFormData({ ...formData, name: item, type });
        setShowBankDropdown(false);
        setShowEWalletDropdown(false);

        if (errors.name) {
            setErrors({ ...errors, name: '' });
        }
    };

    return (
        <View className="flex-1 bg-[#F2F2F4]">
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView className="flex-1">
                <HeaderPage title="Tambah Money Placing" />

                <ScrollView className="flex-1 px-4 pt-6">
                    <Box className="bg-white rounded-xl p-5 mb-4">
                        <Text className="text-lg font-bold text-gray-900 mb-6">
                            Pilih Jenis
                        </Text>

                        {/* Pilih Jenis */}
                        <View className="flex-row space-x-4 mb-8">
                            <TouchableOpacity
                                onPress={() => {
                                    setFormData({ ...formData, type: 'bank' });
                                    setShowEWalletDropdown(false);
                                }}
                                className={`flex-1 py-3 rounded-lg border-2 ${formData.type === 'bank'
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-300'
                                    }`}
                            >
                                <Text
                                    className={`text-center font-semibold ${formData.type === 'bank'
                                            ? 'text-blue-600'
                                            : 'text-gray-600'
                                        }`}
                                >
                                    Bank
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    setFormData({ ...formData, type: 'e-wallet' });
                                    setShowBankDropdown(false);
                                }}
                                className={`flex-1 py-3 rounded-lg border-2 ${formData.type === 'e-wallet'
                                        ? 'border-green-500 bg-green-50'
                                        : 'border-gray-300'
                                    }`}
                            >
                                <Text
                                    className={`text-center font-semibold ${formData.type === 'e-wallet'
                                            ? 'text-green-600'
                                            : 'text-gray-600'
                                        }`}
                                >
                                    e-Wallet
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Dropdown */}
                        <View className="mb-6">
                            <Text className="text-sm font-medium text-gray-700 mb-2">
                                Nama {formData.type === 'bank' ? 'Bank' : 'e-Wallet'}
                            </Text>

                            <TouchableOpacity
                                onPress={() => {
                                    if (formData.type === 'bank') {
                                        setShowBankDropdown(!showBankDropdown);
                                        setShowEWalletDropdown(false);
                                    } else {
                                        setShowEWalletDropdown(!showEWalletDropdown);
                                        setShowBankDropdown(false);
                                    }
                                }}
                                className={`border-2 rounded-lg p-3 flex-row justify-between items-center ${errors.name ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            >
                                <Text
                                    className={
                                        formData.name ? 'text-gray-900' : 'text-gray-500'
                                    }
                                >
                                    {formData.name ||
                                        `Pilih ${formData.type === 'bank' ? 'Bank' : 'e-Wallet'}`}
                                </Text>

                                {formData.type === 'bank' ? (
                                    showBankDropdown ? (
                                        <ChevronUp size={20} color="#6B7280" />
                                    ) : (
                                        <ChevronDown size={20} color="#6B7280" />
                                    )
                                ) : showEWalletDropdown ? (
                                    <ChevronUp size={20} color="#6B7280" />
                                ) : (
                                    <ChevronDown size={20} color="#6B7280" />
                                )}
                            </TouchableOpacity>

                            {errors.name && (
                                <Text className="text-red-500 text-xs mt-1">
                                    {errors.name}
                                </Text>
                            )}

                            {showBankDropdown && (
                                <View className="mt-2 border border-gray-300 rounded-lg bg-white max-h-60">
                                    <ScrollView>
                                        {BANKS.map((bank) => (
                                            <TouchableOpacity
                                                key={bank}
                                                onPress={() => selectItem(bank, 'bank')}
                                                className="p-3 border-b border-gray-200"
                                            >
                                                <Text>{bank}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            )}

                            {showEWalletDropdown && (
                                <View className="mt-2 border border-gray-300 rounded-lg bg-white max-h-60">
                                    <ScrollView>
                                        {E_WALLETS.map((wallet) => (
                                            <TouchableOpacity
                                                key={wallet}
                                                onPress={() => selectItem(wallet, 'e-wallet')}
                                                className="p-3 border-b border-gray-200"
                                            >
                                                <Text>{wallet}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            )}
                        </View>

                        {/* Nominal */}
                        <View className="mb-8">
                            <Text className="text-sm font-medium text-gray-700 mb-2">
                                Nominal (Rp)
                            </Text>

                            <View
                                className={`flex-row items-center border-2 rounded-lg px-3 ${errors.nominal ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            >
                                <Text className="text-gray-500 mr-2">Rp</Text>
                                <TextInput
                                    value={formData.nominal}
                                    onChangeText={handleNominalChange}
                                    placeholder="0"
                                    keyboardType="numeric"
                                    className="flex-1 py-3 text-gray-900 text-lg"
                                />
                            </View>

                            {errors.nominal && (
                                <Text className="text-red-500 text-xs mt-1">
                                    {errors.nominal}
                                </Text>
                            )}
                        </View>

                        {/* Submit Button (FIXED) */}
                        <Button
                            onPress={handleSubmit}
                            disabled={loading}
                            className={`py-3 rounded-lg ${loading ? 'bg-gray-400' : 'bg-emerald-500'
                                }`}
                        >
                            <ButtonText className="text-white font-semibold text-center">
                                {loading ? 'Menyimpan...' : 'Simpan'}
                            </ButtonText>
                        </Button>

                    </Box>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
