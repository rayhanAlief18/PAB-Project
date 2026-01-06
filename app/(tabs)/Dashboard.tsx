import Header from "@/components/custom/HeaderPage";
import CardMoneyPlacing from "@/components/custom/Card/CardMoneyPlacing";
import MenuMoneyTrack from "@/components/custom/Menu/MenuMoneyTrack";
import RecentlyCashflow from "@/components/custom/RecentlyCashflow/RecentlyCashflow";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabTwoScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <Header name="Daeng Sikki" customClass="px-[30px]" />

      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <CardMoneyPlacing />
        <MenuMoneyTrack customClass="px-[30px]" />
        <RecentlyCashflow customClass="px-[30px]" />
      </ScrollView>
    </SafeAreaView>
  );
}
