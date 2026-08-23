import { AuthResponse } from "../models/auth.model";
import axios from "axios"

const API_URL="https://api-ecommerce-5aby.onrender.com"

export const AuthService={
    login:async(email:string,password:string):Promise<AuthResponse>=>{
        try{
            const response=await axios.post(`${API_URL}/auth/login`,{
                email,
                password,
            })

            return response.data
        } catch(error){
            if(axios.isAxiosError(error) && error.response){
                throw new Error(error.response.data?.message || "error al iniciar session")
            }
            throw new Error("error al sevidor")
        }

    },
    register:async(
        name:string,
        lastname:string,
        phone:string,
        email:string,
        password:string
    )=>{
        try{
            const response=await axios.post(`${API_URL}/auth/register`,{
                name,
                lastname,
                phone,
                email,
                password
            })
            console.log(response.data)
        } catch(error:any){
            if(axios.isAxiosError(error) && error.response){
                throw new Error(error.response.data?.messagen || error.response.data?.Message || "error del servidor al registrarse")
            }
            throw new Error("error al sevidor")
        }
    }
}