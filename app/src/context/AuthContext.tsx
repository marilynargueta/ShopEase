import { UserResponse } from "../auth/models/auth.model"
import { createContext, useEffect, useState,useContext} from "react"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthService } from "../auth/services/auth.service";
import { setUnauthorizedHandler } from "@/api/ApiClient"

interface AuthContextType{
    token:string | null
    user:UserResponse | null
    isLoadingSession:boolean
    saveSession:(token:string,user:UserResponse)=>Promise<void>
    clearSession:()=>void
    updateUserSession:(updateUser:UserResponse)=>Promise<void>
}

const AuthContext =createContext<AuthContextType>({} as AuthContextType)

export const AuthProvider:React.FC<{children:React.ReactNode}>=({children})=>{
    const [token,setToken]=useState<string | null>(null)
    const [user,setUser]=useState<UserResponse|null>(null)
    const [isLoadingSession,setIsLoadingSession]=useState(true)

useEffect(() => {
    const loadSession = async () => {
        try {
            const savedToken = await AsyncStorage.getItem("@Auth_token");
            const savedUser = await AsyncStorage.getItem("@Auth_user");
            if (savedToken && savedUser) {
                try {
                    const isValid = await AuthService.validateToken(savedToken)
                    if (isValid) {
                        setToken(savedToken)
                        setUser(JSON.parse(savedUser))
                    } else {
                        await AsyncStorage.multiRemove(["@Auth_token", "@Auth_user"])
                    }
                } catch (error) {
                    // error de red o servidor: no se cierra la sesion
                    setToken(savedToken)
                    setUser(JSON.parse(savedUser))
                }
            }
        } catch (error) {
            console.log("error al cargar la sesion", error)
        } finally {
            setIsLoadingSession(false)
        }
    }
    loadSession()
}, [])

    const saveSession= async (newToken:string,newUser:UserResponse)=>{
        try{
            await AsyncStorage.setItem("@Auth_token", newToken)
            await AsyncStorage.setItem("@Auth_user",JSON.stringify(newUser))
            console.log("se guardo la session")
            setToken(newToken)
            setUser(newUser)
        }catch(error){
            console.log("error al persistir  la data", error)
        }
    }

    const updateUserSession=async(updateUser:UserResponse)=>{
        try{
            await AsyncStorage.setItem("@Auth_user",JSON.stringify(updateUser))
            setUser(updateUser)

        }catch(error){
            console.log("error al actualizar la data",error)
        }
    }

    const clearSession=async()=>{
        try{
            await AsyncStorage.removeItem("@Auth_token")
            await AsyncStorage.removeItem("@Auth_user")
            console.log("se cerro la session")
            setToken(null)
            setUser(null)
        }catch(error){
            console.log("error al persistir  la data", error)
        }
    }

    useEffect(() => {
        setUnauthorizedHandler(() => { clearSession() })
        return () => setUnauthorizedHandler(null)
    }, [])

    return <AuthContext.Provider value={{token,user,isLoadingSession, saveSession,updateUserSession,clearSession}}>
        {children}
    </AuthContext.Provider>
}

export const useAuth=()=>useContext(AuthContext)