import { View, Text, TouchableOpacity, TextInput, StyleSheet, Touchable, StatusBar } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import EntypoIcon from 'react-native-vector-icons/Entypo';
// import Feather from '@expo/vector-icons/Feather';
import { Image } from 'react-native';
import user from "../../../assets/user.png"
import { useNavigation } from '@react-navigation/native';
import IconAntDesign from 'react-native-vector-icons/AntDesign'
// import { StatusBar } from 'expo-status-bar';
import FeatherIcon from 'react-native-vector-icons/Feather';
const Header = ({ inhome, page }) => {
    const navigation = useNavigation()
    return (
        <View style={{ backgroundColor: inhome ? "#fff" : "#0102FD" }}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <SafeAreaView style={styles.container}>
                {
                    inhome ? <EntypoIcon onPress={() => navigation.navigate('content')} name="menu" size={24} color="black" /> : <IconAntDesign name="arrowleft" size={24} color="#fff" onPress={() => navigation.goBack()} />
                }

                {
                    inhome ? <TouchableOpacity style={styles.searchbar}>
                        <FeatherIcon name="search" size={18} color="black" />
                        <TextInput
                            style={[styles.input, {
                                width: '100%'
                            }]}
                            placeholder='Search'
                            placeholderTextColor={"#888"}
                        />
                    </TouchableOpacity> : <Text style={{ fontFamily: "Jost_600SemiBold", fontSize: 16, color: "#fff" }}>{page}</Text>
                }

                <TouchableOpacity onPress={() => navigation.navigate('profile')}>
                    <Image source={user} style={styles.image} />
                </TouchableOpacity>
            </SafeAreaView>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    image: {
        height: 40,
        width: 40,
        borderRadius: 20,
        borderColor: "#0102FD",
        borderWidth: 2
    },
    searchbar: {
        flexDirection: "row",
        alignItems: "center",
        width: "65%",
        borderColor: "#CCCCCC",
        borderWidth: 1,
        gap: 10,
        paddingHorizontal: 12,
        borderRadius: 40
    },
    input: {
        color: "#888",
        fontFamily: "Jost_400Regular"
    }
})
export default Header