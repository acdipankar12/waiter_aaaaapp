import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import check from "../../../assets/checked.png"
import { useNavigation } from '@react-navigation/native'

const Completed = ({ setCompleted }) => {
    const navigation = useNavigation()

    return (
        <View style={{ width: "100%", height: "100%", position: "absolute", zIndex: 1, backgroundColor: "#00000099", alignItems: "center" }}>
            <View style={{ width: "90%", backgroundColor: "#fff", paddingVertical: 20, alignItems: "center", justifyContent: "center", gap: 15, top: "20%", borderRadius: 20 }}>
                <Image style={{ width: 60, height: 60, objectFit: "contain" }} source={check}></Image>
                <Text style={{ fontSize: 25, fontFamily: "Jost_600SemiBold" }}>Congratulations</Text>
                <Text style={{ fontSize: 18, fontFamily: "Jost_400Regular" }}>Your Order Is Completed</Text>
                <TouchableOpacity
                    onPress={() => {
                        setCompleted(false)
                        navigation.navigate('order-list')

                    }}
                    style={{ backgroundColor: "#0102FD", paddingVertical: 10, paddingHorizontal: 30, borderRadius: 10 }}
                >
                    <Text style={{ fontSize: 16, fontFamily: "Jost_600SemiBold", color: "#fff" }}>Ok</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Completed