import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect } from 'react'
import Header from '../../components/header/Header'
// import Entypo from '@expo/vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../../context/UserContext';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { _retrieveStoreData, navigationRef } from '../../utils/store';

const MyCart = () => {
    const navigation = useNavigation()
    const { state } = useContext(UserContext)

    async function retivecartdata() {
        let cart_data = await _retrieveStoreData('user_cart_data')
        console.log('cart ditemdata', cart_data)
    }
    useEffect(() => {

        retivecartdata()
    }, [])
    return (
        <View style={{ flex: 1 }}>
            <Header
                inhome={false}
                page={"Cart"}
            />
            <View style={styles.tables}>
                {
                    state?.cart_data?.length === 0 ? <Text style={{ fontFamily: "Jost_600SemiBold", fontSize: 16, textAlign: "center" }}>No Booking has been done yet</Text> :
                        state?.cart_data?.map((c) => (
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate('table-details', { table_details: c })
                                }}
                                key={c.table_number} style={styles.table}>
                                <Text style={styles.tablenumber}>Table Number : {c?.table_number}</Text>
                                <View style={styles.right}>
                                    <Text style={styles.item}>Item: {c?.dishdata?.length}</Text>
                                    <EntypoIcon name="eye" size={19} color="#fff" style={styles.eye} onPress={() => {
                                        // navigation.navigate("table-details", {
                                        //     order: false,
                                        //     addfood: false,
                                        //     fromcart: true,
                                        //     buttons: true,
                                        //     table: c?.table_number
                                        // })
                                    }} />
                                </View>
                            </TouchableOpacity>
                        ))
                }


            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    tables: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        gap: 15
    },
    table: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 10
    },
    tablenumber: {
        fontSize: 16,
        fontFamily: "Jost_500Medium"
    },
    right: {
        alignItems: "center",
        flexDirection: "row",
        gap: 12
    },
    item: {
        fontSize: 16,
        fontFamily: "Jost_500Medium",
        color: "#08D61D"
    },
    eye: {
        padding: 8,
        backgroundColor: "#08D61D",
        borderRadius: 20
    }
})


export default MyCart