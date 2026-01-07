import { Tabs } from 'expo-router';
import React from 'react';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { TimerReset, BanknoteIcon, ListCheck } from 'lucide-react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Cuaca & Waktu Sholat',
            tabBarIcon: ({ color }) => <TimerReset size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="Dashboard"
          options={{
            title: 'Catatan Keuangan',
            tabBarIcon: ({ color }) => <BanknoteIcon size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'To Do List',
            tabBarIcon: ({ color }) => <ListCheck size={28} color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}



