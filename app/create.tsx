import { Button, ButtonText } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { ChevronDownIcon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";

export default function CreateCashflowScreen() {
  const toast = useToast();

  const [nominal, setNominal] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  // FIX DATE
  useEffect(() => {
    const d = new Date();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    setDate(`${d.getFullYear()}-${month}-${day}`);
  }, []);

  const saveCashflow = async () => {
    if (!nominal || !type || !date || !note) {
      toast.show({
        placement: "top",
        duration: 3000,
        render: () => (
          <Toast action="error" variant="solid">
            <ToastTitle>Gagal!</ToastTitle>
            <ToastDescription>Pastikan semua form diisi.</ToastDescription>
          </Toast>
        ),
      });
      return;
    }

    const jsonCashflows = await AsyncStorage.getItem("cashflows");
    const cashflows = jsonCashflows ? JSON.parse(jsonCashflows) : [];

    cashflows.push({
      nominal: parseInt(nominal),
      type,
      date,
      note,
    });

    await AsyncStorage.setItem("cashflows", JSON.stringify(cashflows));

    toast.show({
      placement: "top",
      duration: 3000,
      render: () => (
        <Toast action="success" variant="solid">
          <ToastTitle>Berhasil!</ToastTitle>
          <ToastDescription>Cashflow telah ditambahkan.</ToastDescription>
        </Toast>
      ),
    });

    router.back();
  };

  return (
    <View className="p-5">
      <View className="mt-6 bg-white p-5 rounded-2xl shadow">
        <VStack space="md">
          {/* NOMINAL */}
          <VStack space="xs">
            <Text>Nominal</Text>
            <Input>
              <InputField
                className="text-black placeholder:text-gray-500"
                keyboardType="numeric"
                placeholder="Nominal"
                value={nominal}
                onChangeText={(v) => setNominal(v.replace(/[^0-9]/g, ""))}
              />
            </Input>
          </VStack>

          {/* TIPE */}
          <VStack space="xs">
            <Text>Tipe</Text>

            <Select onValueChange={(val) => setType(val)}>
              <SelectTrigger
                className="bg-white border border-gray-300 rounded-lg"
                variant="outline"
                size="md"
              >
                <SelectInput
                  placeholder="Pilih Tipe"
                  className="text-black placeholder:text-gray-400"
                />
                <SelectIcon as={ChevronDownIcon} />
              </SelectTrigger>

              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>

                  <SelectItem label="Pemasukan" value="in" />
                  <SelectItem label="Pengeluaran" value="out" />
                </SelectContent>
              </SelectPortal>
            </Select>
          </VStack>

          {/* TANGGAL */}
          <VStack space="xs">
            <Text>Tanggal</Text>
            <Input isDisabled>
              <InputField className="text-black" value={date} readOnly />
            </Input>
          </VStack>

          {/* CATATAN */}
          <VStack space="xs">
            <Text>Catatan</Text>

            {/* catatan*/}
            <Textarea className="bg-white border border-gray-300">
              <TextareaInput
                style={{ color: "#000" }} // WAJIB, Gluestack override warna
                placeholder="Catatan"
                placeholderTextColor="#666"
                value={note}
                onChangeText={setNote}
              />
            </Textarea>
          </VStack>

          <Divider />

          {/* BUTTON */}
          <Button onPress={saveCashflow}>
            <ButtonText>Simpan</ButtonText>
          </Button>
        </VStack>
      </View>
    </View>
  );
}
