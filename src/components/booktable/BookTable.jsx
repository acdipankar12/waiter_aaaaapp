import { View, Text, StyleSheet, TouchableOpacity, TextInput, Pressable, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
// import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
// import Toast from 'react-native-toast-message';
import Toast from "react-native-simple-toast";

import { UserContext } from '../../context/UserContext';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

const BookTable = ({ setOpenModaltable, setselectedTablenumber, selectedtablenumber, sanitize_dishData, setOpenModal }) => {
    const [open, setOpen] = useState(false);
    const [table, settable] = useState(selectedtablenumber);
    const navigation = useNavigation()
    const { cart, setCart, tempFood, setTempFood, state } = useContext(UserContext)

    useEffect(() => {
        settable(table)
    }, [table])
    const assignTableAndPushToCart = (tableNumber) => {
        if (tempFood.length === 0) {
            Toast.show('Sorry No Food To Add', Toast.SHORT, Toast.BOTTOM);
            // Toast.show({
            //     type: "success",
            //     text1: "Sorry No Food To Add"
            // })
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


    const data = [
        { label: ' 1', value: '1' },
        { label: ' 2', value: '2' },
        { label: ' 3', value: '3' },
        { label: ' 4', value: '4' },
        { label: ' 5', value: '5' },
        { label: ' 6', value: '6' },
        { label: ' 7', value: '7' },
        { label: ' 8', value: '8' },
        { label: ' 9', value: '9' },
        { label: ' 10', value: '10' },
    ];

    const DropdownComponent = () => {
        const [value, setValue] = useState(selectedtablenumber ? String(selectedtablenumber) : null);
        const _tablenumber = state?.cart_data?.filter(item => item?.table_number)
        // Extract table numbers from the filtered array
        const tableNumbers = _tablenumber?.map(item => String(item?.table_number)) || [];

        // Update value when selectedtablenumber prop changes
        useEffect(() => {
            if (selectedtablenumber) {
                setValue(String(selectedtablenumber));
            }
        }, [selectedtablenumber]);

        const renderItem = item => {
            // Check if the current item's value exists in the tableNumbers array
            const isTableBooked = tableNumbers.includes(item.value);
            // Check if this item is currently selected
            const isSelected = item.value === value;

            return (
                <View style={[styles.item, isSelected && styles.selectedItem]}>
                    <Text style={[styles.textItem, isSelected && styles.selectedText]}>{item.label}</Text>
                    <View style={styles.iconContainer}>
                        {isTableBooked && (
                            <AntDesignIcon
                                style={styles.icon}
                                color='#0102FD'
                                name="Safety"
                                size={20}
                            />
                        )}
                        {isSelected && (
                            <AntDesignIcon
                                style={styles.icon}
                                color="#0102FD"
                                name="checkcircle"
                                size={20}
                            />
                        )}
                    </View>
                </View>
            );
        };

        return (
            <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={data}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Select One"
                searchPlaceholder="Search..."
                value={value}
                onChange={item => {
                    setValue(item.value);
                    setselectedTablenumber(item.value);
                    setOpen(false)
                }}
                renderLeftIcon={() => (
                    <AntDesignIcon style={styles.icon} color="black" name="Safety" size={20} />
                )}
                renderItem={renderItem}
            />
        );
    };

    return (
        <View style={styles.modalWrapper}>
            <View style={styles.addbox}>
                <Text style={{ fontFamily: "Jost_500Medium", fontSize: 20 }}>Book A Table</Text>
                <View style={styles.wrapper}>
                    <DropdownComponent />
                    {/* <Pressable style={styles.drop} onPress={() => {
                        setOpen(!open)
                    }}>
                        <Text style={styles.placeholder}>{selectedtablenumber == 0 ? "Select One" : `Select Table ${selectedtablenumber}`}</Text>
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
                    )} */}
                </View>
                <View style={styles.butt}>
                    <TouchableOpacity
                        onPress={async () => {
                            // if AddFood exposed a sanitize function, call it first to ensure data saved
                            try {
                                if (typeof sanitize_dishData === 'function') {
                                    // console.log('tagle' ,table)
                                    await sanitize_dishData()
                                    setOpenModaltable(false)
                                    setOpenModal(false)
                                    navigation.navigate('my-cart')

                                }
                            } catch (e) {
                                console.log('Error calling sanitize_dishData', e)
                            }

                            assignTableAndPushToCart(table)
                            Toast.show(`Table No ${table} is booked`, Toast.SHORT, Toast.BOTTOM);
                            // Toast.show({
                            //     type: "success",
                            //     text1: "Success",
                            //     text2: `Table No ${table} is booked`
                            // })
                            // console.log(cart)
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
    dropdown: {
        margin: 16,
        height: 50,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,

        elevation: 2,
    },
    icon: {
        marginRight: 5,
    },
    item: {
        padding: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectedItem: {
        backgroundColor: '#f0f0ff',
    },
    textItem: {
        flex: 1,
        fontSize: 16,
    },
    selectedText: {
        fontWeight: '600',
        color: '#0102FD',
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
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