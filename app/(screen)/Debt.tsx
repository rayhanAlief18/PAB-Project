import HeaderPage from "@/components/custom/HeaderPage";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
// import { EditIcon, TrashIcon } from "@/components/ui/icon";
import { Table, TableBody, TableData, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, Stack } from "expo-router";
import { Edit, PlusIcon, Trash2 } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

type DebtType = {
    id: string;
    name: string;
    amount: number;
    date_debt: number;
    date_debt_payment_plan: number;
    description: string;
    created_at: number;
};

export default function Debt() {
    /**
     * States
     *
     */
    const [debts, setDebts] = useState<DebtType[]>([]);

    /**
     * Methods
     *
     */
    const loadDebts = async () => {
        const debtsStorageJson = await AsyncStorage.getItem("debts");
        let debtsArray = [];

        if (debtsStorageJson) {
            debtsArray = JSON.parse(debtsStorageJson);
        }

        setDebts(debtsArray.reverse());
    };

    const deleteDebt = async (debtObj: DebtType) => {
        const debtsStorageJson = await AsyncStorage.getItem("debts");
        let debtsArray = [];

        if (debtsStorageJson) {
            debtsArray = JSON.parse(debtsStorageJson);
        }

        await AsyncStorage.setItem("debts", JSON.stringify(debtsArray.filter((debtObjStorage: DebtType) => debtObjStorage.id != debtObj.id)));
        loadDebts();
    };

    /**
     * Deps
     *
     */
    useEffect(() => {
        loadDebts();
    }, []);

    return (
        <View className="flex-1 bg-[#F2F2F7] py-6">
            <ScrollView>
                <Stack.Screen options={{ headerShown: false }} />
                <View className="flex-1 bg-[#F2F2F4] pb-10">
                    <HeaderPage title="List Debts" />

                    <View className=" px-[20px] mt-6">
                        <Button
                            onPress={() => {
                                router.push("/(screen)/debt/Create");
                            }}>
                            <ButtonIcon as={PlusIcon} />
                            <ButtonText>Create Debt</ButtonText>
                        </Button>

                        <Table className="w-full bg-white mt-6 rounded-lg">
                            <TableHeader>
                                <TableRow className=" bg-white">
                                    <TableHead className="text-xs text-gray-600 pr-2 pl-4">Nama</TableHead>
                                    <TableHead className="text-xs text-gray-600 px-2">Jumlah</TableHead>
                                    <TableHead className="text-xs text-gray-600 px-2">Tgl Hutang</TableHead>
                                    <TableHead className="text-xs text-gray-600 px-2">Dibuat</TableHead>
                                    <TableHead className="text-xs text-gray-600 px-2">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {debts.map((debtRow, debtRowIndex) => (
                                    <TableRow className=" bg-white" key={debtRowIndex}>
                                        <TableData className="text-xs text-gray-600 pr-2 pl-4">{debtRow?.name}</TableData>
                                        <TableData className="text-xs text-gray-600 px-2">Rp {debtRow?.amount?.toLocaleString("id-ID")}</TableData>
                                        <TableData className="text-xs text-gray-600 px-2">
                                            {new Date(debtRow.date_debt).toLocaleDateString("id-ID", {
                                                day: "2-digit",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </TableData>
                                        <TableData className="text-xs text-gray-600 px-2">
                                            {new Date(debtRow.created_at).toLocaleDateString("id-ID", {
                                                day: "2-digit",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </TableData>
                                        <TableData className="text-xs text-gray-600 px-2">
                                            <View className=" space-y-1">
                                                <Button
                                                    size="xs"
                                                    onPress={() => {
                                                        router.push(`/(screen)/debt/Edit?id=${debtRow.id}`);
                                                    }}>
                                                    <ButtonIcon as={Edit}></ButtonIcon>
                                                </Button>
                                                <Button
                                                    size="xs"
                                                    className="mt-2"
                                                    onPress={() => {
                                                        deleteDebt(debtRow);
                                                    }}>
                                                    <ButtonIcon as={Trash2}></ButtonIcon>
                                                </Button>
                                            </View>
                                        </TableData>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}