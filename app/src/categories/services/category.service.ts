import { apiClient } from "@/api/ApiClient"
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"

export interface CategoryResponse{
    id:number
    name:string
    description?:string
    createdAt:string
    updatedAt:string
}

const STORAGE_KEY = "created_categories"

// lee las categorias creadas desde la app, guardadas en el telefono
const loadCreatedCategories = async (): Promise<CategoryResponse[]> => {
    try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY)
        return raw ? JSON.parse(raw) : []
    } catch {
        return []
    }
}

const saveCreatedCategory = async (category: CategoryResponse) => {
    try {
        const current = await loadCreatedCategories()
        if (!current.some((c) => c.id === category.id)) {
            current.push(category)
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(current))
        }
    } catch (e) {
        console.log("no se pudo guardar la categoria localmente")
    }
}

export const CategoryService={
    getCategories:async(token:string):Promise<CategoryResponse[]>=>{
        try{
            const authTokenHeader=token.startsWith("Bearer ")?token:`Bearer ${token}`
            const response= await apiClient.get<CategoryResponse[]>(
                `/categories?limit=500`,
                {
                    headers:{
                        Authorization:authTokenHeader
                    }
                }
            )
            const serverList: CategoryResponse[] = Array.isArray(response.data) ? response.data : []

            // suma las categorias creadas desde la app que el servidor no devolvio
            const created = await loadCreatedCategories()
            const missing = created.filter(
                (c) => !serverList.some((s) => s.id === c.id)
            )
            return [...serverList, ...missing]
            
        }catch(error){
            if(axios.isAxiosError(error)&& error.response){
                throw new Error(error.response.data?.message || "error to get categories")
            }
            throw new Error("server error")
        }
    },

    createCategory:async(
        name:string,
        description:string,
        token: string | null
    ): Promise<CategoryResponse>=>{
        try{
            const authTokenHeader=token?.startsWith("Bearer")?token :`Bearer ${token}`

            const response= await apiClient.post(
                `/categories/create`,
                {
                    name,
                    description
                },
                {
                    headers:{
                        Authorization:authTokenHeader,
                        "Content-Type":"application/json"
                    }
                }
            )
            await saveCreatedCategory(response.data)
            return response.data

        }catch(error){
            if(axios.isAxiosError(error) && error.response){
                throw new Error(error.response.data?.message || "error to save category")
            }
            throw new Error("error al sevidor")
        }
    }
}