import { Tabs } from 'expo-router';
import { Wallet, ArrowsLeftRight, Building, Gear } from 'phosphor-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000000',
          borderTopColor: '#333333',
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#666666',
      }}
    >

      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ size, color }) => (
            <Wallet size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Transaksi',
          tabBarIcon: ({ size, color }) => (
            <ArrowsLeftRight  size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="banks"
        options={{
          title: 'Bank & Wallet',
          tabBarIcon: ({ size, color }) => (
            <Building size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <Gear size={size} color={color} />
          ),
        }}
      />

    </Tabs>
  );
}
