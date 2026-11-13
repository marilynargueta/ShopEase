import { apiClient } from "@/api/ApiClient"
import axios from "axios"

export interface CategoryResponse{
    id:number
    name:string
    description?:string
    createdAt:string
    updatedAt:string
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
            console.log("CATEGORIAS DEL SERVIDOR:", serverList.length, serverList.map((c) => c.name))
            return serverList
            
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
            return response.data

        }catch(error){
            if(axios.isAxiosError(error) && error.response){
                throw new Error(error.response.data?.message || "error to save category")
            }
            throw new Error("error al sevidor")
        }
    }
}