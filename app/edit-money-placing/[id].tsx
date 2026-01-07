import HeaderPage from '@/components/custom/HeaderPage';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Text,
} from 'react-native';
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

export default function EditMoneyPlacing() {
  const params = useLocalSearchParams();
  const id = String(Array.isArray(params.id) ? params.id[0] : params.id);

  const router = useRouter();
  const { placements, updatePlacement, loading } = useMoneyPlacing();

  // ✅ FIX UTAMA: samakan tipe ID
  const placement = placements.find(p => String(p.id) === id);

  const [formData, setFormData] = useState({
    name: '',
    type: 'bank' as 'bank' | 'e-wallet',
    nominal: '',
  });

  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const [showEWalletDropdown, setShowEWalletDropdown] = useState(false);

  useEffect(() => {
    if (placement) {
      setFormData({
        name: placement.name,
        type: placement.type,
        nominal: placement.nominal.toString(),
      });
    }
  }, [placement]);

  if (!placement) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text>Data tidak ditemukan</Text>
      </View>
    );
  }

  const handleSave = async () => {
    await updatePlacement(placement.id, {
      name: formData.name,
      type: formData.type,
      nominal: Number(formData.nominal.replace(/\./g, '')),
    });
    router.back();
  };

  const formatCurrency = (value: string) => {
    const numeric = value.replace(/\./g, '');
    if (!numeric) return '';
    return new Intl.NumberFormat('id-ID').format(Number(numeric));
  };

  return (
    <View className="flex-1 bg-[#F2F2F4] mt-12">
      <Stack.Screen options={{ headerShown: false }} />

      <HeaderPage title="Edit Money Placing" />

      <ScrollView className="flex-1 px-4 pt-6">
        <Box className="bg-white rounded-xl p-5 mb-6">

          {/* PILIH JENIS */}
          <View className="flex-row space-x-4 mb-6">
            <TouchableOpacity
              onPress={() => {
                setFormData({ ...formData, type: 'bank' });
                setShowEWalletDropdown(false);
              }}
              className={`flex-1 py-3 rounded-lg border-2 ${
                formData.type === 'bank'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300'
              }`}
            >
              <Text className="text-center font-semibold">Bank</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setFormData({ ...formData, type: 'e-wallet' });
                setShowBankDropdown(false);
              }}
              className={`flex-1 py-3 rounded-lg border-2 ${
                formData.type === 'e-wallet'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300'
              }`}
            >
              <Text className="text-center font-semibold">e-Wallet</Text>
            </TouchableOpacity>
          </View>

          {/* DROPDOWN NAMA */}
          <Text className="text-sm mb-2">
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
            className="border-2 border-gray-300 rounded-lg p-3 flex-row justify-between items-center mb-2"
          >
            <Text>{formData.name || 'Pilih'}</Text>
            {showBankDropdown || showEWalletDropdown ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </TouchableOpacity>

          {showBankDropdown && (
            <View className="border rounded-lg max-h-56 mb-4">
              <ScrollView>
                {BANKS.map(bank => (
                  <TouchableOpacity
                    key={bank}
                    onPress={() => {
                      setFormData({ ...formData, name: bank, type: 'bank' });
                      setShowBankDropdown(false);
                    }}
                    className="p-3 border-b"
                  >
                    <Text>{bank}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {showEWalletDropdown && (
            <View className="border rounded-lg max-h-56 mb-4">
              <ScrollView>
                {E_WALLETS.map(wallet => (
                  <TouchableOpacity
                    key={wallet}
                    onPress={() => {
                      setFormData({ ...formData, name: wallet, type: 'e-wallet' });
                      setShowEWalletDropdown(false);
                    }}
                    className="p-3 border-b"
                  >
                    <Text>{wallet}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* NOMINAL */}
          <Text className="text-sm mb-2">Nominal</Text>
          <TextInput
            value={formData.nominal}
            onChangeText={(t) =>
              setFormData({ ...formData, nominal: formatCurrency(t) })
            }
            keyboardType="numeric"
            className="border-2 border-gray-300 rounded-lg px-3 py-3 mb-6"
          />

          {/* BUTTON */}
          <Button
            onPress={handleSave}
            disabled={loading}
            className={`
              px-5 py-2.5 rounded-full text-sm font-medium tracking-wide transition-colors
              ${loading 
                ? 'bg-gray-200 text-gray-500' 
                : 'bg-green-500 text-white hover:bg-green-600'}
            `}
          >
            <ButtonText className="text-white">
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </ButtonText>
          </Button>
        </Box>
      </ScrollView>
    </View>
  );
}
