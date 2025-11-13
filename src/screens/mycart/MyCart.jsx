import { View, Text, StyleSheet } from 'react-native'
import React, { useContext } from 'react'
import Header from '../../components/header/Header'
// import Entypo from '@expo/vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../../context/UserContext';
import EntypoIcon from 'react-native-vector-icons/Entypo';

const MyCart = () => {
    const navigation = useNavigation()
    const { cart } = useContext(UserContext)
    return (
        <View style={{ flex: 1 }}>
            <Header
                inhome={false}
                page={"Cart"}
            />
            <View style={styles.tables}>
                {
                    cart?.length === 0 ? <Text style={{ fontFamily: "Jost_600SemiBold", fontSize: 16, textAlign: "center" }}>No Booking has been done yet</Text> :
                        cart?.map((c) => (
                            <View key={c.id} style={styles.table}>
                                <Text style={styles.tablenumber}>Table Number : {c?.table}</Text>
                                <View style={styles.right}>
                                    <Text style={styles.item}>Item: {c?.food?.length}</Text>
                                    <EntypoIcon name="eye" size={19} color="#fff" style={styles.eye} onPress={() => {
                                        navigation.navigate("table-details", {
                                            order: false,
                                            addfood: false,
                                            fromcart: true,
                                            buttons: true,
                                            table: c?.table
                                        })
                                    }} />
                                </View>
                            </View>
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