import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native"
import { useRouter } from "expo-router"

import { Feather } from "@expo/vector-icons"
import { useRegister } from "../src/auth/viewmodels/use-register"

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

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >

            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Create Account</Text>
                    <Text style={styles.label}>full name</Text>

                    <View style={styles.inputContainer}>
                        <Feather name="user" size={20} color="#9ca3af"></Feather>
                        <TextInput style={{ flex: 1, height: "100%", marginLeft: 8 }}
                            placeholder="ivan beltran"
                            value={fullName}
                            onChangeText={setFullName}>
                        </TextInput>
                    </View>

                    <Text style={styles.label}>Last Name</Text>
                    <View style={styles.inputContainer}>
                        <Feather name="user" size={20} color="#9ca3af"></Feather>
                        <TextInput
                            style={{ flex: 1, height: "100%", marginLeft: 8 }}
                            placeholder="segovia"
                            value={lastName}
                            onChangeText={setLastName}
                        >

                        </TextInput>

                    </View>

                    <Text style={styles.label}>phone</Text>
                    <View style={styles.inputContainer}>
                        <Feather name="phone" size={20} color="#9ca3af"></Feather>
                        <TextInput
                            style={{ flex: 1, height: "100%", marginLeft: 8 }}
                            placeholder="34545698"
                            value={phone}
                            onChangeText={setPhone}
                        >

                        </TextInput>

                    </View>

                    <Text style={styles.label}>email address</Text>
                    <View style={styles.inputContainer}>
                        <Feather name="mail" size={20} color="#9ca3af"></Feather>
                        <TextInput style={{ flex: 1, height: "100%", marginLeft: 8 }}
                            placeholder="ivanbeltran@gmail.com"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}>


                        </TextInput>
                    </View>

                    <Text style={styles.label}>password</Text>
                    <View style={styles.inputContainer}>
                        <Feather name="lock" size={20} color="#9ca3af"></Feather>
                        <TextInput
                            style={{ flex: 1, height: "100%", marginLeft: 8 }}
                            placeholder="*****"
                            secureTextEntry={true}
                            value={password}
                            onChangeText={setPassword}>

                        </TextInput>
                    </View>

                    <Text style={styles.label}>confirm password</Text>
                    <View style={styles.inputContainer}>
                        <Feather name="lock" size={20} color="#9ca3af"></Feather>
                        <TextInput
                            style={{ flex: 1, height: "100%", marginLeft: 8 }}
                            placeholder="******"
                            secureTextEntry={true}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}>


                        </TextInput>
                    </View>

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
                            onPress={handleRegister}
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