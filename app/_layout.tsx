import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from "react-native";
import 'react-native-reanimated';
import { MoneyPlacingProvider } from '@/contexts/MoneyPlacingContext';
import { CashflowProvider } from '@/contexts/CashflowContext'; // Tambahkan ini
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { DebtProvider } from '@/contexts/DebtContext';
import { TaskProvider } from '@/contexts/TaskContext';
import '@/global.css';

//font
import {
  HankenGrotesk_300Light,
  HankenGrotesk_400Regular,
  HankenGrotesk_400Regular_Italic,
  HankenGrotesk_500Medium,
  HankenGrotesk_500Medium_Italic,
  HankenGrotesk_700Bold,
  HankenGrotesk_700Bold_Italic,
  HankenGrotesk_800ExtraBold,
  HankenGrotesk_800ExtraBold_Italic,
  HankenGrotesk_900Black,
  HankenGrotesk_900Black_Italic,
  useFonts
} from "@expo-google-fonts/hanken-grotesk";

export const unstable_settings = {
  anchor: '(tabs)',
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    HankenGrotesk_300Light,
    HankenGrotesk_400Regular,
    HankenGrotesk_400Regular_Italic,
    HankenGrotesk_500Medium,
    HankenGrotesk_500Medium_Italic,
    HankenGrotesk_700Bold,
    HankenGrotesk_700Bold_Italic,
    HankenGrotesk_800ExtraBold,
    HankenGrotesk_800ExtraBold_Italic,
    HankenGrotesk_900Black_Italic,
    HankenGrotesk_900Black,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <GluestackUIProvider mode="dark">
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <TaskProvider>
          <DebtProvider>
            <MoneyPlacingProvider>
              <CashflowProvider> {/* Tambahkan CashflowProvider di sini */}
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
                  <Stack.Screen name="Task" options={{ headerShown: false, presentation: 'card' }} />
                  <Stack.Screen name="create-task" options={{ headerShown: false, presentation: 'card' }} />
                  <Stack.Screen name="debts" options={{ headerShown: false, presentation: 'card' }} />
                  <Stack.Screen name="create-debt" options={{ headerShown: false, presentation: 'card' }} />
                  {/* Screen untuk Money Placing */}
                  <Stack.Screen name="MoneyPlacing" options={{ headerShown: false, presentation: 'card' }} />
                  <Stack.Screen name="create-money-placing" options={{ headerShown: false, presentation: 'card' }} />
                  <Stack.Screen name="edit-money-placing/[id]" options={{ headerShown: false, presentation: 'card' }} />
                  {/* Screen untuk Cashflow */}
                  <Stack.Screen name="Cashflow" options={{ headerShown: false, presentation: 'card' }} />
                  <Stack.Screen name="create-cashflow" options={{ headerShown: false, presentation: 'card' }} />
                  <Stack.Screen name="edit-cashflow/[id]" options={{ headerShown: false, presentation: 'card' }} />
                </Stack>
                <StatusBar style="auto" />
              </CashflowProvider> {/* Tutup CashflowProvider */}
            </MoneyPlacingProvider>
          </DebtProvider>
        </TaskProvider>
      </ThemeProvider>
    </GluestackUIProvider>
  );
}