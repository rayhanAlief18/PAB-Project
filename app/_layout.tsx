import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { View, ActivityIndicator } from "react-native";
import { useColorScheme } from '@/hooks/use-color-scheme';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';

//font
import {
  useFonts,
  HankenGrotesk_400Regular,
  HankenGrotesk_400Regular_Italic,
  HankenGrotesk_700Bold,
  HankenGrotesk_700Bold_Italic,
  HankenGrotesk_500Medium,
  HankenGrotesk_800ExtraBold,
  HankenGrotesk_800ExtraBold_Italic,
  HankenGrotesk_500Medium_Italic,
  HankenGrotesk_900Black_Italic,
  HankenGrotesk_900Black,
  HankenGrotesk_300Light
} from "@expo-google-fonts/hanken-grotesk";

export const unstable_settings = {
  anchor: '(tabs)',
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
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GluestackUIProvider>

  );
}
