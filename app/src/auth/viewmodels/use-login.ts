import { useState } from "react"
import { AuthService } from "../services/auth.service"
import { useRouter } from "expo-router"
import { useAuth } from "../../context/AuthContext"

export function useLogin(){
    const router=useRouter()
    const {saveSession}=useAuth()
    const [email,setEmail]= useState("")
    const [password,setPassword]=useState("")
    const [isLoading, setIsLoading]=useState(false)
    const [erroMessage, setErrorMessage]=useState<string|null>(null)

    const [isPasswordVisble, setIsPasswordVisble]=useState(false)

    

    const togglePasswordVisibility=()=>{
        setIsPasswordVisble((prev)=>!prev)
    }


    const handleLogin=async()=>{
        if(!email||!password){
            setErrorMessage("please, complete all fields")
            return
        }

        setErrorMessage(null)
        setIsLoading(true)

        try{
            const data= await AuthService.login(email,password)
            console.log("LOGIN RESPONSE:", JSON.stringify(data))
            await saveSession(data.token,data.userResponse)
            router.replace("/(protected)/dashboard")

        } catch(error:any){
            setErrorMessage(error.message)

        }finally{
            setIsLoading(false)

        }
    }

    return{
        email,
        password,
        setEmail,
        setPassword,
        isLoading,
        erroMessage,
        togglePasswordVisibility,
        isPasswordVisble,
        handleLogin
    }
   

    
}