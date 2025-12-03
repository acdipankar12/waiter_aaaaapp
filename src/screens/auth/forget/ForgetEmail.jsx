import { View, Text, ImageBackground, TouchableOpacity, TextInput, StatusBar } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { forgetEmailStyles } from './styles'
// import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
// import { StatusBar } from 'expo-status-bar';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { apiRequest } from '../../../utils/apiService';
// import Toast from 'react-native-toast-message';
import Toast from "react-native-simple-toast";

const ForgetEmail = () => {
    const navigation = useNavigation()
    const [email, setEmail] = useState('')

    const [loading, setloading] = useState(false)

    const validateFields = async () => {
        // console.log('login_cre', login_cre);
        setloading(true)
        let isvalid = false;
        let emailBorder = email.trim() === '' ? 'red' : '';
        // let passwordBorder = login_cre.password.trim() === '' ? 'red' : '';
        setEmail(emailBorder)
        if (emailBorder === 'red') {
            isvalid = false;
            setloading(false)
        } else {
            isvalid = true;
            // setloading(false)
        }
        if (isvalid) {
            await apiRequest('forgot-password', 'post', {
                email: email,
            }).then(async (response) => {
                console.log("Forget Response", response);
                if (response.status == false) {
                     Toast.show(response.message, Toast.SHORT, Toast.BOTTOM);
                    setloading(false)
                } else if (response.success == true) {
                    console.log("Forget Response>>>>>.", response);
                    Toast.show(response.message, Toast.SHORT, Toast.BOTTOM);

                    navigation.navigate("forget-otp", {
                        email: email,
                        user:response?.user
                    });
                    setloading(false)
                    // navigation.navigate("home")
                }
                // console.log("Login Response", response);
                // Handle successful login
            }).catch((error) => {
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
                    <Text style={forgetEmailStyles.head}>Forget Password</Text>
                    <Text style={forgetEmailStyles.subhead}>Enter Register Email Id To continue</Text>
                    <View style={forgetEmailStyles.inputWrap}>
                        <TouchableOpacity style={[forgetEmailStyles.inputBox,
                        {
                            borderColor: email,
                            borderWidth: 1
                        }
                        ]}>
                            <FontAwesomeIcon name="user" size={14} color="black" />
                            <TextInput
                                style={[forgetEmailStyles.input ,{
                                    backgroundColor:'100%',
                                    // backgroundColor:'green'
                                }]}
                                placeholderTextColor={"#888"}
                                placeholder='Email'
                                // onChangeText={(text) => setEmail(text)}
                                 onChangeText={(t) => {
                                    if (t.length > 0) {
                                        const firstChar = t.charAt(0).toLowerCase();
                                        const rest = t.slice(1);
                                        setEmail( firstChar + rest);
                                    } else {
                                        setEmail( t);
                                    }
                                }}
                                // value={email}
                                keyboardType='email-address'
                                autoCapitalize='none'
                                autoCorrect={false}

                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => validateFields()}
                            style={forgetEmailStyles.submit}
                        >

                            {
                                loading ? <Text style={forgetEmailStyles.submittext}>Loadinig...</Text> : <Text style={forgetEmailStyles.submittext}>Continue</Text>
                            }

                        </TouchableOpacity>

                    </View>
                </View>
            </SafeAreaView>
        </ImageBackground>
    )
}

export default ForgetEmail