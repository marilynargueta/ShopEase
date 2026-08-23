import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Drawer } from 'expo-router/drawer'
import { DrawerContent } from '@react-navigation/drawer'
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native'
import { useDrawer } from '../src/admin/viewmodels/use-drawer'
import { Feather } from '@expo/vector-icons'

export default function ProtectedLayout() {

    const { profile, navigationOptions } = useDrawer()

    return (
        <GestureHandlerRootView>
            <Drawer
                screenOptions={{
                    headerTintColor: "#006c47"
                }
                }
                drawerContent={(props) => {
                    const activeIndex = props.state.index
                    const activeRouteName = props.state.routeNames[activeIndex]

                    return (
                        <View style={styles.drawerContainer}>
                            <View style={styles.header}>
                                <View style={styles.headerInfoUser}>
                                    <Image
                                        style={styles.avatar}
                                        source={{ uri: profile.avatarUrl }}
                                    >

                                    </Image>
                                    <View style={styles.headerInfo}>
                                        <Text style={styles.adminName}>{profile.name}</Text>
                                         <Text style={styles.adminRole}>{profile.role}</Text>
                                    </View>
                                </View>
                                <View style={styles.versionTag}>
                                    <Text>{profile.version}</Text>
                                </View>
                            </View>
                            <View style={styles.menuList}>
                                {navigationOptions.map((option)=>{
                                    const isSelected=activeRouteName===option.name
                                    return(
                                        <TouchableOpacity
                                            key={option.name}
                                            style={[styles.menuItemList, isSelected && styles.menuItemSelected]}
                                        >
                                            <Feather name={option.icon as any}
                                            size={20} 
                                            color={isSelected?"#fff":"#374151"}
                                            style={styles.menuIcon}></Feather>
                                            <Text style={[styles.menuText, isSelected && styles.menuTextSelected]}>{option.label}</Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                            <TouchableOpacity style={styles.logOutButton}>
                                <Feather name="log-out" size={20} color={"#ef4444"} style={styles.menuIcon}></Feather>
                                <Text style={styles.logOutText}>Log out</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }}
            >

            </Drawer>

        </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({
    drawerContainer: {
        flex: 1,
        paddingTop: 50
    },
    header: {
        padding: 24,
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
        alignItems: "flex-start"
    },
    headerInfoUser: {
        flexDirection: "row"
    },
    avatar: {
        height: 50,
        width: 50,
        borderRadius: 30
    },
    headerInfo:{
        marginLeft:15,
        marginTop:5
    },
    adminName:{
        fontSize:20,
        color:"#006c47",
        fontWeight:"bold"
    },
    adminRole:{
        fontSize:14,
        fontWeight:"bold",
        color:"#6b7280"
    },
    versionTag:{
        borderWidth:1,
        paddingHorizontal:8,
        borderColor:"#d1d5db",
        paddingVertical:2,
        marginTop:8,
        borderRadius:12
    },
    menuList:{
        flex:1,
        paddingTop:16,
        paddingHorizontal:12
    },
    menuItemList:{
         flexDirection:"row",
         alignItems:"center",
         paddingVertical:14,
         paddingHorizontal:16,
         borderRadius:24,
         marginVertical:4
         
    },
    menuItemSelected:{
        backgroundColor:"#00b074"
    },
    menuIcon:{
        marginRight:15
    },
    menuText:{
        fontSize:15,
        fontWeight:"bold",
        color:"#374151"
    },
    menuTextSelected:{
        color:"#fff"
    },
    logOutButton:{
        flexDirection:"row",
        alignItems:"center",
        padding:24,
        borderTopWidth:1,
        borderTopColor:"#e5e7eb",
        marginBottom:15
    },
    logOutText:{
        fontSize:15,
        fontWeight:"bold",
        color:"#ef4444"
    }

})