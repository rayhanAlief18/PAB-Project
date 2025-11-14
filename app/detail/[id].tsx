import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { VStack } from "@/components/ui/vstack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
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
        <View style={{ paddingVertical: 20, paddingHorizontal: 20 }}>
            {/* TITLE */}
            {/* <Center>
                <Heading size="2xl" style={{ marginBottom: 20 }}>
                    Detail Cashflow
                </Heading>
            </Center> */}

            {/* CARD VIEW */}
            <View
                style={{
                    backgroundColor: "white",
                    padding: 20,
                    borderRadius: 16,
                    shadowColor: "#000",
                    shadowOpacity: 0.1,
                    shadowOffset: { width: 0, height: 2 },
                    shadowRadius: 6,
                    elevation: 4,
                }}
            >
                <VStack space="md">
                    {/* NOMINAL */}
                    <VStack space="xs">
                        <Text style={{ color: "#444" }}>Nominal</Text>
                        <Input isReadOnly>
                            <InputField
                                placeholder="Nominal"
                                value={
                                    "Rp" +
                                    cashflow?.nominal.toLocaleString("id-ID")
                                }
                            />
                        </Input>
                    </VStack>

                    {/* TYPE */}
                    <VStack space="xs">
                        <Text style={{ color: "#444" }}>Tipe</Text>
                        <Input isReadOnly>
                            <InputField value={cashflow?.type} />
                        </Input>
                    </VStack>

                    {/* DATE */}
                    <VStack space="xs">
                        <Text style={{ color: "#444" }}>Tanggal</Text>
                        <Input isReadOnly>
                            <InputField value={cashflow?.date} />
                        </Input>
                    </VStack>

                    {/* NOTE */}
                    <VStack space="xs">
                        <Text style={{ color: "#444" }}>Catatan</Text>
                        <Textarea isReadOnly>
                            <TextareaInput value={cashflow?.note} />
                        </Textarea>
                    </VStack>
                </VStack>
            </View>

            {/* BUTTON BACK */}
            {/* <Button
                style={{ marginTop: 30 }}
                onPress={() => router.back()}
            >
                <ButtonText>Kembali</ButtonText>
            </Button> */}
        </View>
    );
}
