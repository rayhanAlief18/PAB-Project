import HeaderPage from '@/components/custom/HeaderPage';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Text,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown } from 'lucide-react-native';
import { useCashflow, CATEGORIES } from '@/contexts/CashflowContext';
import { useMoneyPlacing } from '@/contexts/MoneyPlacingContext';
import { Box } from '@/components/ui/gluestack-ui-components';

export default function EditCashflow() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();

  /** ✅ Pastikan id selalu string */
  const cashflowId = useMemo(() => {
    if (!params.id) return '';
    return Array.isArray(params.id) ? params.id[0] : params.id;
  }, [params.id]);

  const { cashflows, updateCashflow, loading } = useCashflow();
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

  /** ===============================
   *  Load data awal
   *  =============================== */
  useEffect(() => {
    if (!cashflowId || cashflows.length === 0) return;

    const cashflow = cashflows.find(c => c.id === cashflowId);
    if (!cashflow) return;

    setFormData({
      moneyPlacementId: cashflow.moneyPlacementId,
      category: cashflow.category,
      condition: cashflow.condition,
      nominal: cashflow.nominal.toString(),
      note: cashflow.note ?? '',
    });
  }, [cashflowId, cashflows]);

  /** ===============================
   *  Validation
   *  =============================== */
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.moneyPlacementId) {
      newErrors.moneyPlacementId = 'Pilih Money Placement';
    }

    if (!formData.category) {
      newErrors.category = 'Pilih kategori';
    }

    const numericNominal = Number(formData.nominal.replace(/\./g, ''));
    if (!formData.nominal.trim()) {
      newErrors.nominal = 'Nominal harus diisi';
    } else if (isNaN(numericNominal)) {
      newErrors.nominal = 'Nominal harus berupa angka';
    } else if (numericNominal <= 0) {
      newErrors.nominal = 'Nominal harus lebih dari 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /** ===============================
   *  Submit
   *  =============================== */
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const nominalNumber = parseInt(formData.nominal.replace(/\./g, ''), 10);
      const selectedPlacement = placements.find(
        p => p.id === formData.moneyPlacementId
      );

      if (!selectedPlacement) {
        throw new Error('Money Placement tidak ditemukan');
      }

      const oldCashflow = cashflows.find(c => c.id === cashflowId);
      let availableBalance = selectedPlacement.nominal;

      if (oldCashflow && oldCashflow.condition === 'kurang') {
        availableBalance += oldCashflow.nominal;
      }

      if (formData.condition === 'kurang' && nominalNumber > availableBalance) {
        setErrors(prev => ({
          ...prev,
          nominal: `Saldo tidak cukup. Saldo tersedia: Rp${availableBalance.toLocaleString(
            'id-ID'
          )}`,
        }));
        return;
      }

      await updateCashflow(cashflowId, {
        moneyPlacementId: formData.moneyPlacementId,
        moneyPlacementName: selectedPlacement.name,
        category: formData.category,
        condition: formData.condition,
        nominal: nominalNumber,
        note: formData.note.trim() || undefined,
      });

      router.back();
    } catch (err: any) {
      console.error(err);
      setErrors(prev => ({
        ...prev,
        submit: err?.message || 'Terjadi kesalahan',
      }));
    }
  };

  /** ===============================
   *  Helpers
   *  =============================== */
  const formatCurrency = (value: string) => {
    const numeric = value.replace(/\./g, '');
    if (!numeric) return '';
    return new Intl.NumberFormat('id-ID').format(Number(numeric));
  };

  const handleNominalChange = (text: string) => {
    setFormData(prev => ({
      ...prev,
      nominal: formatCurrency(text),
    }));
    if (errors.nominal) setErrors(prev => ({ ...prev, nominal: '' }));
  };

  const selectPlacement = (id: string) => {
    setFormData(prev => ({ ...prev, moneyPlacementId: id }));
    setShowPlacementDropdown(false);
    if (errors.moneyPlacementId)
      setErrors(prev => ({ ...prev, moneyPlacementId: '' }));
  };

  const selectCategory = (category: string) => {
    setFormData(prev => ({ ...prev, category }));
    setShowCategoryDropdown(false);
    if (errors.category) setErrors(prev => ({ ...prev, category: '' }));
  };

  const selectedPlacementName =
    placements.find(p => p.id === formData.moneyPlacementId)?.name ??
    'Pilih Money Placement';

  /** ===============================
   *  UI
   *  =============================== */
  return (
    <View className="flex-1 bg-[#F2F2F4]">
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView className="flex-1">
        <HeaderPage
          title="Edit Transaksi"
          showBackButton
          onBackPress={() => router.back()}
        />

        <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false}>
          <Box className="bg-white rounded-xl p-5 mb-4">

            {/* JENIS TRANSAKSI */}
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Jenis Transaksi
            </Text>

            <View className="flex-row space-x-4 mb-8">
              <TouchableOpacity
                onPress={() => setFormData({ ...formData, condition: 'tambah' })}
                className={`flex-1 py-4 rounded-xl border-2 flex-row items-center justify-center space-x-2 ${
                  formData.condition === 'tambah'
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-300'
                }`}
              >
                <TrendingUp
                  size={20}
                  color={formData.condition === 'tambah' ? '#10B981' : '#6B7280'}
                />
                <Text
                  className={`font-semibold ${
                    formData.condition === 'tambah'
                      ? 'text-emerald-600'
                      : 'text-gray-600'
                  }`}
                >
                  Pemasukan
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setFormData({ ...formData, condition: 'kurang' })}
                className={`flex-1 py-4 rounded-xl border-2 flex-row items-center justify-center space-x-2 ${
                  formData.condition === 'kurang'
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300'
                }`}
              >
                <TrendingDown
                  size={20}
                  color={formData.condition === 'kurang' ? '#EF4444' : '#6B7280'}
                />
                <Text
                  className={`font-semibold ${
                    formData.condition === 'kurang'
                      ? 'text-red-600'
                      : 'text-gray-600'
                  }`}
                >
                  Pengeluaran
                </Text>
              </TouchableOpacity>
            </View>

            {/* MONEY PLACEMENT */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Dari/Ke Money Placement
              </Text>

              <TouchableOpacity
                onPress={() => {
                  setShowPlacementDropdown(!showPlacementDropdown);
                  setShowCategoryDropdown(false);
                }}
                className={`border-2 rounded-lg p-3 flex-row justify-between items-center ${
                  errors.moneyPlacementId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <Text
                  className={
                    formData.moneyPlacementId ? 'text-gray-900' : 'text-gray-500'
                  }
                >
                  {selectedPlacementName}
                </Text>
                {showPlacementDropdown ? (
                  <ChevronUp size={20} color="#6B7280" />
                ) : (
                  <ChevronDown size={20} color="#6B7280" />
                )}
              </TouchableOpacity>

              {errors.moneyPlacementId && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.moneyPlacementId}
                </Text>
              )}

              {showPlacementDropdown && (
                <View className="mt-2 border border-gray-300 rounded-lg bg-white max-h-60">
                  <ScrollView>
                    {placements.map((p, i) => (
                      <TouchableOpacity
                        key={p.id}
                        onPress={() => selectPlacement(p.id)}
                        className={`p-3 ${
                          i !== placements.length - 1
                            ? 'border-b border-gray-200'
                            : ''
                        }`}
                      >
                        <View className="flex-row justify-between">
                          <View>
                            <Text className="font-medium">{p.name}</Text>
                            <Text className="text-xs text-gray-500">
                              {p.type === 'bank' ? 'Bank' : 'e-Wallet'}
                            </Text>
                          </View>
                          <Text className="font-semibold text-emerald-600">
                            Rp{p.nominal.toLocaleString('id-ID')}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* KATEGORI */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Kategori
              </Text>

              <TouchableOpacity
                onPress={() => {
                  setShowCategoryDropdown(!showCategoryDropdown);
                  setShowPlacementDropdown(false);
                }}
                className={`border-2 rounded-lg p-3 flex-row justify-between items-center ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <Text
                  className={formData.category ? 'text-gray-900' : 'text-gray-500'}
                >
                  {formData.category || 'Pilih Kategori'}
                </Text>
                {showCategoryDropdown ? (
                  <ChevronUp size={20} color="#6B7280" />
                ) : (
                  <ChevronDown size={20} color="#6B7280" />
                )}
              </TouchableOpacity>

              {errors.category && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.category}
                </Text>
              )}

              {showCategoryDropdown && (
                <View className="mt-2 border border-gray-300 rounded-lg bg-white max-h-60">
                  <ScrollView>
                    {CATEGORIES.map((c, i) => (
                      <TouchableOpacity
                        key={c}
                        onPress={() => selectCategory(c)}
                        className={`p-3 ${
                          i !== CATEGORIES.length - 1
                            ? 'border-b border-gray-200'
                            : ''
                        }`}
                      >
                        <Text>{c}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* NOMINAL */}
            <View className="mb-6">
              <Text className="text-sm font-medium mb-2">Nominal (Rp)</Text>
              <View
                className={`flex-row items-center border-2 rounded-lg px-3 ${
                  errors.nominal ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <Text className="text-gray-500 mr-2">Rp</Text>
                <TextInput
                  value={formData.nominal}
                  onChangeText={handleNominalChange}
                  keyboardType="numeric"
                  className="flex-1 py-3 text-lg"
                  editable={!loading}
                />
              </View>
              {errors.nominal && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.nominal}
                </Text>
              )}
            </View>

            {/* CATATAN */}
            <View className="mb-8">
              <Text className="text-sm font-medium mb-2">Catatan (Opsional)</Text>
              <TextInput
                value={formData.note}
                onChangeText={text =>
                  setFormData(prev => ({ ...prev, note: text }))
                }
                multiline
                numberOfLines={3}
                className="border-2 border-gray-300 rounded-lg p-3"
                style={{ textAlignVertical: 'top' }}
                editable={!loading}
              />
            </View>

            {errors.submit && (
              <Text className="text-red-600 mb-3 text-sm">{errors.submit}</Text>
            )}

            {/* BUTTON */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              className={`py-4 rounded-lg ${
                loading ? 'bg-gray-400' : 'bg-blue-500'
              }`}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-center font-semibold">
                  Update Transaksi
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.back()}
              disabled={loading}
              className="mt-3 py-3 border rounded-lg"
            >
              <Text className="text-center">Batal</Text>
            </TouchableOpacity>
          </Box>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
