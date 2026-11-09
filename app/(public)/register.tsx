import { useRouter } from "expo-router"
import { useState } from "react"
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"

import { Feather } from "@expo/vector-icons"
import { useRegister } from "../src/auth/viewmodels/use-register"
import { filterDigits, filterLetters, validateEmail, validateLetters, validatePassword, validatePhone } from "../src/utils/validators"

type FieldErrors = Record<string, string | null>

const FieldError = ({ message }: { message?: string | null }) =>
    message ? <Text style={styles.fieldError}>{message}</Text> : null

export default function RegisterScreen() {

    const router = useRouter()

    const {
        email,
        lastName,
        fullName,
        password,
        confirmPassword,
        phone,
        setEmail,
        setPassword,
        setLastName,
        setFullName,
        setConfirmPassword,
        setPhone,
        handleRegister,
        errorMessage,
        isLoading
    } = useRegister()

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [errors, setErrors] = useState<FieldErrors>({})

    const setFieldError = (key: string, message: string | null) =>
        setErrors((prev) => ({ ...prev, [key]: message }))

    const onChangeLetters = (text: string, key: string, label: string, setter: (v: string) => void) => {
        const clean = filterLetters(text)
        setFieldError(key, clean !== text ? `${label} solo puede contener letras, no números ni símbolos` : null)
        setter(clean)
    }

    const onChangePhone = (text: string) => {
        const clean = filterDigits(text)
        setFieldError("phone", clean !== text ? "El teléfono solo puede contener números" : null)
        setPhone(clean)
    }

    const onRegister = () => {
        const confirmError = !confirmPassword
            ? "Confirma tu contraseña"
            : confirmPassword !== password
                ? "Las contraseñas no coinciden"
                : null

        const result: FieldErrors = {
            fullName: validateLetters(fullName, "El nombre"),
            lastName: validateLetters(lastName, "El apellido"),
            phone: validatePhone(phone),
            email: validateEmail(email),
            password: validatePassword(password),
            confirmPassword: confirmError,
        }
        setErrors(result)

        const messages = Object.values(result).filter((m): m is string => !!m)
        if (messages.length > 0) {
            console.log("VALIDACION REGISTRO:", messages)
            Alert.alert("Revisa los datos", messages.join("\n"))
            return
        }
        handleRegister()
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >

            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Create Account</Text>
                    <Text style={styles.label}>full name</Text>

                    <View style={[styles.inputContainer, !!errors.fullName && styles.inputError]}>
                        <Feather name="user" size={20} color="#9ca3af"></Feather>
                        <TextInput style={{ flex: 1, height: "100%", marginLeft: 8 }}
                            placeholder="marilyn "
                            value={fullName}
                            onChangeText={(text) => onChangeLetters(text, "fullName", "El nombre", setFullName)}>
                        </TextInput>
                    </View>
                    <FieldError message={errors.fullName} />

                    <Text style={styles.label}>Last Name</Text>
                    <View style={[styles.inputContainer, !!errors.lastName && styles.inputError]}>
                        <Feather name="user" size={20} color="#9ca3af"></Feather>
                        <TextInput
                            style={{ flex: 1, height: "100%", marginLeft: 8 }}
                            placeholder="argueta"
                            value={lastName}
                            onChangeText={(text) => onChangeLetters(text, "lastName", "El apellido", setLastName)}
                        >

                        </TextInput>

                    </View>
                    <FieldError message={errors.lastName} />

                    <Text style={styles.label}>phone</Text>
                    <View style={[styles.inputContainer, !!errors.phone && styles.inputError]}>
                        <Feather name="phone" size={20} color="#9ca3af"></Feather>
                        <TextInput
                            style={{ flex: 1, height: "100%", marginLeft: 8 }}
                            placeholder="72995648"
                            keyboardType="number-pad"
                            maxLength={8}
                            value={phone}
                            onChangeText={onChangePhone}
                        >

                        </TextInput>

                    </View>
                    <FieldError message={errors.phone} />

                    <Text style={styles.label}>email address</Text>
                    <View style={[styles.inputContainer, !!errors.email && styles.inputError]}>
                        <Feather name="mail" size={20} color="#9ca3af"></Feather>
                        <TextInput style={{ flex: 1, height: "100%", marginLeft: 8 }}
                            placeholder="marilyn@gmail.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={(text) => { setEmail(text); setFieldError("email", null) }}
                            onBlur={() => setFieldError("email", validateEmail(email))}>


                        </TextInput>
                    </View>
                    <FieldError message={errors.email} />

                    <Text style={styles.label}>password</Text>
                    <View style={[styles.inputContainer, !!errors.password && styles.inputError]}>
                        <Feather name="lock" size={20} color="#9ca3af"></Feather>
                        <TextInput
                            style={{ flex: 1, height: "100%", marginLeft: 8 }}
                            placeholder="******"
                            autoCapitalize="none"
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={(text) => { setPassword(text); setFieldError("password", null) }}
                            onBlur={() => setFieldError("password", validatePassword(password))}>

                        </TextInput>
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Feather name={showPassword ? "eye-off" : "eye"} size={20} color="#9ca3af" />
                        </TouchableOpacity>
                    </View>
                    <FieldError message={errors.password} />

                    <Text style={styles.label}>confirm password</Text>
                    <View style={[styles.inputContainer, !!errors.confirmPassword && styles.inputError]}>
                        <Feather name="lock" size={20} color="#9ca3af"></Feather>
                        <TextInput
                            style={{ flex: 1, height: "100%", marginLeft: 8 }}
                            placeholder="******"
                            autoCapitalize="none"
                            secureTextEntry={!showConfirm}
                            value={confirmPassword}
                            onChangeText={(text) => { setConfirmPassword(text); setFieldError("confirmPassword", null) }}
                            onBlur={() => setFieldError("confirmPassword", confirmPassword !== password ? "Las contraseñas no coinciden" : null)}>


                        </TextInput>
                        <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                            <Feather name={showConfirm ? "eye-off" : "eye"} size={20} color="#9ca3af" />
                        </TouchableOpacity>
                    </View>
                    <FieldError message={errors.confirmPassword} />

                    {errorMessage && (
                        <View style={styles.errorContainer}>
                            <Feather name="alert-circle" size={18} color="#dc2626" />
                            <Text style={styles.errorText}>
                                {errorMessage}
                            </Text>
                        </View>
                    )}

                    {isLoading ? (
                        <ActivityIndicator size="large" color="#005c47"></ActivityIndicator>
                    ) : (
                        <TouchableOpacity
                            style={styles.buttonRegister}
                            onPress={onRegister}
                        >
                            <Text style={styles.buttonRegisterText}>Register</Text>
                        </TouchableOpacity>
                    )}

                </View>

                <View style={styles.singRow}>
                    <Text style={styles.singInTex}>already have an account</Text>
                    <TouchableOpacity
                        onPress={() => router.push("/(public)")}
                    >
                        <Text style={styles.singTextLink}>log in here</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>

        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FaFB"
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 24,
        justifyContent: "center",
        paddingTop: 40
    },
    card: {
        backgroundColor: "#fff",
        borderWidth: 1,
        padding: 12,
        borderRadius: 14,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#1f2937",
        textAlign: "center",
        marginBottom: 20
    },
    label: {
        fontSize: 14,
        color: "#160707d2",
        marginBottom: 10
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#d1d5db",
        paddingHorizontal: 12,
        height: 50,
        marginBottom: 15
    },
    inputError: {
        borderColor: "#dc2626"
    },
    fieldError: {
        color: "#dc2626",
        fontSize: 12,
        marginTop: -8,
        marginBottom: 12
    },
    buttonRegister: {
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
        height: 50,
        borderRadius: 8,
        backgroundColor: "#006c47"
    },
    buttonRegisterText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold"
    },
    singRow: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20
    },
    singInTex: {
        fontSize: 14,
        color: "#6b7288",
    },
    singTextLink: {
        fontSize: 14,
        color: "#006c47",
        fontWeight: "bold"
    },
    errorContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fee2e2",
        borderWidth: 1,
        borderColor: "#fecaca",
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
    },

    errorText: {
        flex: 1,
        marginLeft: 8,
        color: "#dc2626",
        fontSize: 14,
    },
})