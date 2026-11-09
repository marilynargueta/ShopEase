import { SafeAreaView } from "react-native-safe-area-context"
import { KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, View, Text, Alert, ActivityIndicator } from "react-native"
import Drawer from "expo-router/drawer"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { ScrollView, TextInput } from "react-native-gesture-handler"
import { useAuth } from "../src/context/AuthContext"
import { useState } from "react"
import { CategoryService } from "../src/categories/services/category.service"
import { filterLetters, validateLetters } from "../src/utils/validators"
export default function InventoryScreen() {
    const router = useRouter()
    const { token } = useAuth()
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [nameError, setNameError] = useState<string | null>(null)
    const [descriptionError, setDescriptionError] = useState<string | null>(null)

    const onChangeName = (text: string) => {
        const clean = filterLetters(text)
        setNameError(clean !== text ? "El nombre solo puede contener letras, no números ni símbolos" : null)
        setName(clean)
    }

    const onChangeDescription = (text: string) => {
        setDescription(text)
        setDescriptionError(null)
    }

    const handleSaveCategory = async () => {
        const nError = validateLetters(name, "El nombre de la categoría")
        const dError = !description.trim()
            ? "La descripción es obligatoria"
            : description.trim().length < 5
                ? "La descripción debe tener al menos 5 caracteres"
                : null
        setNameError(nError)
        setDescriptionError(dError)

        const messages = [nError, dError].filter((m): m is string => !!m)
        if (messages.length > 0) {
            console.log("VALIDACION CATEGORIA:", messages)
            Alert.alert("Revisa los datos", messages.join("\n"))
            return
        }
        if (!token) {
            Alert.alert("error de session, no se encontro el token")
            return
        }
        setIsLoading(true)
        try {
            console.log("GUARDANDO CATEGORIA:", name, description) // LOG NUEVO
            const newCategory = await CategoryService.createCategory(name, description, token)
            console.log("RESPUESTA CREAR CATEGORIA:", JSON.stringify(newCategory)) // LOG NUEVO
            Alert.alert(
                "categoria creada",
                `la categoria ${newCategory.name} se guardo con exito`,
                [
                    {
                        text: "aceptar",
                        onPress: () => {
                            setName("")
                            setDescription("")
                            router.replace("/(protected)/dashboard")
                        }
                    }
                ]
            )
        } catch (error: any) {
            console.log("ERROR CREAR CATEGORIA:", error.message) // LOG NUEVO
            Alert.alert("Error", error.message || "no se pudo guardar la categoria")
        }
        finally {
            setIsLoading(false)
        }
    }
    return (
        <SafeAreaView style={styles.container}>
            <Drawer.Screen options={{ headerShown: false }} />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => {
                            router.replace("/(protected)/dashboard")
                        }}
                    >
                        <Ionicons name="arrow-back-outline" size={26} />
                    </TouchableOpacity>
                    <View style={styles.titleWrapper}>
                        <Text style={styles.headerTitle}>ADMIN PORTAL</Text>
                        <Text style={styles.headerSubTitle}>Nueva Categoria</Text>
                    </View>
                    <View style={styles.boxIconContainer}>
                        <Ionicons name="archive-outline" size={22} />
                    </View>
                </View>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <Text style={styles.logoText}>
                        Ingresa los datos esenciales para catalogar los productos en el inventario
                    </Text>

                    <View style={styles.formCard}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Nombre de la categoria</Text>
                            <TextInput
                                placeholder="Ej. Dulceria"
                                style={[styles.textInput, !!nameError && styles.inputError]}
                                value={name}
                                onChangeText={onChangeName}
                                editable={!isLoading}
                            />
                            {nameError && <Text style={styles.fieldError}>{nameError}</Text>}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Descripcion de la categoria</Text>
                            <TextInput
                                placeholder="describe los productos que engloban eseta categoria"
                                multiline
                                numberOfLines={5}
                                textAlignVertical="top"
                                style={[styles.textAreaInput, !!descriptionError && styles.inputError]}
                                value={description}
                                onChangeText={onChangeDescription}
                                editable={!isLoading}
                            />
                            {descriptionError && <Text style={styles.fieldError}>{descriptionError}</Text>}
                        </View>

                        <TouchableOpacity 
                        style={styles.btnSave}
                        onPress={handleSaveCategory}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" size="small"/>
                            ):(
                                <>
                                   
                                    <Text style={styles.btnSaveText}>Guardar Categoria</Text>
                                </>
                                
                            )}
                            
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.btnCancel}
                            onPress={() => router.replace("/(protected)/dashboard")}
                        >
                            <Text style={styles.btnCancelText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9fafb"
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: "#faf9fb"
    },
    titleWrapper: {
        flex: 1,
        marginLeft: 16
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#112827",
        letterSpacing: 0.8
    },
    headerSubTitle: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#006c47",
        marginTop: 2

    },
    boxIconContainer: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "#e5e7eb",
        alignItems: "center",
        justifyContent: "center"
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 16
    },
    logoText: {
        fontSize: 14,
        color: "#4b5563",
        lineHeight: 20,
        marginBottom: 24
    },
    formCard: {
        backgroundColor: "#fff",
        padding: 24,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 15,
        elevation: 2
    },
    inputGroup: {
        marginBottom: 10
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: "bold",
        color: "#374151",
        marginBottom: 8
    },
    textInput: {
        height: 48,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        paddingHorizontal: 16,
        fontSize: 14,
        borderRadius: 10
    },
    textAreaInput: {
        height: 120,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 14
    },
    inputError: {
        borderColor: "#dc2626"
    },
    fieldError: {
        color: "#dc2626",
        fontSize: 12,
        marginTop: 4
    },
    btnSave: {
        backgroundColor: "#006c47",
        height: 48,
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16
    },
    checkIcon: {
        marginRight: 8
    },
    btnSaveText: {
        color: "#fff",
        fontSize: 15
    },
    btnCancel: {
        height: 24,
        justifyContent: "center",
        alignItems: "center",
    },
    btnCancelText: {
        fontSize: 14,
        color: "#6b7280",
        fontWeight: "500"
    }
})