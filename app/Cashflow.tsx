import { Button, ButtonText } from "@/components/ui/button";
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
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingVertical: 20,
        paddingHorizontal: 20,
        paddingBottom: 40,
      }}
    >
      {/* SALDO CARD */}
      <View
        style={{
          backgroundColor: "#000",
          padding: 20,
          borderRadius: 20,
          width: "100%",
          marginTop: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 16 }}>Total Saldo</Text>

          <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
            <Text style={{ color: "white", fontSize: 18 }}>
              {showBalance ? "👁️" : "👁️‍🗨️"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 12 }}>
          <Heading size="3xl" style={{ color: "white" }}>
            {showBalance ? `Rp${getBalances()}` : "●●●●●●●●●"}
          </Heading>
        </View>
      </View>

      {/* TOMBOL TAMBAH */}
      <Button
        variant="outline"
        style={{ marginTop: 30 }}
        onPress={() => router.push("/create")}
      >
        <ButtonText>Tambah</ButtonText>
      </Button>

      {/* LIST CARD */}
      <View style={{ marginTop: 30 }}>
        <Text style={{ fontSize: 18, fontWeight: "700" }}>Transaksi</Text>

        {cashflows.map((cashflow, index) => (
          <View
            key={index}
            style={{
              backgroundColor: "#000",
              paddingVertical: 14,
              paddingHorizontal: 16,
              borderRadius: 16,
              marginTop: 14,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* LEFT AREA (TITLE + DATE) */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: "white",
                  fontSize: 14,
                  fontWeight: "600",
                }}
              >
                {cashflow.title || "Transaksi"}
              </Text>

              <Text
                style={{
                  color: "#8f8f8f",
                  fontSize: 11,
                  marginTop: 2,
                }}
              >
                {cashflow.type === "in" ? "Pemasukan" : "Pengeluaran"}
                {" · "}
                {formatDate(cashflow.date)}
              </Text>
            </View>

            {/* RIGHT AREA (NOMINAL + BUTTONS) */}
            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={{
                  color: cashflow.type === "in" ? "lightgreen" : "red",
                  fontSize: 15,
                  fontWeight: "700",
                }}
              >
                {cashflow.type === "in" ? "+" : "-"} Rp
                {cashflow.nominal.toLocaleString("id-ID")}
              </Text>

              {/* Buttons compact */}
              <View
                style={{
                  flexDirection: "row",
                  gap: 6,
                  marginTop: 6,
                }}
              >
                {/* VIEW */}
                <TouchableOpacity
                  onPress={() => router.push(`/detail/${index}`)}
                  style={{
                    backgroundColor: "white",
                    paddingVertical: 4,
                    paddingHorizontal: 10,
                    borderRadius: 8,
                  }}
                >
                  <Text
                    style={{ fontWeight: "500", color: "black", fontSize: 12 }}
                  >
                    Detail
                  </Text>
                </TouchableOpacity>

                {/* DELETE */}
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
                  style={{
                    backgroundColor: "white",
                    paddingVertical: 4,
                    paddingHorizontal: 10,
                    borderRadius: 8,
                  }}
                >
                  <Text
                    style={{ fontWeight: "500", color: "black", fontSize: 12 }}
                  >
                    Hapus
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
