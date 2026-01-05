import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { router } from 'expo-router';
import { Banknote, NotebookPen, Wallet } from 'lucide-react-native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface MenuItem {
    label: string;
    icon: React.ComponentType<any>;
    route: string;
}

interface CustomClassType {
    customClass?: string;
}

const menuItems: MenuItem[] = [
    { label: 'Money Placing', icon: Wallet, route: '/(screen)/MoneyPlacing' },
    { label: 'CashFlow', icon: Banknote, route: '/(screen)/Cashflow' },
    { label: 'Debt', icon: NotebookPen, route: '/(screen)/Debt' },
];

export default function MenuMoneyTrack({ customClass }: CustomClassType) {
    return (
        <View className={customClass}>
            <VStack>
                <HStack className="justify-around mt-3">
                    {menuItems.map((item, index) => (
                        <Pressable
                            key={index}
                            onPress={() => router.push(item.route)}
                            className="active:opacity-70"
                        >
                            <VStack className="justify-center items-center gap-2 w-24">
                                <Box className="rounded-full border-2 w-16 h-16 bg-white justify-center items-center border-gray-700">
                                    <item.icon color="#4b4b4b" size={24} />
                                </Box>

                                <Text
                                    className="text-center"
                                    style={{ fontFamily: 'HankenGrotesk_400Regular_Italic' }}
                                >
                                    {item.label}
                                </Text>
                            </VStack>
                        </Pressable>
                    ))}
                </HStack>
            </VStack>
        </View>
    );
}
