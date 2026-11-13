import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Drawer from 'expo-router/drawer';
import { useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Datos de prueba (hardcode)
const PRODUCT = {
    category: "Periféricos Gaming",
    store: "ShopEase",
    name: "Teclado Mecánico RGB Pro Inalámbrico",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800",
    price: 85.5,
    oldPrice: 110,
    discount: 22,
    stock: 18,
    shipping: "Envío Motorizado Hoy",
}

export default function ProductDetailScreen() {
    const router = useRouter()

    return (
        <SafeAreaView style={styles.container}>
            <Drawer.Screen options={{ headerShown: false }} />

            {/* Barra superior */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.replace("/(protected)/dashboard")}
                >
                    <Ionicons name="arrow-back" size={24} color="#111827" />
                </TouchableOpacity>

                <View style={styles.headerCenter}>
                    <Text style={styles.headerCategory}>{PRODUCT.category}</Text>
                    <Text style={styles.headerStore}>{PRODUCT.store}</Text>
                </View>

                {/* espacio para que el título quede centrado */}
                <View style={styles.backButton} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Tarjeta con imagen */}
                <View style={styles.imageCard}>
                    <Image
                        source={{ uri: PRODUCT.image }}
                        style={styles.image}
                        resizeMode="cover"
                    />

                    {/* Elementos flotantes: esquina superior izquierda */}
                    <View style={styles.badgesLeft}>
                        <View style={styles.discountBadge}>
                            <Feather name="zap" size={14} color="#fff" />
                            <Text style={styles.discountText}>-{PRODUCT.discount}% OFF</Text>
                        </View>
                        <View style={styles.officialBadge}>
                            <Ionicons name="shield-checkmark-outline" size={14} color="#374151" />
                            <Text style={styles.officialText}>Oficial</Text>
                        </View>
                    </View>

                    {/* Elemento flotante: esquina superior derecha */}
                    <TouchableOpacity style={styles.shareButton}>
                        <Feather name="share-2" size={18} color="#374151" />
                    </TouchableOpacity>
                </View>

                {/* Etiquetas de stock y envío */}
                <View style={styles.tagsRow}>
                    <View style={styles.stockTag}>
                        <View style={styles.stockDot} />
                        <Text style={styles.stockText}>En Stock ({PRODUCT.stock} disponibles)</Text>
                    </View>
                </View>
                <View style={styles.tagsRow}>
                    <View style={styles.shippingTag}>
                        <MaterialCommunityIcons name="motorbike" size={16} color="#475569" />
                        <Text style={styles.shippingText}>{PRODUCT.shipping}</Text>
                    </View>
                </View>

                {/* Título */}
                <Text style={styles.title}>{PRODUCT.name}</Text>

                {/* Precios */}
                <View style={styles.priceCard}>
                    <Text style={styles.price}>${PRODUCT.price.toFixed(2)}</Text>
                    <Text style={styles.oldPrice}>${PRODUCT.oldPrice.toFixed(2)}</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8fafc"
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#f8fafc"
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "flex-start"
    },
    headerCenter: {
        alignItems: "center"
    },
    headerCategory: {
        fontSize: 14,
        color: "#374151",
        fontWeight: "600",
        letterSpacing: 0.5
    },
    headerStore: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#256b4a"
    },
    scrollContent: {
        paddingBottom: 32
    },
    imageCard: {
        marginHorizontal: 16,
        marginTop: 8,
        height: 300,
        backgroundColor: "#e5e7eb",
        borderRadius: 24,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4
    },
    image: {
        width: "100%",
        height: "100%"
    },
    badgesLeft: {
        position: "absolute",
        top: 14,
        left: 14,
        gap: 8,
        alignItems: "flex-start"
    },
    discountBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#4cb97f",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6
    },
    discountText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14
    },
    officialBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.9)",
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20,
        gap: 6
    },
    officialText: {
        color: "#374151",
        fontWeight: "bold",
        fontSize: 13
    },
    shareButton: {
        position: "absolute",
        top: 14,
        right: 14,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(255,255,255,0.9)",
        justifyContent: "center",
        alignItems: "center"
    },
    tagsRow: {
        flexDirection: "row",
        paddingHorizontal: 16,
        marginTop: 12
    },
    stockTag: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#c8f0dc",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6
    },
    stockDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#256b4a"
    },
    stockText: {
        color: "#256b4a",
        fontWeight: "bold",
        fontSize: 13
    },
    shippingTag: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#dbe5fb",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6
    },
    shippingText: {
        color: "#475569",
        fontWeight: "bold",
        fontSize: 13
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#111827",
        marginHorizontal: 16,
        marginTop: 16,
        lineHeight: 38
    },
    priceCard: {
        flexDirection: "row",
        alignItems: "flex-end",
        backgroundColor: "#fff",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        marginHorizontal: 16,
        marginTop: 16,
        paddingHorizontal: 24,
        paddingVertical: 20,
        gap: 12
    },
    price: {
        fontSize: 48,
        fontWeight: "bold",
        color: "#256b4a"
    },
    oldPrice: {
        fontSize: 20,
        color: "#6b7280",
        textDecorationLine: "line-through",
        marginBottom: 8
    }
})