import HeaderPage from "@/components/custom/HeaderPage";
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { router, Stack } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { Alert, Platform, Pressable, ScrollView, View } from "react-native";
import { db } from "../../../config/Firebase";



export default function CreateDebt() {
    /**
     * States
     *
     */
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [dateDebt, setDateDebt] = useState(new Date());
    const [dateDebtPaymentPlan, setDateDebtPaymentPlan] = useState(new Date());
    const [description, setDescription] = useState("");

    const [showDateDebtModal, setShowDateDebtModal] = useState(false);
    const [showDateDebtPaymentPlanModal, setShowDateDebtPaymentPlanModal] = useState(false);

    /**
     * Methods
     *
     */
    const onChangeDateDebt = (_: any, selectedDate?: Date) => {
        setShowDateDebtModal(false);
        if (selectedDate) setDateDebt(selectedDate);
    };

    const onChangeDateDebtPaymentPlan = (_: any, selectedDate?: Date) => {
        setShowDateDebtPaymentPlanModal(false);
        if (selectedDate) setDateDebtPaymentPlan(selectedDate);
    };

    const doSubmit = async () => {
    try {
        // ===== VALIDATION =====
        if (!name || !amount || !description) {
            Alert.alert("Validation Error", "Semua field wajib diisi");
            return;
        }

        // ===== GET LOCAL STORAGE =====
        const debtsStorageJson = await AsyncStorage.getItem("debts");
        let debtsArray: any[] = [];

        if (debtsStorageJson) {
            debtsArray = JSON.parse(debtsStorageJson);
        }

        // ===== OBJECT =====
        const debtObjSaved = {
            id: Date.now().toString(),
            name: name,
            amount: parseInt(amount.replace(/[^0-9]/g, "")),
            date_debt: dateDebt.getTime(),
            date_debt_payment_plan: dateDebtPaymentPlan.getTime(),
            description: description,
            created_at: new Date().getTime(),
        };

        // ===== SAVE TO ASYNC STORAGE =====
        debtsArray.push(debtObjSaved);
        await AsyncStorage.setItem("debts", JSON.stringify(debtsArray));

        // ===== SAVE TO FIREBASE =====
        await addDoc(collection(db, "debts"), {
            name: debtObjSaved.name,
            amount: debtObjSaved.amount,
            date_debt: debtObjSaved.date_debt,
            date_debt_payment_plan: debtObjSaved.date_debt_payment_plan,
            description: debtObjSaved.description,
            created_at: debtObjSaved.created_at,
        });

        Alert.alert("Success", "Data debt berhasil disimpan");
        resetForms();
        router.push("/(screen)/Debt");
    } catch (error) {
        console.error("Save Error:", error);
        Alert.alert("Error", "Gagal menyimpan data");
    }
};


    const formatRupiah = (value: string) => {
        const number = value.replace(/[^0-9]/g, "");
        if (!number) return "";

        return "Rp " + Number(number).toLocaleString("id-ID");
    };

    const resetForms = () => {
        setName("");
        setAmount("");
        setDateDebt(new Date());
        setDateDebtPaymentPlan(new Date());
        setDescription("");
    };

    return (
        <View className="flex-1 bg-[#F2F2F7] py-6">
            <ScrollView>
                <Stack.Screen options={{ headerShown: false }} />
                <View className="flex-1 bg-[#F2F2F4] pb-10">
                    <HeaderPage title="Create Debt" />
                    <View className=" px-[20px] mt-6">
                        <View className="bg-white px-4 pt-6 pb-6 rounded-lg">
                            <View>
                                <Text className="font-semibold text-gray-600 mb-1">Nama Pemberi Hutang</Text>
                                <Input className="border border-gray-300 rounded-lg mb-4 text-gray-600" isRequired={true}>
                                    <InputField
                                        keyboardType="default"
                                        className="text-gray-600"
                                        placeholder="Nama Pemberi Hutang"
                                        value={name}
                                        onChangeText={(val: string) => setName(val)}
                                    />
                                </Input>
                            </View>
                            <View>
                                <Text className="font-semibold text-gray-600 mb-1">Jumlah</Text>
                                <Input className="border border-gray-300 rounded-lg mb-4" isRequired={true}>
                                    <InputField
                                        keyboardType="numeric"
                                        className="text-gray-600"
                                        placeholder="Rp 0"
                                        value={amount}
                                        onChangeText={(val: string) => setAmount(formatRupiah(val))}
                                    />
                                </Input>
                            </View>
                            <View>
                                <Text className="font-semibold text-gray-600 mb-1">Tanggal Hutang</Text>
                                <Pressable onPress={() => setShowDateDebtModal(true)} className="border border-gray-300 mb-4 rounded-lg px-3 py-3">
                                    <Text className="text-gray-600">
                                        {dateDebt.toLocaleDateString("id-ID", {
                                            day: "2-digit",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </Text>
                                </Pressable>

                                {showDateDebtModal && (
                                    <RNDateTimePicker
                                        value={dateDebt}
                                        mode="date"
                                        display={Platform.OS === "ios" ? "spinner" : "default"}
                                        onChange={onChangeDateDebt}
                                    />
                                )}
                            </View>
                            <View>
                                <Text className="font-semibold text-gray-600 mb-1">Tanggal Rencana Bayar</Text>
                                <Pressable onPress={() => setShowDateDebtPaymentPlanModal(true)} className="border border-gray-300 mb-4 rounded-lg px-3 py-3">
                                    <Text className="text-gray-600">
                                        {dateDebtPaymentPlan.toLocaleDateString("id-ID", {
                                            day: "2-digit",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </Text>
                                </Pressable>

                                {showDateDebtPaymentPlanModal && (
                                    <RNDateTimePicker
                                        value={dateDebtPaymentPlan}
                                        mode="date"
                                        display={Platform.OS === "ios" ? "spinner" : "default"}
                                        onChange={onChangeDateDebtPaymentPlan}
                                    />
                                )}
                            </View>
                            <View>
                                <Text className="text-sm text-gray-600 mb-1">Keterangan</Text>
                                <Input className="border border-gray-300 rounded-lg mb-4" isRequired={true}>
                                    <InputField
                                        className="text-gray-600"
                                        keyboardType="default"
                                        placeholder="Keterangan"
                                        value={description}
                                        onChangeText={(val: string) => setDescription(val)}
                                    />
                                </Input>
                            </View>

                            <Text className="text-sm text-gray-600 rounded-lg p-4 mb-4 bg-gray-200">
                                Tanggal transaksi akan diisi otomatis dengan waktu sekarang
                            </Text>

                            <Button onPress={doSubmit} className="bg-blue-500 rounded-lg">
                                <ButtonText className="text-white">Simpan Debt</ButtonText>
                            </Button>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}