// components/withNavigation.tsx
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator()

export function withNavigation<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  screenName: string = 'Main'
) {
  // Buat komponen yang di-wrap
  const WrappedWithNavigation: React.FC<P> = (props) => {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name={screenName}>
            {() => <WrappedComponent {...props} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    )
  }

  // Beri nama yang lebih mudah untuk debugging
  WrappedWithNavigation.displayName = `withNavigation(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`

  return WrappedWithNavigation
}