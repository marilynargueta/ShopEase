import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { ProductService } from "../service/product.service";
import { CategoryResponse, CategoryService } from "../../categories/services/category.service";

export function useCreateProduct() {
    const router = useRouter()
    const { token } = useAuth()

    const [name, setName] = useState("")
    const [categoryId, setCategoryId] = useState<null | number>(null)
    const [sku, setSku] = useState("")
    const [categories, setCategories] = useState<CategoryResponse[]>([])
    const [isLoadingCategories, setIsLoadingCategories] = useState(false)
    const [isCategoriesShowModal, setIsCategoriesShowModal] = useState(false)
    const [description, setDescription] = useState("")
    const [regularPrice, setRegularPrice] = useState("")
    const [offerPrice, setOfferPrice] = useState("")
    const [initialStock, setInitialStock] = useState("")
    const [minStockAlert, setMinStockAlert] = useState("")
    const [IsLoadingProduct, setIsLoadingProduct] = useState(false)
    const [errorMessage, setErrorMessage] = useState<null | string>("")
    const [selectedCategoryName, setSelectedCategoryName] = useState("")

    useEffect(() => {
        if (token) {
            fetchCategories()
        }
    }, [token])

    const fetchCategories = async () => {
        if (!token) return
        setIsLoadingCategories(true)
        try {
            const data = await CategoryService.getCategories(token)
            setCategories(data)
        } catch (error: any) {
            console.log("error al cargar las categorias", error.message)
        }
        finally {
            setIsLoadingCategories(false)
        }
    }

    const submitProduct = async () => {
        if (!name.trim() || !sku.trim() || !regularPrice.trim() || !initialStock.trim()) {
            setErrorMessage("por favor completa datos obligatorios")
            return
        }
        if (!token) {
            setErrorMessage("session obligatoria")
            return
        }

        setErrorMessage(null)
        setIsLoadingProduct(true)

        console.log("product id ", categoryId)

        try {
            await ProductService.createProduct(
                {
                    name: name.trim(),
                    categoryId: Number(categoryId),
                    sku: sku.trim(),
                    description: description.trim(),
                    regularPrice: parseFloat(regularPrice),
                    offerPrice: offerPrice ? parseFloat(offerPrice) : undefined,
                    initialStock: parseInt(initialStock, 10),
                    minStockeAlert: minStockAlert ? parseInt(minStockAlert, 10) : 0
                },
                token
            )
            Alert.alert(
                "¡Producto creado!",
                "El producto fue agregado correctamente.",
                [
                    {
                        text: "Aceptar",
                        onPress: () => router.replace("/(protected)/dashboard")
                    }
                ]
            )
            
        } catch (error: any) {
            setErrorMessage(error.message)
        } finally {
            setIsLoadingProduct(false)
        }
    }
    return {
        name,
        setName,
        categories,
        isLoadingCategories,
        isCategoriesShowModal,
        setIsCategoriesShowModal,
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
        selectedCategoryName,
        setSelectedCategoryName
    }
}
