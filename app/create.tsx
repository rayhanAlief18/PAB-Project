import { Button, ButtonText } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
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
import { Toast, ToastDescription, ToastTitle, useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View, TouchableOpacity } from "react-native";

export default function CreateCashflowScreen() {
    const toast = useToast();

    const [nominal, setNominal] = useState("");
    const [type, setType] = useState("");
    const [date, setDate] = useState("");
    const [note, setNote] = useState("");

    // FIX FORMAT DATE: YYYY-MM-DD
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
        <View style={{ padding: 20 }}>
            {/* <Heading size="2xl" style={{ textAlign: "center" }}>
                Tambah Cashflow
            </Heading> */}

            {/* CARD VIEW */}
            <View
                style={{
                    marginTop: 25,
                    backgroundColor: "#fff",
                    padding: 20,
                    borderRadius: 16,
                    elevation: 3,
                    shadowColor: "#000",
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                }}
            >
                <VStack space="md">

                    {/* NOMINAL */}
                    <VStack space="xs">
                        <Text>Nominal</Text>
                        <Input>
                            <InputField
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
                            <SelectTrigger variant="outline" size="md">
                                <SelectInput placeholder="Pilih Tipe" />
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
                            <InputField value={date} readOnly />
                        </Input>
                    </VStack>

                    {/* CATATAN */}
                    <VStack space="xs">
                        <Text>Catatan</Text>
                        <Textarea>
                            <TextareaInput
                                placeholder="Catatan"
                                value={note}
                                onChangeText={setNote}
                            />
                        </Textarea>
                    </VStack>

                    <Divider />

                    {/* BUTTON SIMPAN */}
                    <Button onPress={saveCashflow}>
                        <ButtonText>Simpan</ButtonText>
                    </Button>

                </VStack>
            </View>
        </View>
    );
}
