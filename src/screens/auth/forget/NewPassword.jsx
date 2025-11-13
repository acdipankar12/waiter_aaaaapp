import { View, Text, ImageBackground, TouchableOpacity, StatusBar } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { forgetEmailStyles, forgetNewStyles } from './styles'
import { TextInput } from 'react-native'
// import Ionicons from '@expo/vector-icons/Ionicons';
import Toast from 'react-native-toast-message'
// import { StatusBar } from 'expo-status-bar'

import Ionicons from "react-native-vector-icons/Ionicons";
import { apiRequest } from '../../../utils/apiService'
const NewPassword = () => {
    const [secured, setSecured] = useState(false)
    const [secured2, setSecured2] = useState(false)

    const [field_data, setfield_data] = useState({
        old_password: '',
        password: '',
        password_confirmation: ''
    })

    const [loading, setloading] = useState(false)
    const saveNewPassword = () => {
        Toast.show({
            type: "success",
            text1: "Your Password has been saved successfully"
        })
    }

    const validateFields = async () => {
        // console.log('login_cre', login_cre);
        setloading(true)
        // const isvalid = false
        let isvalid = true;
        const { old_password, password, password_confirmation } = field_data;

        if (!old_password || !password || !password_confirmation) {
            Toast.show({
                type: "error",
                text1: "Please fill all fields"
            });
            isvalid = false
            return;
        }

        if (password !== password_confirmation) {
            Toast.show({
                type: "error",
                text1: "Passwords do not match"
            });
            isvalid = false
            return;
        }

        const hasUppercase = /[A-Z]/.test(password);
        const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
        if (!hasUppercase && !hasSpecialChar) {
            Toast.show({
                type: "error",
                text1: "Password must have at least one uppercase letter or special character"
            });
            setloading(false);
            return;
        }
        // let passwordBorder = login_cre.password.trim() === '' ? 'red' : '';

        if (isvalid) {
            console.log('data' , field_data)
            await apiRequest('user/change-password', 'post', JSON.stringify(field_data)).then(async (response) => {
                console.log("Forget Response", response);
                if (response.status == false) {
                    Toast.show({
                        type: 'error',
                        text1: response.message
                    })
                    setloading(false)
                } else if (response.success == true) {
                    console.log("Forget Response>>>>>.", response);
                    Toast.show({
                        type: 'success',
                        text1: response.message
                    })

                    // navigation.navigate("forget-otp", {
                    //     email: email,
                    //     user: response?.user
                    // });
                    setloading(false)
                    // navigation.navigate("home")
                }
                // console.log("Login Response", response);
                // Handle successful login
            }).catch((error) => {
                console.log(error)
                setloading(false)
                // Handle login error
            });
        }
        // You can add further logic here (e.g., show error message)
    };
    return (
        <ImageBackground style={{ flex: 1 }} resizeMode='cover' source={require("../../../../assets/wappbg.png")}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <SafeAreaView style={{ paddingHorizontal: 20 }}>
                <View style={forgetEmailStyles.forgetWrap}>
                    <Text style={forgetEmailStyles.head}>Set New Password</Text>
                    <View style={forgetEmailStyles.inputWrap}>
                        <TouchableOpacity style={forgetNewStyles.inputBox}>
                            <TextInput
                                placeholderTextColor={"#888"}
                                placeholder='Enter Your old Password'
                                style={forgetNewStyles.input}
                                secureTextEntry={secured ? false : true}
                                value={field_data?.old_password}
                                onChangeText={(t) => setfield_data({
                                    ...field_data,
                                    old_password: t
                                })}
                            ></TextInput>
                            <Ionicons
                                style={forgetNewStyles.view}
                                name={secured ? "eye" : "eye-off"}
                                size={16}
                                color="#888"
                                onPress={() => setSecured(!secured)}
                            />

                        </TouchableOpacity>
                        <TouchableOpacity style={forgetNewStyles.inputBox}>
                            <TextInput
                                placeholderTextColor={"#888"}
                                placeholder='Enter Your New Password'
                                style={forgetNewStyles.input}
                                secureTextEntry={secured ? false : true}
                                value={field_data?.password}
                                onChangeText={(t) => setfield_data({
                                    ...field_data,
                                    password: t
                                })}

                            ></TextInput>
                            <Ionicons
                                style={forgetNewStyles.view}
                                name={secured ? "eye" : "eye-off"}
                                size={16}
                                color="#888"
                                onPress={() => setSecured(!secured)}
                            />

                        </TouchableOpacity>
                        <TouchableOpacity style={forgetNewStyles.inputBox}>
                            <TextInput
                                placeholderTextColor={"#888"}
                                placeholder='Confirm Password'
                                style={forgetNewStyles.input}
                                secureTextEntry={secured2 ? false : true}
                                value={field_data?.password_confirmation}
                                onChangeText={(t) => setfield_data({
                                    ...field_data,
                                    password_confirmation: t
                                })}
                            ></TextInput>
                            <Ionicons
                                style={forgetNewStyles.view}
                                name={secured2 ? "eye" : "eye-off"}
                                size={16}
                                color="#888"
                                onPress={() => setSecured2(!secured2)}
                            />

                        </TouchableOpacity>

                        <Text style={forgetNewStyles.warn}>Atleast 1 number or a special character</Text>

                        <TouchableOpacity
                            style={forgetNewStyles.submit}
                            onPress={() => validateFields()}
                        >
                            <Text style={forgetEmailStyles.submittext}>Save</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </SafeAreaView>
        </ImageBackground>
    )
}

export default NewPassword