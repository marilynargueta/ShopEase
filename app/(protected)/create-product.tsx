import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Drawer from 'expo-router/drawer';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView, ActivityIndicator, Modal,FlatList, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useCreateProduct } from '../src/products/viewmodels/use-create-product';
import { filterDecimal, filterDigits, filterLetters, validateDecimal, validateInteger, validateLetters } from '../src/utils/validators';

type FieldErrors = Record<string, string | null>

const FieldError = ({ message }: { message?: string | null }) =>
    message ? <Text style={styles.fieldError}>{message}</Text> : null

export default function CreateProductScreen() {

    const router = useRouter()
    const {
        name,
        setName,
        categoryId,
        setCategoryId,
        sku,
        setSku,
        description,
        setDescription,
        regularPrice,
        setRegularPrice,
        offerPrice,
        setOfferPrice,
        initialStock,
        setInitialStock,
        minStockAlert,
        setMinStockAlert,
        IsLoadingProduct,
        errorMessage,
        submitProduct,
        categories,
        isLoadingCategories,
        isCategoriesShowModal,
        setIsCategoriesShowModal,
        selectedCategoryName,
        setSelectedCategoryName
    } = useCreateProduct()

    const [errors, setErrors] = useState<FieldErrors>({})

    const setFieldError = (key: string, message: string | null) =>
        setErrors((prev) => ({ ...prev, [key]: message }))

    const onChangeName = (text: string) => {
        const clean = filterLetters(text)
        setFieldError("name", clean !== text ? "El nombre solo puede contener letras, no números ni símbolos" : null)
        setName(clean)
    }

    const onChangeSku = (text: string) => {
        const clean = text.replace(/[^A-Za-z0-9-]/g, "")
        setFieldError("sku", clean !== text ? "El SKU solo puede contener letras, números y guiones" : null)
        setSku(clean)
    }

    const onChangeDescription = (text: string) => {
        setDescription(text)
        setFieldError("description", null)
    }

    const onChangeDecimal = (text: string, key: string, label: string, setter: (v: string) => void) => {
        const clean = filterDecimal(text)
        setFieldError(key, clean !== text ? `${label} solo puede contener números (ej. 3.50)` : null)
        setter(clean)
    }

    const onChangeInteger = (text: string, key: string, label: string, setter: (v: string) => void) => {
        const clean = filterDigits(text)
        setFieldError(key, clean !== text ? `${label} solo puede contener números enteros` : null)
        setter(clean)
    }

    const onSave = () => {
        const regular = parseFloat(regularPrice)
        const offer = parseFloat(offerPrice)

        let regularError = validateDecimal(regularPrice, "El precio regular")
        if (!regularError && regular <= 0) regularError = "El precio regular debe ser mayor a 0"

        let offerError: string | null = null
        if (offerPrice.trim()) {
            offerError = validateDecimal(offerPrice, "El precio de oferta")
            if (!offerError && offer > regular) offerError = "El precio de oferta no puede ser mayor al regular"
        }

        const result: FieldErrors = {
            name: validateLetters(name, "El nombre del producto"),
            category: categoryId ? null : "Selecciona una categoría",
            sku: !sku.trim() ? "El SKU es obligatorio" : null,
            description: !description.trim()
                ? "La descripción es obligatoria"
                : description.trim().length < 5
                    ? "La descripción debe tener al menos 5 caracteres"
                    : null,
            regularPrice: regularError,
            offerPrice: offerError,
            initialStock: validateInteger(initialStock, "El stock inicial"),
            minStockAlert: minStockAlert.trim()
                ? validateInteger(minStockAlert, "El stock mínimo") ||
                  (!validateInteger(initialStock, "El stock inicial") && parseInt(minStockAlert, 10) > parseInt(initialStock, 10)
                      ? "El stock mínimo no puede ser mayor al stock inicial"
                      : null)
                : null,
        }
        setErrors(result)

        const messages = Object.values(result).filter((m): m is string => !!m)
        if (messages.length > 0) {
            console.log("VALIDACION PRODUCTO:", messages)
            Alert.alert("Revisa los datos", messages.join("\n"))
            return
        }
        submitProduct()
    }

    return (
        <SafeAreaView
            style={styles.container}

        >
            <Drawer.Screen options={{ headerShown: false }} />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? 'padding' : "height"}
                style={{ flex: 1 }}
            >

                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => {
                            router.replace("/(protected)/dashboard")
                        }}
                    >
                        <Ionicons name='arrow-back-outline' size={16} />
                    </TouchableOpacity>
                    <View style={styles.titleWrapper}>
                        <Text style={styles.headerTitle}>ADMIN PORTAL</Text>
                        <Text style={styles.headerSubTitle}>Nuevo Producto</Text>
                    </View>
                </View>

                <ScrollView style={styles.scrollContent}>
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Feather name='clipboard' size={20} color="#006c47" />
                            <Text style={styles.cardTitle}>Informacion General</Text>
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>
                                nombre del producto
                            </Text>
                            <TextInput
                                placeholder='Ej. Zapato Nike'
                                style={[styles.textInput, !!errors.name && styles.inputError]}
                                value={name}
                                onChangeText={onChangeName}
                            />
                            <FieldError message={errors.name} />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Categoriaaa</Text>
                            <TouchableOpacity
                                style={[styles.selectorInput, !!errors.category && !categoryId && styles.inputError]}
                                onPress={() => setIsCategoriesShowModal(true) }
                            >
                                <Text>{selectedCategoryName || "seleccionar categoria"}</Text>
                                <Feather
                                    name='chevron-down'
                                    size={20}
                                />
                            </TouchableOpacity>
                            {!categoryId && <FieldError message={errors.category} />}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>SKU / codigo de barra</Text>
                            <View style={[styles.inputWithIcon, !!errors.sku && styles.inputError]}>
                                <MaterialCommunityIcons
                                    name='barcode-scan'
                                    size={20}
                                    style={{ marginRight: 10 }}
                                />
                                <TextInput
                                    placeholder='PR-7878787878'
                                    style={styles.textInputScan}
                                    autoCapitalize='characters'
                                    value={sku}
                                    onChangeText={onChangeSku}
                                />

                            </View>
                            <FieldError message={errors.sku} />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>descripcion detallada</Text>
                            <TextInput
                                placeholder='describe los atributos principales'
                                multiline
                                numberOfLines={5}
                                textAlignVertical='top'
                                maxLength={2000}
                                style={[styles.textAreaInput, !!errors.description && styles.inputError]}
                                value={description}
                                onChangeText={onChangeDescription}
                            />
                            <FieldError message={errors.description} />
                        </View>
                        <View style={styles.chartCounterDescription}>
                            <Text>{description.length}/2000</Text>
                        </View>
                    </View>
                    {/* precio de producto */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Feather
                                name='dollar-sign'
                                size={20}
                                color="#006c47"
                                style={{ marginRight: 10 }}
                            />
                            <Text style={styles.cardTitle}>Precios de Inventario</Text>
                        </View>

                        <View>
                            <View style={styles.rowCols}>

                                <View style={styles.col}>
                                    <Text style={styles.inputLabel}>Precio Regular</Text>
                                    <View style={[styles.inputPriceWrapper, !!errors.regularPrice && styles.inputError]}>
                                        <Text style={{ marginRight: 6 }}>$</Text>
                                        <TextInput
                                            placeholder='0.0'
                                            keyboardType='decimal-pad'
                                            style={styles.priceInput}
                                            value={regularPrice}
                                            onChangeText={(text) => onChangeDecimal(text, "regularPrice", "El precio regular", setRegularPrice)}
                                        />
                                    </View>
                                    <FieldError message={errors.regularPrice} />
                                </View>

                                <View style={styles.col}>
                                    <Text style={styles.inputLabel}>Precio de Oferta</Text>
                                    <View style={[styles.inputPriceWrapper, !!errors.offerPrice && styles.inputError]}>
                                        <Text style={{ marginRight: 6 }}>$</Text>
                                        <TextInput
                                            placeholder='0.0'
                                            keyboardType='decimal-pad'
                                            style={styles.priceInput}
                                            value={offerPrice}
                                            onChangeText={(text) => onChangeDecimal(text, "offerPrice", "El precio de oferta", setOfferPrice)}
                                        />
                                    </View>
                                    <FieldError message={errors.offerPrice} />
                                </View>


                            </View>

                            <View style={styles.rowCols}>

                                <View style={styles.col}>
                                    <Text style={styles.inputLabel}>Stock Inicial</Text>
                                    <View style={[styles.inputPriceWrapper, !!errors.initialStock && styles.inputError]}>
                                        <Text style={{ marginRight: 6 }}>$</Text>
                                        <TextInput
                                            placeholder='50'
                                            keyboardType='number-pad'
                                            style={styles.priceInput}
                                            value={initialStock}
                                            onChangeText={(text) => onChangeInteger(text, "initialStock", "El stock inicial", setInitialStock)}
                                        />
                                    </View>
                                    <FieldError message={errors.initialStock} />
                                </View>

                                <View style={styles.col}>
                                    <Text style={styles.inputLabel}>Stock Minimo</Text>
                                    <View style={[styles.inputPriceWrapper, !!errors.minStockAlert && styles.inputError]}>
                                        <Text style={{ marginRight: 6 }}>$</Text>
                                        <TextInput
                                            placeholder='5'
                                            keyboardType='number-pad'
                                            style={styles.priceInput}
                                            value={minStockAlert}
                                            onChangeText={(text) => onChangeInteger(text, "minStockAlert", "El stock mínimo", setMinStockAlert)}
                                        />
                                    </View>
                                    <FieldError message={errors.minStockAlert} />
                                </View>


                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.btnSave}
                            onPress={onSave}
                            disabled={IsLoadingProduct}
                        >
                            {IsLoadingProduct ? (
                                <ActivityIndicator color="#fff" size="small" />
                            ) : (
                                <>
                                    <Ionicons name="checkmark-outline" size={22} color={"#fff"} style={styles.checkIcon} />
                                    <Text style={styles.btnSaveText}>Guardar producto</Text>
                                </>
                            )}
                        </TouchableOpacity>

                    </View>
                </ScrollView>

            </KeyboardAvoidingView>

            <Modal
                visible={isCategoriesShowModal}
                transparent
                animationType='slide'
                onRequestClose={() => setIsCategoriesShowModal(false)}
            >
                <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text>seleccionar categorias</Text>
                                <TouchableOpacity
                                    onPress={()=>{setIsCategoriesShowModal(false)}}
                                >
                                    <Feather name='x' size={22} color="#374151"/>
                                </TouchableOpacity>

                                
                            </View>
                            {isLoadingCategories?(
                                    <ActivityIndicator size={"large"} color="#006c47"/>
                                ):(
                                    <FlatList
                                        data={categories}
                                        keyExtractor={(item)=>item.id.toString()}
                                        renderItem={({item})=>{
                                            const isSelected=item.id===categoryId
                                            return(
                                                <TouchableOpacity style={[styles.categoyOption, isSelected && styles.categoyOptionSelected]}
                                                    onPress={()=>{
                                                        setCategoryId(item.id)
                                                        setSelectedCategoryName(item.name)
                                                        setIsCategoriesShowModal(false)
                                                    }}
                                                >
                                                    <Text style={[styles.categoyOptionText, isSelected && styles.categoyOptionTextSelected]}>{item.name}</Text>
                                                    {isSelected && <Feather name='check' size={18} color={"#006c47"}/>}
                                                </TouchableOpacity>
                                            )
                                        }}
                                    />
                                )}
                        </View>
                </View>

            </Modal>
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
        backgroundColor: "#f9fafb"
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
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 16
    },
    card: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 12,
        elevation: 2
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#111827",
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
    selectorInput: {
        height: 48,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 14,
        borderColor: "#e5e7eb",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    inputWithIcon: {
        height: 48,
        borderWidth: 1,
        flexDirection: "row",
        borderColor: "#e5e7eb",
        paddingHorizontal: 14,
        borderRadius: 10,
        alignItems: "center"
    },
    textInputScan: {
        flex: 1,
        padding: 0
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
    chartCounterDescription: {
        flexDirection: "row",
        justifyContent: "flex-end"

    },
    rowCols: {
        flexDirection: "row",
        gap: 8
    },
    col: {
        flex: 1,
        marginBottom: 5
    },
    inputPriceWrapper: {
        height: 48,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 10,
        paddingHorizontal: 14,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff"
    },
    priceInput: {
        flex: 1,
        padding: 0,
    },
    btnSave: {
        backgroundColor: "#006c47",
        height: 48,
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
        marginTop: 15
    },
    checkIcon: {
        marginRight: 8
    },
    btnSaveText: {
        color: "#fff",
        fontSize: 15
    },
    modalOverlay:{
        flex:1,
        backgroundColor:"rgba(0,0,0,0.4)",
        justifyContent:"flex-end"
    },
    modalContent:{
        backgroundColor:"#ffffff",
        padding:20,
        maxHeight:"60%",
        borderTopLeftRadius:20,
        borderTopRightRadius:20
    },
    modalHeader:{
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        marginBottom:16,
        paddingBottom:10,
        borderBottomWidth:1,
        borderBottomColor:"#e5e5eb"
    },
    categoyOption:{
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        paddingVertical:14,
        paddingHorizontal:12,
        borderRadius:8
    },
    categoyOptionSelected:{
        backgroundColor:"#ecfdf5"
    },
    categoyOptionText:{
        fontSize:16,
        color:"#374151"
    },
    categoyOptionTextSelected:{
        color:"#006c47",
        fontWeight:"600"
    }
})