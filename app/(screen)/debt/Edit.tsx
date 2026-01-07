import HeaderPage from "@/components/custom/HeaderPage";
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Platform, Pressable, ScrollView, View } from "react-native";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../src/assets/config/firebase";


type DebtType = {
    id: string;
    name: string;
    amount: number;
    date_debt: number;
    date_debt_payment_plan: number;
    description: string;
    created_at: number;
};

export default function EditDebt() {
    /**
     * Hooks
     *
     */
    const { id } = useLocalSearchParams();

    /**
     * States
     *
     */
    const [debt, setDebt] = useState<DebtType>();
    const [debts, setDebts] = useState<DebtType[]>([]);
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

    const doUpdate = async () => {
    try {
        // ===== VALIDATION =====
        if (!name || !amount || !description) {
            Alert.alert("Validation Error", "Semua field wajib diisi");
            return;
        }

        // ===== GET LOCAL STORAGE =====
        const debtsStorageJson = await AsyncStorage.getItem("debts");
        let debtsArray: DebtType[] = [];

        if (debtsStorageJson) {
            debtsArray = JSON.parse(debtsStorageJson);
        }

        // ===== OBJECT UPDATED =====
        const debtObjUpdated: DebtType = {
            id: debt?.id as string,
            name: name,
            amount: parseInt(amount.replace(/[^0-9]/g, "")),
            date_debt: dateDebt.getTime(),
            date_debt_payment_plan: dateDebtPaymentPlan.getTime(),
            description: description,
            created_at: debt?.created_at as number, // tetap pakai created_at lama
        };

        // ===== UPDATE ASYNC STORAGE =====
        const index = debtsArray.findIndex((item) => item.id === id);

        if (index === -1) {
            Alert.alert("Error", "Data tidak ditemukan");
            return;
        }

        debtsArray[index] = debtObjUpdated;
        await AsyncStorage.setItem("debts", JSON.stringify(debtsArray));

        // ===== UPDATE FIREBASE =====
        // Asumsi: documentId di Firebase = debt.id
        // Kalau sebelumnya kamu pakai addDoc tanpa id custom, bilang → saya bantu mapping
        const debtDocRef = collection(db, "debts");
        const qSnapshot = await getDocs(debtDocRef);

        let firebaseDocId: string | null = null;

        qSnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.created_at === debt?.created_at) {
                firebaseDocId = doc.id;
            }
        });

        if (!firebaseDocId) {
            Alert.alert("Error", "Data tidak ditemukan di Firebase");
            return;
        }

        await updateDoc(doc(db, "debts", firebaseDocId), {
            name: debtObjUpdated.name,
            amount: debtObjUpdated.amount,
            date_debt: debtObjUpdated.date_debt,
            date_debt_payment_plan: debtObjUpdated.date_debt_payment_plan,
            description: debtObjUpdated.description,
        });

        Alert.alert("Success", "Data berhasil diupdate");
        resetForms();
        router.push("/(screen)/debt/Index");

    } catch (error) {
        console.error("Update Error:", error);
        Alert.alert("Error", "Gagal update data");
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

    const loadDebts = async () => {
        const debtsStorageJson = await AsyncStorage.getItem("debts");
        let debtsArray: DebtType[] = [];

        if (debtsStorageJson) {
            debtsArray = JSON.parse(debtsStorageJson);
        }

        setDebts(debtsArray);
    };

    /**
     * Deps
     *
     */
    useEffect(() => {
        loadDebts();
    }, []);

    useEffect(() => {
        if (debts.length > 0 && id) {
            setDebt(debts[debts?.findIndex((debtFromDebts) => debtFromDebts.id == id)]);
        }
    }, [debts, id]);

    useEffect(() => {
        if (debt) {
            setName(debt?.name);
            setAmount(debt?.amount.toString());
            setDateDebt(new Date(debt?.date_debt));
            setDateDebtPaymentPlan(new Date(debt?.date_debt_payment_plan));
            setDescription(debt?.description);
        }
    }, [debt]);

    return (
        <View className="flex-1 bg-[#F2F2F7] py-6">
            <ScrollView>
                <Stack.Screen options={{ headerShown: false }} />
                <View className="flex-1 bg-[#F2F2F4] pb-10">
                    <HeaderPage routeBack="/(screen)/debt/Index" title="Edit Debt" />

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

                            <Button onPress={doUpdate} className="bg-blue-500 rounded-lg">
                                <ButtonText className="text-white">Update Debt</ButtonText>
                            </Button>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
