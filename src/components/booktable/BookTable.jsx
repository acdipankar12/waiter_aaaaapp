import { View, Text, StyleSheet, TouchableOpacity, TextInput, Pressable, ScrollView } from 'react-native'
import React, { useContext, useState } from 'react'
// import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { UserContext } from '../../context/UserContext';
import FeatherIcon from 'react-native-vector-icons/Feather';
const BookTable = ({ setOpenModaltable, setselectedTablenumber, selectedtablenumber, sanitize_dishData }) => {
    const [open, setOpen] = useState(false);
    const [table, settable] = useState(selectedtablenumber);
    const navigation = useNavigation()
    const { cart, setCart, tempFood, setTempFood } = useContext(UserContext)

    const assignTableAndPushToCart = (tableNumber) => {
        if (tempFood.length === 0) {
            Toast.show({
                type: "success",
                text1: "Sorry No Food To Add"
            })
        } else {
            setCart(prev => [
                ...prev,
                {
                    table: tableNumber,
                    food: tempFood
                }
            ]);

            // Clear temp state after pushing
            setTempFood([]);

        }



    };
    return (
        <View style={styles.modalWrapper}>
            <View style={styles.addbox}>
                <Text style={{ fontFamily: "Jost_500Medium", fontSize: 20 }}>Book A Table</Text>
                <View style={styles.wrapper}>
                    <Pressable style={styles.drop} onPress={() => {
                        setOpen(!open)
                    }}>
                        <Text style={styles.placeholder}>{table === 0 ? "Select A Table" : `Select Table ${selectedtablenumber}`}</Text>
                        <FeatherIcon name="chevron-down" size={18} color="#888888" />
                    </Pressable>

                    {open && (
                        <ScrollView contentContainerStyle={{ paddingBottom: 10 }} style={styles.droplist}>
                            {Array.from({ length: 10 }).map((_, i) => (
                                <Text
                                    key={i}
                                    onPress={() => {
                                        setselectedTablenumber(i + 1);
                                        setOpen(false)
                                    }}
                                    style={styles.dropItem}
                                >
                                    Table {i + 1}
                                </Text>
                            ))}
                        </ScrollView>
                    )}
                </View>
                <View style={styles.butt}>
                    <TouchableOpacity
                        onPress={async () => {
                            // if AddFood exposed a sanitize function, call it first to ensure data saved
                            try {
                                if (typeof sanitize_dishData === 'function') {
                                    // console.log('tagle' ,table)
                                    await sanitize_dishData()
                                }
                            } catch (e) {
                                console.log('Error calling sanitize_dishData', e)
                            }

                            assignTableAndPushToCart(table)
                            Toast.show({
                                type: "success",
                                text1: "Success",
                                text2: `Table No ${table} is booked`
                            })
                            console.log(cart)
                            // navigation.navigate("table-details", {
                            //     order: false,
                            //     addfood: true,
                            //     fromcart: false,
                            //     buttons: true,
                            //     table: null
                            // })
                            // setOpenModaltable(false)

                        }}
                        style={styles.modalbutt}>
                        <Text style={{ fontFamily: "Jost_400Regular", color: "#fff" }}>Book</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setOpenModaltable(false)
                        }}
                        style={styles.modalbutt2}>
                        <Text style={{ fontFamily: "Jost_400Regular", color: "#fff" }}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View >
    )
}



const styles = StyleSheet.create({
    modalWrapper: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        position: "absolute",
        // backgroundColor: "#000000B2",
        zIndex: 1
    },
    addbox: {
        width: "85%",
        paddingHorizontal: 14,
        paddingVertical: 30,
        backgroundColor: "#fff",
        top: "20%",
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        gap: 15
    },
    wrapper: {
        width: '100%',
        position: 'relative',
    },
    drop: {
        paddingVertical: 12,
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        borderColor: '#CCCCCC',
        borderWidth: 1,
        borderRadius: 25,
        position: 'relative',
        zIndex: 1,
        maxHeight: 160,
        backgroundColor: '#fff',
    },
    droplist: {
        position: 'absolute',
        top: '100%',
        marginTop: 4,
        padding: 10,
        backgroundColor: '#f5f5f5',
        width: '100%',
        zIndex: 1,
        height: 130,
        paddingBottom: 60,
        borderRadius: 10,
    },
    dropItem: {
        paddingVertical: 4,
        paddingHorizontal: 3,
        fontFamily: "Jost_400Regular"
    },
    placeholder: {
        fontFamily: "Jost_400Regular",
        color: "#888888"
    },
    butt: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 15
    },
    modalbutt: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        backgroundColor: "#0102FD",
    },
    modalbutt2: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        backgroundColor: "#333333",
    }

})

export default BookTable