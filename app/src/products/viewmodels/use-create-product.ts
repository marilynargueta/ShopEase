import { useRouter } from "expo-router";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Alert } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { ProductService } from "../service/product.service";
import { CategoryResponse, CategoryService } from "../../categories/services/category.service";
import { ProductItem } from "../models/product.model";



export function useCreateProduct() {
    const router = useRouter()
    const { token } = useAuth()

    const [name, setName] = useState("")
    const [categoryId, setCategoryId] = useState<null | number>(null)
    const [sku, setSku] = useState("")
    const [categories, setCategories] = useState<CategoryResponse[]>([])
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
    const [product, setProduct] = useState<ProductItem | null>(null)
    const [products, setProducts] = useState<ProductItem[]>([])
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
    const [searchQuery, setSearchQuery] = useState("")


    useEffect(() => {
        if (token) {
            fetchCategories()
        }
    }, [token])

    const fetchProducts = useCallback(async () => {
        if (!token) return
        setIsLoadingProduct(true)
        try {
            if (selectedCategoryId === null) {
                const data = await ProductService.getProductsByCategoryId(1, token)
                setProducts(data)
            } else {
                const data = await ProductService.getProductsByCategoryId(Number(selectedCategoryId), token)
                setProducts(data)
            }
            
        } catch (error) {
            console.log("error al traer los  productos")
            setProducts([])
        }
        finally {
            setIsLoadingProduct(false)
        }


    }, [token, selectedCategoryId], )
    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

    const fetchCategories = async () => {
        if (!token) return
        setIsLoadingCategories(true)
        try {
            const data = await CategoryService.getCategories(token)
            const uniqueCategories = data.filter(
                (c, index, arr) => arr.findIndex((x) => x.name === c.name) === index
            )
            setCategories(uniqueCategories)
        } catch (error: any) {
            console.log("error al cargar las categorias", error.message)
        }
        finally {
            setIsLoadingCategories(false)
        }
    }

    const clearForm = () => {
        setName("")
        setCategoryId(null)
        setSelectedCategoryName("")
        setSku("")
        setDescription("")
        setRegularPrice("")
        setOfferPrice("")
        setInitialStock("")
        setMinStockAlert("")
    }

    const submitProduct = async () => {
        if (!name.trim() || !sku.trim() || !regularPrice.trim() || !initialStock.trim()) {
            setErrorMessage("por favor completa datos obligatorios")
            return
        }
        if (!categoryId) {
            setErrorMessage("por favor selecciona una categoria")
            return
        }
        if (!token) {
            setErrorMessage("session obligatoria")
            return
        }

        setErrorMessage(null)
        setIsLoadingProduct(true)

        try {
            const response = await ProductService.createProduct(
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

            console.log("Respuesta createProduct:", JSON.stringify(response, null, 2))

            Alert.alert(
                "Éxito",
                "Producto creado correctamente",
                [
                    {
                        text: "Aceptar",
                        onPress: () => clearForm()
                    }
                ]
            )

        } catch (error: any) {
            setErrorMessage(error.message)
        } finally {
            setIsLoadingProduct(false)
        }

        const submitProduct = async () => {
    }
    }

    const filteredProducts = useMemo(() => {
        return products?.filter((p) => {
            const query = searchQuery.toLowerCase().trim()
            if (!query) return true
            return {
                name: p.name.toLowerCase().includes(query) ||
                (p.description && p.description.toLowerCase().includes(query))
            }
        })

    }, [products, searchQuery])


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
        setSelectedCategoryName,
        product: filteredProducts,
        searchQuery,
        setSearchQuery,
        refreshProducts: fetchProducts,
        selectedCategoryId,
        setSelectedCategoryId
    }
}