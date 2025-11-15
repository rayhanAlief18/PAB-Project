import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { VStack } from "@/components/ui/vstack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";

export default function DetailCashflow() {
    const { id } = useLocalSearchParams();
    const [cashflow, setCashflow] = useState<any>();

    useEffect(() => {
        loadCashflow();
    }, [id]);

    const loadCashflow = async () => {
        const jsonCashflows = await AsyncStorage.getItem("cashflows");
        const cashflows = jsonCashflows ? JSON.parse(jsonCashflows) : [];
        setCashflow(cashflows[id as any]);
    };

    return (
        <View className="px-5 py-5">

            {/* TITLE */}
            <Center className="mb-4 mt-4">
                <Heading size="2xl" className="text-black">
                    Detail Cashflow
                </Heading>
            </Center>

            {/* CARD */}
            <View className="bg-white p-5 rounded-2xl border border-gray-200 mt-2">
                <VStack space="md">

                    {/* NOMINAL */}
                    <VStack space="xs">
                        <Text className="text-black">Nominal</Text>
                        <Input
                            isReadOnly
                            className="bg-white border border-gray-300 rounded-lg"
                        >
                            <InputField
                                className="text-black"
                                value={
                                    cashflow
                                        ? "Rp" + cashflow.nominal.toLocaleString("id-ID")
                                        : ""
                                }
                                readOnly
                            />
                        </Input>
                    </VStack>

                    {/* TYPE */}
                    <VStack space="xs">
                        <Text className="text-black">Tipe</Text>
                        <Input
                            isReadOnly
                            className="bg-white border border-gray-300 rounded-lg"
                        >
                            <InputField
                                className="text-black"
                                value={cashflow?.type ?? ""}
                                readOnly
                            />
                        </Input>
                    </VStack>

                    {/* DATE */}
                    <VStack space="xs">
                        <Text className="text-black">Tanggal</Text>
                        <Input
                            isReadOnly
                            className="bg-white border border-gray-300 rounded-lg"
                        >
                            <InputField
                                className="text-black"
                                value={cashflow?.date ?? ""}
                                readOnly
                            />
                        </Input>
                    </VStack>

                    {/* NOTE */}
                    <VStack space="xs">
                        <Text className="text-black">Catatan</Text>
                        <Textarea
                            isReadOnly
                            className="bg-white border border-gray-300 rounded-lg"
                        >
                            <TextareaInput
                                style={{ color: "#000" }} // HARUS
                                value={cashflow?.note ?? ""}
                                readOnly
                            />
                        </Textarea>
                    </VStack>

                </VStack>
            </View>
        </View>
    );
}
