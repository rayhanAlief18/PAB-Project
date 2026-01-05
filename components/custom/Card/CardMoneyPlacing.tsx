import { Box } from '@/components/ui/box';
import { Divider } from '@/components/ui/divider';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import React from 'react';
import { ScrollView, Text, View, Pressable } from 'react-native';
import { CircleArrowRight, Wallet, Plus } from 'lucide-react-native';
import { useMoneyPlacing, MoneyPlacement } from '@/contexts/MoneyPlacingContext';
import { useCashflow } from '@/contexts/CashflowContext';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useRouter } from 'expo-router';

interface CardMoneyPlacingProps {
  customClass?: string;
}

export default function CardMoneyPlacing({ customClass }: CardMoneyPlacingProps) {
  const { placements } = useMoneyPlacing();
  const { cashflows } = useCashflow();
  const router = useRouter();

  // ===============================
  // UTILITIES
  // ===============================
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);

  const calculateCashflowCount = (placementId: string) =>
    cashflows?.filter(cf => cf.moneyPlacementId === placementId).length ?? 0;

  const formatShortDate = (date?: Date | string) => {
    if (!date) return '-';
    return format(new Date(date), 'dd/MM/yyyy', { locale: id });
  };

  // ===============================
  // CARD CLICK → ROUTE VALID
  // ===============================
  const handlePressCard = (item: MoneyPlacement) => {
    router.push({
      pathname: '/edit-money-placing/[id]',
      params: { id: item.id },
    });
  };

  // ===============================
  // EMPTY STATE (SAFE)
  // ===============================
  if (!placements || placements.length === 0) {
    return (
      <View className={`px-[30px] py-[25px] ${customClass ?? ''}`}>
        <Pressable
          onPress={() => router.push('/create-money-placing')}
          className="border-2 border-dashed border-[#2B8D47] rounded-[12px] py-[30px] items-center justify-center"
        >
          <Plus size={28} color="#2B8D47" />
          <Text
            className="mt-3 text-[#2B8D47] text-[16px]"
            style={{ fontFamily: 'HankenGrotesk_700Bold_Italic' }}
          >
            Tambah Money Placing
          </Text>
        </Pressable>
      </View>
    );
  }

  // ===============================
  // NORMAL STATE
  // ===============================
  return (
    <View className={`py-[25px] ${customClass ?? ''}`}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <HStack>
          {placements.map((item: MoneyPlacement) => (
            <Pressable
              key={item.id}
              onPress={() => handlePressCard(item)}
              style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
            >
              <Box className="ml-[30px] w-[334px] bg-white border-[2px] rounded-[8px] py-[18px] px-[24px]">
                <VStack>
                  <HStack className="items-center gap-2">
                    <Wallet color="#000000" />
                    <Text
                      className="text-[16px]"
                      style={{ fontFamily: 'HankenGrotesk_500Medium' }}
                    >
                      {item.name}
                    </Text>
                  </HStack>

                  <Text
                    className="text-[36px] mt-3"
                    style={{ fontFamily: 'HankenGrotesk_800ExtraBold_Italic' }}
                  >
                    {formatCurrency(item.nominal)}
                  </Text>
                </VStack>

                <Divider className="my-[8px] rounded-full bg-[#4B4B4B] h-[2px]" />

                <HStack className="justify-between items-center my-[5px]">
                  <Text
                    className="text-[14px]"
                    style={{ fontFamily: 'HankenGrotesk_700Bold_Italic' }}
                  >
                    Dibuat: {formatShortDate(item.createdAt)}
                  </Text>

                  <HStack className="items-center gap-3">
                    <Text
                      className="text-[13px] text-[#2B8D47]"
                      style={{ fontFamily: 'HankenGrotesk_700Bold_Italic' }}
                    >
                      {calculateCashflowCount(item.id)} transaksi
                    </Text>
                    <CircleArrowRight color="#2B8D47" size={20} />
                  </HStack>
                </HStack>
              </Box>
            </Pressable>
          ))}
        </HStack>
      </ScrollView>
    </View>
  );
}
