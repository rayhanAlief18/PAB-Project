import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

export default function Index() {
  const [cashflows, setCashflows] = useState<any[]>([]);
  const [showBalance, setShowBalance] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadCashflows();
      return () => {};
    }, [])
  );

  const loadCashflows = async () => {
    const jsonCashflows = await AsyncStorage.getItem("cashflows");
    setCashflows(jsonCashflows ? JSON.parse(jsonCashflows) : []);
  };

  const getBalances = () => {
    return cashflows
      .reduce((prev, curr) => {
        if (curr.type === "in") prev += curr.nominal;
        else prev -= curr.nominal;
        return prev;
      }, 0)
      .toLocaleString("id-ID");
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <ScrollView
      className="flex-1 bg-white"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingVertical: 20,
        paddingHorizontal: 20,
        paddingBottom: 40,
      }}
    >
{/* SALDO CARD diberi relative untuk button absolute */}
      <View className="bg-black p-5 rounded-2xl w-full mt-2.5 relative">
        <View className="flex-row justify-between items-center">
          <Text className="text-white text-base">Total Saldo</Text>
          <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
            <Text className="text-white text-xl">
              {showBalance ? "👁️" : "👁️‍🗨️"}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mt-3">
          <Heading size="3xl" className="text-white font-bold">
            {showBalance ? `Rp${getBalances()}` : "●●●●●●●●●"}
          </Heading>
        </View>

        {/* KONTENER UNTUK MEMBUAT TOMBOL KE TENGAH
          - 'absolute' 'bottom-5' : Posisi di bawah.
          - 'left-0' 'right-0' : Membentang selebar parent.
          - 'items-center'     : Membuat anak (tombol) jadi ke tengah.
        */}
        <View className="absolute bottom-0 left-5 right-0 items-center">
          
          {/* BUTTON TAMBAH (+)
            - Class 'absolute', 'left-5', 'right-5', 'bottom-5' dihapus 
              karena posisinya sudah diatur oleh View di atas.
          */}
          <TouchableOpacity
            onPress={() => router.push("/create")}
            className="bg-white rounded-full w-6 h-10 items-center justify-center shadow-lg"
          >
            <Text className="text-black text-4xl font-bold pb-1">+</Text>
          </TouchableOpacity>

        </View>
        
        
      </View>

      {/* TITLE */}
      <Text className="text-2xl font-bold mt-8 mb-4 text-gray-300 text-center">
        Transaksi
      </Text>

      {/* LIST CARD */}
      <View className="w-full">
        {cashflows.map((cashflow, index) => (
          <View
            key={index}
            className={`bg-black p-5 rounded-2xl w-full ${
              index !== 0 ? "mt-6" : ""
            }`}
          >
            <View className="flex-row justify-between items-center">
              {/* LEFT AREA */}
              <View className="flex-1">
                <Text className="text-white text-base font-bold">
                  {cashflow.title || "Transaksi"}
                </Text>
                <Text className="text-gray-300 text-xs mt-2">
                  {cashflow.type === "in" ? "Pemasukan" : "Pengeluaran"}
                  {" · "}
                  {formatDate(cashflow.date)}
                </Text>
              </View>
              {/* RIGHT AREA */}
              <View className="items-end ml-4">
                <Text
                  className={`font-bold text-base mb-3 ${
                    cashflow.type === "in" ? "text-green-400" : "text-red-500"
                  }`}
                >
                  {cashflow.type === "in" ? "+ " : "- "}Rp
                  {cashflow.nominal.toLocaleString("id-ID")}
                </Text>
                <View className="flex-row space-x-3">
                  <TouchableOpacity
                    onPress={() => router.push(`/detail/${index}`)}
                    className="bg-white py-1 px-4 rounded"
                  >
                    <Text className="text-black text-xs font-semibold">
                      Detail
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setCashflows((prev) => {
                        const updated = prev.filter((c, i) => i !== index);
                        AsyncStorage.setItem(
                          "cashflows",
                          JSON.stringify(updated)
                        );
                        return updated;
                      });
                    }}
                    className="bg-white py-1 px-4 rounded"
                  >
                    <Text className="text-black text-xs font-semibold">
                      Hapus
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
