import { View, Text, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import Header from '../../components/header/Header'
import { orderListstyles } from './styles'
// import Ionicons from '@expo/vector-icons/Ionicons';
// import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../../context/UserContext';

const OrderList = () => {
    const navigation = useNavigation()
    const { cart } = useContext(UserContext)
    return (
        <View style={{ flex: 1 }}>
            <Header
                inhome={false}
                page={"Order List"}
            />
            <View style={orderListstyles.orderWrapper}>
                {
                    cart?.length === 0 ? <Text style={{ fontFamily: "Jost_600SemiBold", fontSize: 16, textAlign: "center" }}>No Past Order yet</Text> :
                        cart?.map((c) => (
                            <View style={orderListstyles.orderBox}>
                                <View style={orderListstyles.head}>
                                    <Text style={{ fontFamily: "Jost_600SemiBold", fontSize: 17 }}>Jhon</Text>
                                    <View style={orderListstyles.headtiming}>
                                        <View style={orderListstyles.flexRow}>
                                            {/* <Ionicons name="time-outline" size={16} color="#0102FD" /> */}
                                            <Text
                                                style={{ fontFamily: "Jost_400Regular", color: "#888888" }}
                                            >
                                                06:50 pm
                                            </Text>
                                        </View>
                                        <View style={orderListstyles.flexRow}>
                                            {/* <AntDesign name="calendar" size={16} color="#0102FD" /> */}
                                            <Text style={{ fontFamily: "Jost_400Regular", color: "#888888" }}>
                                                07/30/2024
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={orderListstyles.second}>
                                    <View
                                        style={orderListstyles.flexRow}
                                    >
                                        <Text style={{ fontFamily: "Jost_600SemiBold", fontSize: 15 }}>
                                            Order Id
                                        </Text>
                                        <Text style={{ fontFamily: "Jost_400Regular", fontSize: 15, color: "#888888" }}>
                                            #5454545
                                        </Text>
                                    </View>
                                    <Text style={{ fontFamily: "Jost_600SemiBold", fontSize: 14, color: "#0102FD" }}>$19.90</Text>
                                </View>
                                <TouchableOpacity onPress={() => {
                                    navigation.navigate("table-details", {
                                        order: true,
                                        addfood: false,
                                        fromcart: false,
                                        buttons: false,
                                        table: c?.table
                                    })
                                }} style={orderListstyles.butt}>
                                    <Text style={orderListstyles.butttext}>View Order</Text>
                                </TouchableOpacity>
                            </View>
                        ))
                }
            </View>
        </View>
    )
}

export default OrderList