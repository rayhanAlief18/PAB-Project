import { useNavigation } from 'expo-router'
import { ChevronLeft, UserRoundPen } from 'lucide-react-native'
import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { Box } from '../ui/box'
import { HStack } from '../ui/hstack'

interface HeaderPropsType {
  title: string
  showBackButton?: boolean
  onBackPress?: () => void
}

export default function HeaderPage({
  title,
  showBackButton = true,
  onBackPress,
}: HeaderPropsType) {
  const navigation = useNavigation()

  const handleBack = () => {
    if (onBackPress) {
      onBackPress()
    } else {
      navigation.goBack()
    }
  }

  return (
    <View className="mt-[30px] px-[30px]">
      <Box>
        <HStack className="items-center justify-between">
          
          {showBackButton ? (
            <Pressable onPress={handleBack}>
              <HStack className="items-center">
                <ChevronLeft color="#4B4B4B" />
                <Text
                  className="text-lg text-[#4b4b4b]"
                  style={{ fontFamily: 'HankenGrotesk_300Light' }}
                >
                  Back
                </Text>
              </HStack>
            </Pressable>
          ) : (
            <View className="w-[60px]" />
          )}

          <Text
            className="pr-[40px] text-lg mb-[-4px]"
            style={{ fontFamily: 'HankenGrotesk_400Regular' }}
          >
            {title}
          </Text>

          {/* ✅ ICON WAJIB DIBUNGKUS */}
          <View>
            <UserRoundPen color="#4B4B4B" />
          </View>

        </HStack>
      </Box>
    </View>
  )
}
