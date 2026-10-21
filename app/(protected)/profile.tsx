import { Text, StyleSheet, TouchableOpacity, View, ScrollView, Image, TextInput, Alert, ActivityIndicator } from 'react-native'
import { useRouter } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import Drawer from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../src/context/AuthContext';
import { use, useEffect, useState } from 'react';
import { AuthService } from '../src/auth/services/auth.service';


export default function ProfileScreen() {
    const router = useRouter()
    const { user, token, updateUserSession } = useAuth()
    const [name, setName] = useState("")
    const [lastname, setLastname] = useState("")
    const [phone, setphone] = useState("")
    const [isUpdating, setIsUpdating] = useState(false)

    useEffect(() => {
        if (user) {
            setName(user.name || "")
            setLastname(user.lastName || "")
            setphone(user.phone || "")
        }
    }, [user])

    const handleUpdateUser = async () => {
        if (!name.trim() || !lastname.trim() || !phone.trim()) {
            Alert.alert("campos incompletos por favor llenar los campos")
            return
        }
        if (!user?.id || !token) {
            Alert.alert("error de session, no se encontro el user")
            return
        }

        setIsUpdating(true)
        try {
            const updateUser = await AuthService.updateUser(
                user.id,
                name,
                lastname,
                phone,
                token
            )

            await updateUserSession(updateUser)
            Alert.alert("excelente tu informacion ha sido actualizada con exito en el servidor")
        } catch (error: any) {
            Alert.alert("error de registro", error.message || "no se pudo actualizar")
        }
        finally {
            setIsUpdating(false)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Drawer.Screen options={{ headerShown: false }} />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => {
                    if (router.canGoBack()) {
                        router.back();
                    } else {
                        router.replace("/(protected)/dashboard")
                    }
                }}>
                    <Ionicons name="arrow-back-outline" size={26} />
                </TouchableOpacity>
                <Text style={styles.logoText}>ShopEase</Text>
            </View>

            <ScrollView showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.profileCard}>
                    <View style={styles.imageWrapper}>
                        <Image
                            source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6vNaL97MalsRvvG1VDo7YRci5ugFHblh7HmI4LZgurVKB58FeMrsTIXk&s=10" }}

                            style={styles.profileAvatar}
                        />
                        <TouchableOpacity style={styles.cameraBtn}>
                            <Ionicons name="camera" size={16} color={"#fff"} />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.profileName}>Josue Ivan Beltran Segovia</Text>

                    <Text style={styles.profileSubtitle}>full stack developer</Text>

                    <View style={styles.cardPoints}>
                        <View style={[styles.cardPointBox, styles.cardOrderColor]}>
                            <Text style={styles.cardBoxLabel}>Orders</Text>
                            <Text style={styles.cardBoxValue}>24</Text>
                        </View>

                        <View style={[styles.cardPointBox, styles.cardPointColor]}>
                            <Text style={styles.cardBoxLabel}>points</Text>
                            <Text style={styles.cardBoxValue}>1,250</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.sectionCard}>
                    <Text style={styles.personalHeader}>Personal Information</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Name</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name='person-outline' size={20} style={styles.inputIcon} />
                            <TextInput
                                placeholder='full name'
                                style={styles.input}
                                value={name}
                                onChangeText={setName}
                            />
                        </View>
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Last Name</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name='person-outline' size={20} style={styles.inputIcon} />
                            <TextInput
                                placeholder='beltran segovia'
                                style={styles.input}
                                value={lastname}
                                onChangeText={setLastname}
                            />
                        </View>
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Phone Number</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name='call-outline' size={20} style={styles.inputIcon} />
                            <TextInput
                                placeholder='34564567'
                                style={styles.input}
                                keyboardType='phone-pad'
                                value={phone}
                                onChangeText={setphone}
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.updateButton}
                        onPress={handleUpdateUser}
                        disabled={isUpdating}
                    >
                        {isUpdating ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <>
                                <Ionicons name='checkmark-circle-outline' size={20} color={"#fff"} style={{ marginRight: 8 }} />

                                <Text style={styles.updateButtonText}>Save Changes</Text>

                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f3f4f6"
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 12,
        paddingVertical: 12,
        backgroundColor: "#f3f4f6"
    },
    logoText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#005c3a"
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 40
    },
    profileAvatar: {
        width: 100,
        height: 100,
        borderRadius: 50,

    },
    imageWrapper: {
        position: "relative",
        marginBottom: 14
    },
    profileCard: {
        backgroundColor: "#fff",
        borderRadius: 16,
        alignItems: "center",
        paddingVertical: 24,
        paddingHorizontal: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 12
    },
    cameraBtn: {
        backgroundColor: "#005c3a",
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 16,
        borderWidth: 2,
        borderColor: "#fff"

    },
    profileName: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 4
    },
    profileSubtitle: {
        fontSize: 13,
        color: "#6b7280",
        marginBottom: 20
    },
    cardPoints: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between"
    },
    cardPointBox: {
        flex: 1,
        height: 64,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 6
    },
    cardOrderColor: {
        backgroundColor: "#dbeafe"
    },
    cardPointColor: {
        backgroundColor: "#e2f0fc"
    },
    cardBoxLabel: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#4b5563",
        letterSpacing: 1,
        marginBottom: 4
    },
    cardBoxValue: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#047857"
    },
    sectionCard: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        textShadowRadius: 10,
        elevation: 2
    },
    personalHeader: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 18
    },
    inputGroup: {
        marginBottom: 14
    },
    inputLabel: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#4b5563",
        letterSpacing: 1,
        marginBottom: 6
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderBlockColor: "#d1d5db",
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
        backgroundColor: "#fff"
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: "#1f2937",
        paddingVertical: 0
    },
    inputIcon: {
        marginRight: 10
    },
    updateButton: {
        flexDirection: "row",
        backgroundColor: "#005c3a",
        borderRadius: 12,
        height: 48,
        alignItems: "center",
        justifyContent: "center"
    },
    updateButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold"
    }

})