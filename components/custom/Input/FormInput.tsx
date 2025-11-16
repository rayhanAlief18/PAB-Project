import { Input, InputField } from '@/components/ui/input';
import React from 'react';
import { Text, View } from 'react-native';

type KeyboardTypeOptions =
    | "default"
    | "email-address"
    | "numeric"
    | "number-pad"
    | "decimal-pad"
    | "phone-pad"
    | "url"
    | "visible-password"
    | "ascii-capable"
    | "name-phone-pad"
    | "twitter"
    | "web-search";

interface FormInputPropsType {
    value: string,
    title: string,
    setOnchange: (text: string) => void,
    placeHolder?: string,
    typeInput: KeyboardTypeOptions,
    isPassword?:boolean,
}


export default function FormInput({ value, title, setOnchange, placeHolder, typeInput, isPassword }: FormInputPropsType) {
    return (
        <>
            <View>
                <Text className="text-gray-500 mb-1 tracking-[-0.5px]" style={{ fontFamily: "HankenGrotesk_500Medium" }}>{title}: {value}</Text>
                <Input className="rounded-md bg-white border-2 border-gray-300">
                    <InputField
                        type={isPassword ? 'password':'text'}
                        keyboardType={typeInput}
                        style={{ fontFamily: "HankenGrotesk_400Regular" }}
                        className="text-black"
                        value={value}
                        onChangeText={setOnchange}
                        placeholder={placeHolder}
                    />
                </Input>
            </View>
        </>
    )
}
