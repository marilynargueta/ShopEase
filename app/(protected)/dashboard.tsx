import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import Drawer from "expo-router/drawer";
import { Profiler, useEffect, useMemo, useState, } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Dimensions, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDrawer } from "../src/admin/viewmodels/use-drawer";
import { TextInput } from "react-native-gesture-handler";
import { steps } from "react-native-reanimated"
import { useRouter } from "expo-router";
import { useAuth } from "../src/context/AuthContext";
import { CategoryService } from "../src/categories/services/category.service";

const { width } = Dimensions.get('window')

const CARD_WIDTH = (width - 44) / 2

interface Product {
    id: string,
    title: string,
    description: string,
    price: number,
    image: string,
    isNew?: boolean,
    category: string
}

const CATEGORIES = ["All Products", "Electronics", "Fashions", "VideoGames"]

const MOCK_PRODUCTS: Product[] = [
    {
        id: "1",
        title: "Premium Audio",
        description: "Wireless Noise Cancelling",
        price: 299.00,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop",
        isNew: true,
        category: "Electronics",
    },
    {
        id: "2",
        title: "Eon Classic Wrist",
        description: "Genuine Leather Strap",
        price: 145.00,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop",
        category: "Fashions",
    },
    {
        id: "3",
        title: "Velocity Running",
        description: "Peak Performance Gear",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop",
        category: "Fashions",
    },
    {
        id: "4",
        title: "Insta-Capture",
        description: "Vintage Aesthetics",
        price: 120.00,
        image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=600&auto=format&fit=crop",
        category: "Electronics",
    },
    {
        id: "5",
        title: "Console Controller",
        description: "Built for Next-Gen Gaming",
        price: 69.99,
        image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop",
        isNew: true,
        category: "VideoGames",
    }
];

export default function DashboardScreen() {
    const navigation = useNavigation()
    const router = useRouter()
    const { profile } = useDrawer()
    const { token } = useAuth()
    const [searchQuery, setSearchQuery] = useState("")

    const [categories, setCategories] = useState<string[]>(["All categories"])
    const [selectedCategory, setSelectedCategory] = useState("All categories")
    const [isLoadingCategories, setIsLoadingCategories] = useState(false)

    useEffect(() => {
        const fetchCategories = async () => {
            if (!token) return
            setIsLoadingCategories(true)
            try {
                const data = await CategoryService.getCategories(token)
                const categoryNames = Array.from(new Set(data.map((c) => c.name)))
                setCategories(["All categories", ...categoryNames])
            } catch (error) {
                console.log("error en cargar las categorias from screen",error)
            }
            finally {
                setIsLoadingCategories(false)
            }
        }
        fetchCategories()
    }, [token])

    const openMenu = () => {
        navigation.dispatch(DrawerActions.openDrawer)
    }

    const filteredProductsByCategory = useMemo(() => {
        return MOCK_PRODUCTS.filter((product) => {
            const matchCategory = selectedCategory === "All categories" || product.category === selectedCategory
            const matchSearch =
                product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase())
            return matchCategory && matchSearch
        })
    }, [selectedCategory, searchQuery])

    return (
        <SafeAreaView style={styles.container}>
            <Drawer.Screen options={{ headerShown: false }} />

            <View style={styles.header}>
                <TouchableOpacity style={{ padding: 15 }} onPress={openMenu}>
                    <Ionicons name="menu-outline" size={30} color={"#005c3a"}></Ionicons>
                </TouchableOpacity>

                <Text style={styles.logoText}>ShopEase</Text>

                <TouchableOpacity
                    style={styles.profileContainer}
                    onPress={() => router.push("/(protected)/profile")}
                >
                    <Image
                        source={{ uri: profile.avatarUrl }}
                        style={styles.avatarImage}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} style={styles.searchIcon} />
                <TextInput
                    placeholder="search products"
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>
            <View style={styles.categoriesWrapper}>
                {isLoadingCategories ? (
                    <ActivityIndicator color="#005c3a" size="small"></ActivityIndicator>
                ) : (
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={categories}
                        keyExtractor={(item) => item}
                        contentContainerStyle={styles.categoriesList}
                        renderItem={({ item }) => {
                            const isSelected = item=== selectedCategory
                            return (
                                <TouchableOpacity 
                                onPressIn={()=>setSelectedCategory(item)}
                                style={[
                                    styles.categorieItem,
                                    isSelected && styles.categorieItemSelected
                                ]}
                                    onPress={() => setSelectedCategory(item)}
                                >
                                    <Text style={isSelected ? styles.categorieItemSelectedText : { color: "black" }}>
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            )
                        }}
                    />
                )}

            </View>

            {/**product card */}

            <FlatList
                data={filteredProductsByCategory}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.gridRowSpace}
                contentContainerStyle={styles.producList}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View style={styles.cardContainer}>
                        <View style={styles.imageWrapper}>

                            <Image
                                source={{ uri: item.image }}
                                style={styles.productImage}
                            />
                            {item.isNew && (
                                <View style={styles.newBadget}>
                                    <Text style={styles.newBadgeText}>NEW</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.productInfo}>
                            <Text style={styles.productTitle}>{item.title}</Text>
                            <Text style={styles.productDescription}>{item.description}</Text>

                            <View style={styles.priceRow}>
                                <Text>${item.price.toFixed(2)}</Text>
                                <TouchableOpacity style={styles.carBtn}>
                                    <Ionicons name="cart-outline" size={16} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
            />
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
        justifyContent: "space-between",
        paddingHorizontal: 15,
        paddingVertical: 14
    },
    logoText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#005c3a"
    },
    profileContainer: {
        borderRadius: 20,
        overflow: "hidden",
        borderWidth: 1,

    },
    avatarImage: {
        width: 40,
        height: 40
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        marginHorizontal: 16,
        marginTop: 20,
        paddingHorizontal: 14,
        paddingVertical: 14,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 14
    },
    searchIcon: {
        marginRight: 10
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: "#1f2937",
        padding: 0
    },
    categoriesWrapper: {
        maxHeight: 50,
        marginBottom: 16
    },
    categoriesList: {
        paddingHorizontal: 16,
        alignItems: "center",

    },
    categorieItem: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        backgroundColor: "#e5e7eb",
        borderRadius: 24,
        marginRight: 10
    },
    categorieItemSelected: {
        backgroundColor: "#005c3a",
    },
    categorieItemSelectedText: {
        color: "#fff",
        fontWeight: "bold"
    },
    producList: {
        paddingHorizontal: 16,
        paddingBottom: 24
    },
    gridRowSpace: {
        justifyContent: "space-between"
    },
    cardContainer: {
        width: CARD_WIDTH,
        backgroundColor: "#fff",
        borderRadius: 16,
        marginBottom: 16,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2
    },
    imageWrapper: {
        width: "100%",
        height: 140,
        backgroundColor: "#f3f4f6",
        position: "relative"
    },
    productImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover"
    },
    productInfo: {
        padding: 12,
    },
    productTitle: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#1f2937",
        marginBottom: 2
    },
    productDescription: {
        fontSize: 11,
        color: "#6b7280",
        marginBottom: 8
    },
    newBadget: {
        position: "absolute",
        top: 10,
        left: 10,
        backgroundColor: "#005c3a",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6
    },
    newBadgeText: {
        color: "#fff",
        fontSize: 10,
        fontWeight: "bold"
    },
    priceRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    carBtn: {
        backgroundColor: "#00b074",
        width: 30,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 15
    }

})