import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { Box, VStack, Text, HStack } from '@gluestack-ui/themed';
import { useMoney } from '@/hooks/useMoney';
import { User, Gear, Circle as HelpCircle, Shield, Bell, SignOut } from 'phosphor-react-native';

export default function ProfileScreen() {
  const { banks, transactions, totalBalance } = useMoney();

  const totalBanks = banks.length;
  const totalTransactions = transactions.length;
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const menuItems = [
    { icon: Gear, title: 'Pengaturan Akun', description: 'Kelola profil dan preferensi' },
    { icon: Bell, title: 'Notifikasi', description: 'Atur pemberitahuan transaksi' },
    { icon: Shield, title: 'Keamanan', description: 'PIN, biometrik, dan backup' },
    { icon: HelpCircle, title: 'Bantuan & Support', description: 'FAQ dan hubungi support' },
    { icon: SignOut, title: 'Keluar', description: 'Logout dari aplikasi' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000000', paddingTop: 20 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Box flex={1} bg="$black" p="$4">
          <VStack space="lg">
            {/* Header */}
            <VStack space="sm">
              <Text color="$white" size="xl" fontWeight="$bold">
                Profile
              </Text>
              <Text color="$gray400" size="sm">
                Pengaturan dan informasi akun
              </Text>
            </VStack>

            {/* User Info */}
            <Box
              bg="$gray900"
              p="$4"
              borderRadius="$lg"
              borderWidth={1}
              borderColor="$gray800"
            >
              <HStack space="md" alignItems="center">
                <Box
                  bg="$gray700"
                  p="$4"
                  borderRadius="$full"
                >
                  <User size={32} color="#FFFFFF" />
                </Box>
                <VStack space="xs" flex={1}>
                  <Text color="$white" size="lg" fontWeight="$bold">
                    John Doe
                  </Text>
                  <Text color="$gray400" size="sm">
                    john.doe@email.com
                  </Text>
                </VStack>
              </HStack>
            </Box>

            {/* Stats */}
            <VStack space="md">
              <Text color="$white" size="lg" fontWeight="$semibold">
                Ringkasan Akun
              </Text>
              
              <HStack space="md">
                <Box
                  flex={1}
                  bg="$gray900"
                  p="$4"
                  borderRadius="$lg"
                  borderWidth={1}
                  borderColor="$gray800"
                >
                  <VStack space="xs">
                    <Text color="$blue400" size="sm">
                      Total Saldo
                    </Text>
                    <Text color="$white" size="md" fontWeight="$bold">
                      {formatCurrency(totalBalance)}
                    </Text>
                  </VStack>
                </Box>
                
                <Box
                  flex={1}
                  bg="$gray900"
                  p="$4"
                  borderRadius="$lg"
                  borderWidth={1}
                  borderColor="$gray800"
                >
                  <VStack space="xs">
                    <Text color="$purple400" size="sm">
                      Platform
                    </Text>
                    <Text color="$white" size="md" fontWeight="$bold">
                      {totalBanks}
                    </Text>
                  </VStack>
                </Box>
              </HStack>

              <Box
                bg="$gray900"
                p="$4"
                borderRadius="$lg"
                borderWidth={1}
                borderColor="$gray800"
              >
                <VStack space="xs">
                  <Text color="$green400" size="sm">
                    Total Transaksi
                  </Text>
                  <Text color="$white" size="md" fontWeight="$bold">
                    {totalTransactions} transaksi
                  </Text>
                </VStack>
              </Box>
            </VStack>

            {/* Menu Items */}
            <VStack space="md">
              <Text color="$white" size="lg" fontWeight="$semibold">
                Menu
              </Text>
              
              {menuItems.map((item, index) => (
                <Box
                  key={index}
                  bg="$gray900"
                  p="$4"
                  borderRadius="$lg"
                  borderWidth={1}
                  borderColor="$gray800"
                >
                  <HStack space="md" alignItems="center">
                    <Box
                      bg="$gray700"
                      p="$2"
                      borderRadius="$lg"
                    >
                      <item.icon size={20} color="#FFFFFF" />
                    </Box>
                    <VStack space="xs" flex={1}>
                      <Text color="$white" size="sm" fontWeight="$medium">
                        {item.title}
                      </Text>
                      <Text color="$gray400" size="xs">
                        {item.description}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
              ))}
            </VStack>

            {/* App Version */}
            <Box alignItems="center" mt="$4">
              <Text color="$gray500" size="xs">
                Money Placement App v1.0.0
              </Text>
            </Box>
          </VStack>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}