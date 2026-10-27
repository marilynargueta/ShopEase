import { useRouter } from "expo-router";
import { useState } from "react";
import { AdminProfile } from "../models/drawer.model";
import { DrawerItemOption } from "../models/drawer.model";

export function useDrawer(){
    const router= useRouter()

    const [profile]=useState<AdminProfile>({
       name: "admin user",
       role:"system managment",
       avatarUrl:"https://img.freepik.com/vector-gratis/ilustracion-dibujos-animados-tulipan-dibujado-mano_52683-124954.jpg?w=1800",
       version:"v4.4.4"
    })

    const navigationOptions:DrawerItemOption[]=[
        {name:"dashboard", label:"Dashboard", icon:"grid"},
        {name:"orders", label:"Orders", icon:"package"},
        {
            name:"inventory",
            label:"Inventory",
            icon:"archive",
            subItems:[
                {
                    name:"inventory",
                    label:"Category",
                    icon:"folder"
                },
                {
                    name:"create-product",
                    label:"Products",
                    icon:"file-text"
                },
                {
                    name:"create-service",
                    label:"Servicios",
                    icon:"service"
                }
            ]
        }

    ]

    return {
        profile,
        navigationOptions
    }
}