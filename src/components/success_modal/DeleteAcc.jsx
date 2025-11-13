import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import delacc from "../../../assets/delacc.png"

const DeleteAcc = ({ setDeleteModal }) => {
    return (
        <View style={{ width: "100%", height: "100%", position: "absolute", zIndex: 1, backgroundColor: "#00000099", alignItems: "center" }}>
            <View style={{ width: "90%", backgroundColor: "#fff", paddingVertical: 20, alignItems: "center", justifyContent: "center", gap: 15, top: "20%", borderRadius: 20 }}>
                <Image style={{ width: 60, height: 60, objectFit: "contain" }} source={delacc}></Image>

                <Text style={{ fontSize: 18, fontFamily: "Jost_500Medium", textAlign: "center", width: "85%", }}>Are you sure , Do you want to
                    delete your account?</Text>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 }}>
                    <TouchableOpacity
                        onPress={() => {
                            setDeleteModal(false)
                        }}
                        style={{ backgroundColor: "#0102FD", paddingVertical: 10, paddingHorizontal: 30, borderRadius: 10 }}
                    >
                        <Text style={{ fontSize: 16, fontFamily: "Jost_600SemiBold", color: "#fff" }}>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity

                        style={{ backgroundColor: "#0102FD", paddingVertical: 10, paddingHorizontal: 30, borderRadius: 10 }}
                    >
                        <Text style={{ fontSize: 16, fontFamily: "Jost_600SemiBold", color: "#fff" }}>No</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default DeleteAcc