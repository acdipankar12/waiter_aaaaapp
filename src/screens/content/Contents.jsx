import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native'
// import FontAwesome from '@expo/vector-icons/FontAwesome';
// import Entypo from '@expo/vector-icons/Entypo';
// import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
// import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import EntypoIcon from 'react-native-vector-icons/Entypo';

import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import DeleteAcc from '../../components/success_modal/DeleteAcc';
import { Icon } from 'react-native-vector-icons/FontAwesome';
import MaterialDesignIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { _removeStoreData } from '../../utils/store';

// import {
//     AppButton,
//     AppTextInput,
//     Icon,
//     useTheme,
// } from 'react-native-basic-elements';
const Contents = () => {
    const navigation = useNavigation()
    const [deletemodal, setDeleteModal] = useState(false)

    async function logout_user() {
        await _removeStoreData('userSession_waiter')
        await _removeStoreData('_waiter_token')
        navigation.replace("login")
        // Logic for logging out the user
    }
    return (
        <>
            <ImageBackground style={{ flex: 1, justifyContent: "center", paddingHorizontal: 20 }} resizeMode='cover' source={require("../../../assets/wappbg2.png")}>
                <View style={styles.contents}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("home")}
                        style={styles.content}
                    >
                        <FontAwesomeIcon name="home" size={24} color="#fff" />
                        <Text style={{ color: "#fff", fontFamily: "Jost-SemiBold", fontSize: 16, fontWeight: '600' }}>Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("my-cart")}
                        style={styles.content}>
                        <EntypoIcon name="shopping-cart" size={24} color="#fff" />
                        <Text style={{ color: "#fff", fontFamily: "Jost-SemiBold", fontWeight: '600', fontSize: 16 }}>My Cart</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("order-list")}
                        style={styles.content}>
                        <MaterialDesignIcons name="clipboard-list" size={24} color="#fff" />
                        <Text style={{ color: "#fff", fontFamily: "Jost-SemiBold", fontWeight: '600', fontSize: 16 }}>Past Order</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("profile")}
                        style={styles.content}>
                        <FontAwesomeIcon name="user-circle" size={24} color="#fff" />
                        <Text style={{ color: "#fff", fontFamily: "Jost-SemiBold", fontWeight: '600', fontSize: 16 }}>My Account</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setDeleteModal(true)}
                        style={styles.content}>
                        <MaterialCommunityIcons name="delete-circle" size={24} color="#fff" />
                        <Text style={{ color: "#fff", fontFamily: "Jost-SemiBold", fontWeight: '600', fontSize: 16 }}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.content}
                        onPress={() => logout_user()}
                    >
                        <FontAwesomeIcon name="power-off" size={24} color="#fff" />
                        <Text style={{ color: "#fff", fontFamily: "Jost-SemiBold", fontWeight: '600', fontSize: 16 }}>Logout</Text>
                    </TouchableOpacity>
                </View>

            </ImageBackground>
            {deletemodal ? <DeleteAcc setDeleteModal={setDeleteModal} /> : null}
        </>
    )
}


const styles = StyleSheet.create({
    contents: { 
        gap: 20,
        marginBottom: 90
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
    }
})
export default Contents