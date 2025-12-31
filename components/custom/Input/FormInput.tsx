import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { BookAlertIcon } from 'lucide-react-native';
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

    type VariantType =
    | "rounded"
    | "underlined"
    | "outline";

interface FormInputPropsType {
    value: string,
    title: string,
    setOnChange: (text: string) => void,
    placeholder?: string,
    typeInput: KeyboardTypeOptions,
    isPassword?: boolean,
    isRequired?: boolean,
    variant?: VariantType
}


export default function FormInputs({ value, title, setOnChange, placeholder, typeInput, isPassword, variant, isRequired }: FormInputPropsType) {
    return (
        <>
            <View>
                <Text className="text-black mb-1 tracking-[-0.5px]" style={{ fontFamily: "HankenGrotesk_500Medium" }}>{title}</Text>
                <Input
                    isFocused={false}
                    className="bg-white border border-gray-400 h-12 "
                    variant={variant}   
                    isRequired ={isRequired}>
                    <InputSlot className="pl-5">
                        <InputIcon as={BookAlertIcon} />
                    </InputSlot>
                    <InputField
                        type={isPassword ? 'password' : 'text'}
                        keyboardType={typeInput}
                        style={{ fontFamily: "HankenGrotesk_400Regular" }}
                        className="text-black"
                        value={value}
                        onChangeText={setOnChange}
                        placeholder={placeholder}
                    />
                </Input>
            </View>
        </>
    )
}
