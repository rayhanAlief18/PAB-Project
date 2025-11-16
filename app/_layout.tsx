import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from "react-native";
import 'react-native-reanimated';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { DebtProvider } from '@/contexts/DebtContext';
import { TaskProvider } from '@/contexts/TaskContext';
import '@/global.css';

//font
import {
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
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
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
  })

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    )
  }

  return (

    <GluestackUIProvider mode="dark">
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <TaskProvider>
          <DebtProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
              <Stack.Screen name="tasks" options={{ headerShown: false, presentation: 'card' }} />
              <Stack.Screen name="create-task" options={{ headerShown: false, presentation: 'card' }} />
              <Stack.Screen name="debts" options={{ headerShown: false, presentation: 'card' }} />
              <Stack.Screen name="create-debt" options={{ headerShown: false, presentation: 'card' }} />
            </Stack>
            <StatusBar style="auto" />
          </DebtProvider>
        </TaskProvider>
      </ThemeProvider>
    </GluestackUIProvider>

  );
}
