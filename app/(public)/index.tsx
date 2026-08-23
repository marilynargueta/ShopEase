import { useState } from "react";
import { Image,StyleSheet,Text,View,TouchableOpacity, KeyboardAvoidingView, Platform,ScrollView, TextInput, ActivityIndicator } from "react-native";
import { useLogin } from "../src/auth/viewmodels/use-login";

import {Feather} from "@expo/vector-icons"
import { useRouter } from "expo-router";

export default function LoginScreen(){

    const router= useRouter()

    const {
        email,
        password,
        setEmail,
        setPassword,
        isLoading,
        erroMessage,
        isPasswordVisble,
        togglePasswordVisibility,
        handleLogin        

    }=useLogin()

    return(
        <KeyboardAvoidingView
            style={styles.container} 
            behavior={Platform.OS==="android"? "padding": "height"}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Feather name="shopping-bag" size={25} color={"#ba1d1d"} ></Feather>
                    </View>
                    <Text style={styles.appNameLabel}> shop easy</Text>
                    <Text style={styles.welcomeLabel}>welcome back! please enter your details</Text>
                </View>
                {/* card */}
                <View style={styles.card}>

                    {erroMessage &&(
                        <View style={styles.erroContainer}>
                            <Text style={styles.errorText}>{erroMessage}</Text>
                        </View>
                    )}

                    <Text style={styles.label}>Email Address</Text>
                    <View style={styles.inputContainer}>
                        <Feather name="mail" size={20} color="#9ca3af" ></Feather>
                        <TextInput
                            style={styles.input}
                            value={email}
                            autoCapitalize="none"
                            onChangeText={setEmail}
                            placeholder="name@gmail.com"
                            keyboardType="email-address"
                        >

                        </TextInput>
                    </View>

                    <View style={styles.passwordRow}>
                        <Text style={styles.label}>password</Text>
                        <TouchableOpacity>
                            <Text style={styles.forgotPassword}>Forgot Password</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputContainer}>
                        <Feather name="lock" size={20} color="#9ca3af"></Feather>
                        <TextInput
                            style={styles.input}
                            value={password}
                            autoCapitalize="none"
                            onChangeText={setPassword}
                            placeholder="**********"
                            secureTextEntry={isPasswordVisble?true:false}
                        >

                        </TextInput>
                        <TouchableOpacity
                        onPress={togglePasswordVisibility}
                        >
                            <Feather name={isPasswordVisble?"eye-off":"eye"} size={20} color={"#9ca3af"}></Feather>
                        </TouchableOpacity>
                    </View>

                    {isLoading ? (
                        <ActivityIndicator size="large" color="#006c47"></ActivityIndicator>
                    ):(
                        <TouchableOpacity
                        style={styles.buttonLogin}
                        onPress={handleLogin}
                    >
                        <Text style={styles.buttonLoginText}>Log in</Text>
                    </TouchableOpacity>
                    )}

                </View>

                <View style={styles.signUpRow}>
                    <Text style={styles.signUpTex}>Does not have account</Text>
                    <TouchableOpacity
                        onPress={()=>router.push("/(public)/register")}
                    >
                        <Text style={styles.signUpTexLink}>Sign up for free</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>

        
    )
    
}

const styles=StyleSheet.create({
    container:{
        flex:1
    },
    scrollContainer:{
        flexGrow:1,
        justifyContent:"center",
        padding:24
    },
    header:{
       alignItems:"center" 
    },
    logoContainer:{
        width:60,
        height:60,
        backgroundColor:"#00b074",
        justifyContent:"center",
        alignItems:"center",
        borderRadius:16
    },
    appNameLabel:{
        fontSize:32,
        fontWeight:"bold",
        color:"#006c47"
    },
    welcomeLabel:{
        fontSize:15,
        color:"#6b7289",
        marginBottom:25
    },
    card:{
        backgroundColor:"#fff",
        borderWidth:1,
        padding:24,
        borderColor:"#f3f4f6",
        borderRadius:14,
        shadowColor:"#fff",
        shadowOffset:{width:0,height:2},
        elevation:2,
        shadowOpacity:0.03,
        shadowRadius:8
    },
    label:{
        fontSize:14,
        color:"#160707d2",
        marginBottom:10
    },
    inputContainer:{
        flexDirection:"row",
        alignItems:"center",
        borderWidth:1,
        borderColor:"#d1d5db",
        paddingHorizontal:12,
        height:50,
        marginBottom:15
    },
    input:{
        flex:1,
        height:"100%",
        marginLeft:8,
        borderRadius:8
    },
    passwordRow:{
        flexDirection:"row",
        justifyContent:"space-between"
    },
    forgotPassword:{
        color:"#006c47",
        fontWeight:600
    },
    buttonLogin:{
        borderWidth:1,
        justifyContent:"center",
        alignItems:"center",
        height:50,
        borderRadius:8,
        backgroundColor:"#006c47"
    },
    buttonLoginText:{
        color:"#fff",
        fontSize:16,
        fontWeight:"bold"
    },
    signUpRow:{
        flexDirection:"row",
        justifyContent:"center",
        marginTop:35,
    },
    signUpTex:{
        fontSize:14,
        color:"#6b7280"
    },
    signUpTexLink:{
        fontSize:14,
        fontWeight:"bold",
        color:"#006c47"
    },
    erroContainer:{
        borderWidth:1,
        padding:12,
        borderRadius:8,
        marginBottom:20,
        backgroundColor:"#fef2f2",
        borderColor:"#fca5a5"
    },
    errorText:{
        fontSize:15,
        textAlign:"center",
        color:"#DC2626",
        fontWeight:"500"
    }
})