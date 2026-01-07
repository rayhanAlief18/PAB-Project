import HeaderPage from '@/components/custom/HeaderPage';
import { Box, Button, ButtonText } from '@/components/ui/gluestack-ui-components';
import { CATEGORIES, useCashflow } from '@/contexts/CashflowContext';
import { useMoneyPlacing } from '@/contexts/MoneyPlacingContext';
import { Stack, useRouter } from 'expo-router';
import { ChevronDown, ChevronUp, TrendingDown, TrendingUp } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateCashflow() {
    const router = useRouter();
    const { addCashflow, loading } = useCashflow();
    const { placements } = useMoneyPlacing();

    const [formData, setFormData] = useState({
        moneyPlacementId: '',
        category: '',
        condition: 'tambah' as 'tambah' | 'kurang',
        nominal: '',
        note: '',
    });

    const [showPlacementDropdown, setShowPlacementDropdown] = useState(false);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.moneyPlacementId) {
            newErrors.moneyPlacementId = 'Pilih Money Placement';
        }

        if (!formData.category) {
            newErrors.category = 'Pilih kategori';
        }

        if (!formData.nominal.trim()) {
            newErrors.nominal = 'Nominal harus diisi';
        } else if (isNaN(Number(formData.nominal.replace(/\./g, '')))) {
            newErrors.nominal = 'Nominal harus berupa angka';
        } else if (Number(formData.nominal.replace(/\./g, '')) <= 0) {
            newErrors.nominal = 'Nominal harus lebih dari 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            const nominalNumber = parseInt(formData.nominal.replace(/\./g, ''), 10);
            const selectedPlacement = placements.find(p => p.id === formData.moneyPlacementId);

            if (!selectedPlacement) {
                throw new Error('Money Placement tidak ditemukan');
            }

            // Validasi jika kondisi kurang, pastikan saldo cukup
            if (formData.condition === 'kurang' && nominalNumber > selectedPlacement.nominal) {
                setErrors(prev => ({
                    ...prev,
                    nominal: `Saldo tidak cukup. Saldo tersedia: Rp${selectedPlacement.nominal.toLocaleString('id-ID')}`
                }));
                return;
            }

            await addCashflow({
                moneyPlacementId: formData.moneyPlacementId,
                moneyPlacementName: selectedPlacement.name,
                category: formData.category,
                condition: formData.condition,
                nominal: nominalNumber,
                note: formData.note.trim() || undefined,
            });

            router.back();
        } catch (error: any) {
            console.error('Error creating cashflow:', error);
            setErrors(prev => ({ ...prev, submit: error.message }));
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

    const selectPlacement = (id: string) => {
        setFormData({ ...formData, moneyPlacementId: id });
        setShowPlacementDropdown(false);
        if (errors.moneyPlacementId) {
            setErrors({ ...errors, moneyPlacementId: '' });
        }
    };

    const selectCategory = (category: string) => {
        setFormData({ ...formData, category });
        setShowCategoryDropdown(false);
        if (errors.category) {
            setErrors({ ...errors, category: '' });
        }
    };

    const getSelectedPlacementName = () => {
        const placement = placements.find(p => p.id === formData.moneyPlacementId);
        return placement ? placement.name : 'Pilih Money Placement';
    };

    return (
        <View className="flex-1 bg-[#F2F2F4]">
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView className="flex-1">
                <HeaderPage
                    title="Tambah Transaksi"
                    showBackButton
                    onBackPress={() => router.back()}
                />

                <ScrollView className="flex-1 px-4 pt-6">
                    <Box className="bg-white rounded-xl p-5 mb-4">
                        {/* Kondisi (Tambah/Kurang) */}
                        <Text className="text-lg font-bold text-gray-900 mb-4">
                            Jenis Transaksi
                        </Text>

                        <View className="flex-row space-x-4 mb-8">
                            <TouchableOpacity
                                onPress={() => setFormData({ ...formData, condition: 'tambah' })}
                                className={`flex-1 py-4 rounded-xl border-2 flex-row items-center justify-center space-x-2 ${formData.condition === 'tambah' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300'
                                    }`}
                            >
                                <TrendingUp size={20} color={formData.condition === 'tambah' ? '#10B981' : '#6B7280'} />
                                <Text className={`font-semibold ${formData.condition === 'tambah' ? 'text-emerald-600' : 'text-gray-600'}`}>
                                    Pemasukan
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setFormData({ ...formData, condition: 'kurang' })}
                                className={`flex-1 py-4 rounded-xl border-2 flex-row items-center justify-center space-x-2 ${formData.condition === 'kurang' ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                    }`}
                            >
                                <TrendingDown size={20} color={formData.condition === 'kurang' ? '#EF4444' : '#6B7280'} />
                                <Text className={`font-semibold ${formData.condition === 'kurang' ? 'text-red-600' : 'text-gray-600'}`}>
                                    Pengeluaran
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Dropdown Money Placement */}
                        <View className="mb-6">
                            <Text className="text-sm font-medium text-gray-700 mb-2">
                                Dari/Ke Money Placement
                            </Text>

                            <TouchableOpacity
                                onPress={() => {
                                    setShowPlacementDropdown(!showPlacementDropdown);
                                    setShowCategoryDropdown(false);
                                }}
                                className={`border-2 rounded-lg p-3 flex-row justify-between items-center ${errors.moneyPlacementId ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            >
                                <Text className={`${formData.moneyPlacementId ? 'text-gray-900' : 'text-gray-500'}`}>
                                    {getSelectedPlacementName()}
                                </Text>
                                {showPlacementDropdown ? (
                                    <ChevronUp size={20} color="#6B7280" />
                                ) : (
                                    <ChevronDown size={20} color="#6B7280" />
                                )}
                            </TouchableOpacity>

                            {errors.moneyPlacementId && (
                                <Text className="text-red-500 text-xs mt-1">{errors.moneyPlacementId}</Text>
                            )}

                            {/* Dropdown Money Placement */}
                            {showPlacementDropdown && (
                                <View className="mt-2 border border-gray-300 rounded-lg bg-white max-h-60">
                                    <ScrollView>
                                        {placements.length === 0 ? (
                                            <View className="p-4 items-center">
                                                <Text className="text-gray-500">Belum ada Money Placement</Text>
                                                <TouchableOpacity
                                                    onPress={() => router.push('/create-money-placing')}
                                                    className="mt-2 bg-blue-500 px-4 py-2 rounded-lg"
                                                >
                                                    <Text className="text-white font-semibold">
                                                        Buat Money Placement
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        ) : (
                                            placements.map((placement, index) => (
                                                <TouchableOpacity
                                                    key={placement.id}
                                                    onPress={() => selectPlacement(placement.id)}
                                                    className={`p-3 ${index !== placements.length - 1 ? 'border-b border-gray-200' : ''}`}
                                                >
                                                    <View className="flex-row justify-between items-center">
                                                        <View>
                                                            <Text className="text-gray-900 font-medium">{placement.name}</Text>
                                                            <Text className="text-xs text-gray-500">
                                                                {placement.type === 'bank' ? 'Bank' : 'e-Wallet'}
                                                            </Text>
                                                        </View>
                                                        <Text className="text-emerald-600 font-semibold">
                                                            Rp{placement.nominal.toLocaleString('id-ID')}
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                            ))
                                        )}
                                    </ScrollView>
                                </View>
                            )}
                        </View>

                        {/* Dropdown Kategori */}
                        <View className="mb-6">
                            <Text className="text-sm font-medium text-gray-700 mb-2">
                                Kategori
                            </Text>

                            <TouchableOpacity
                                onPress={() => {
                                    setShowCategoryDropdown(!showCategoryDropdown);
                                    setShowPlacementDropdown(false);
                                }}
                                className={`border-2 rounded-lg p-3 flex-row justify-between items-center ${errors.category ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            >
                                <Text className={`${formData.category ? 'text-gray-900' : 'text-gray-500'}`}>
                                    {formData.category || 'Pilih Kategori'}
                                </Text>
                                {showCategoryDropdown ? (
                                    <ChevronUp size={20} color="#6B7280" />
                                ) : (
                                    <ChevronDown size={20} color="#6B7280" />
                                )}
                            </TouchableOpacity>

                            {errors.category && (
                                <Text className="text-red-500 text-xs mt-1">{errors.category}</Text>
                            )}

                            {/* Dropdown Kategori */}
                            {showCategoryDropdown && (
                                <View className="mt-2 border border-gray-300 rounded-lg bg-white max-h-60">
                                    <ScrollView>
                                        {CATEGORIES.map((category, index) => (
                                            <TouchableOpacity
                                                key={category}
                                                onPress={() => selectCategory(category)}
                                                className={`p-3 ${index !== CATEGORIES.length - 1 ? 'border-b border-gray-200' : ''}`}
                                            >
                                                <Text className="text-gray-900">{category}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            )}
                        </View>

                        {/* Input Nominal */}
                        <View className="mb-6">
                            <Text className="text-sm font-medium text-gray-700 mb-2">
                                Nominal (Rp)
                            </Text>
                            <View className={`flex-row items-center border-2 rounded-lg px-3 ${errors.nominal ? 'border-red-500' : 'border-gray-300'
                                }`}>
                                <Text className="text-gray-500 mr-2">Rp</Text>
                                <TextInput
                                    value={formData.nominal}
                                    onChangeText={handleNominalChange}
                                    placeholder="0"
                                    className="flex-1 py-3 text-gray-900 text-lg"
                                    keyboardType="numeric"
                                />
                            </View>
                            {errors.nominal && (
                                <Text className="text-red-500 text-xs mt-1">{errors.nominal}</Text>
                            )}
                        </View>

                        {/* Input Catatan */}
                        <View className="mb-8">
                            <Text className="text-sm font-medium text-gray-700 mb-2">
                                Catatan (Opsional)
                            </Text>
                            <TextInput
                                value={formData.note}
                                onChangeText={(text) => setFormData({ ...formData, note: text })}
                                placeholder="Tambahkan catatan..."
                                multiline
                                numberOfLines={3}
                                className="border-2 border-gray-300 rounded-lg p-3 text-gray-900"
                                style={{ textAlignVertical: 'top' }}
                            />
                        </View>

                        {/* Info Tanggal Otomatis */}
                        <View className="bg-gray-50 p-4 rounded-lg mb-6">
                            <Text className="text-sm text-gray-600">
                                Tanggal transaksi akan diisi otomatis dengan waktu sekarang
                            </Text>
                        </View>

                        {/* Error Submit */}
                        {errors.submit && (
                            <View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                                <Text className="text-red-600 text-sm">{errors.submit}</Text>
                            </View>
                        )}

                        {/* Button Submit */}
                        <Button
                            onPress={handleSubmit}
                            disabled={loading}
                            className={`
                                px-5 py-2.5 rounded-full text-sm font-medium tracking-wide text-white transition-colors
                                ${loading
                                    ? 'bg-gray-200 text-gray-500'
                                    : 'bg-blue-500 text-white hover:bg-blue-600'}
                              `}
                        >
                            <ButtonText>
                                {loading ? 'Menyimpan...' : 'Simpan Transaksi'}
                            </ButtonText>
                        </Button>
                    </Box>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}