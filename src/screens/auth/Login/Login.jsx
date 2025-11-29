import { View, Text, ImageBackground, TouchableOpacity, TextInput, StatusBar, ActivityIndicator } from 'react-native'
import React, { useContext, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { loginStyles } from './styles'
// import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
// import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialDesignIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { apiRequest } from '../../../utils/apiService';
import Toast from 'react-native-toast-message';
import { _setStoreData } from '../../../utils/store';
import { UserContext } from '../../../context/UserContext';



const Login = ({ navigation }) => {

    const [login_cre, setlogin_cre] = useState({
        email: '',
        password: ''
    })

    const { dispatch } = useContext(UserContext)

    const [validateCheck, setValidatecheck] = useState({
        email: false,
        password: false
    })
    const [loading, setloading] = useState(false)

    const validateFields = async () => {
        // console.log('login_cre', login_cre);
        setloading(true)
        let isvalid = false;
        let emailBorder = login_cre.email.trim() === '' ? 'red' : '';
        let passwordBorder = login_cre.password.trim() === '' ? 'red' : '';
        // setlogin_cre({
        //     email: emailBorder,
        //     password: passwordBorder
        // });
        if (emailBorder === 'red' && passwordBorder === 'red') {
            isvalid = false;
            setValidatecheck({
                email: true,
                password: true
            })
            setloading(false)
        } else if (emailBorder == 'red') {
            setValidatecheck({
                email: true,
                password: false
            })
            setloading(false)
        } else if (passwordBorder == 'red') {
            isvalid = false;
            setValidatecheck({
                email: false,
                password: true
            })
              setloading(false)

        }

        else {
            isvalid = true;
        }
        if (isvalid) {
            await apiRequest('waiter/login', 'post', {
                email: login_cre.email,
                password: login_cre.password
            }).then(async (response) => {
                if (response.status == false) {
                    Toast.show({
                        type: 'error',
                        text1: response.message
                    })
                    setloading(false)
                } else if (response.status == true) {
                    Toast.show({
                        type: 'success',
                        text1: response.message
                    })
                    await _setStoreData('userSession_waiter', response.data);
                    await _setStoreData('_waiter_token', response.token);
                    dispatch({ type: 'SET_USER_DATA', payload: response.data })
                    setloading(false)
                    navigation.navigate("home")
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
                <View style={loginStyles.loginWrap}>
                    <Text style={loginStyles.head}>Welcome!</Text>
                    <Text style={loginStyles.subhead}>Signing to continue</Text>
                    <View style={loginStyles.inputWrap}>
                        <TouchableOpacity style={[loginStyles.inputBox, {
                            borderColor: validateCheck?.email ? 'red' : '#FFFFFF',
                            borderWidth: 1
                        }]}>
                            <FontAwesomeIcon name="user" size={14} color="black" />
                            <TextInput
                                style={[loginStyles.input, {
                                    width: '100%',
                                    //  backgroundColor:'green'
                                }]}
                                value={login_cre?.email}
                                placeholderTextColor={"#888"}
                                placeholder='Email'
                                onChangeText={(t) => setlogin_cre({ ...login_cre, email: t })}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={[loginStyles.inputBox, {
                            borderColor: validateCheck?.password ? 'red' : '#ffffff',
                            borderWidth: 1
                        }]}>
                            {/* <FontAwesome5 name="user-alt" size={14} color="black" /> */}
                            <MaterialDesignIcons name="lock" size={14} color="black" />

                            <TextInput
                                style={[loginStyles.input, {
                                    width: '100%'
                                }]}
                                placeholderTextColor={"#888"}
                                placeholder='Password'
                                secureTextEntry
                                value={login_cre?.password}
                                onChangeText={(t) => setlogin_cre({ ...login_cre, password: t })}
                            />
                        </TouchableOpacity>
                        <Text onPress={() => navigation.navigate("forget-email")} style={loginStyles.forget}>Forget Password?</Text>
                    </View>
                    <TouchableOpacity
                        // onPress={() => navigation.navigate("home")}
                        onPress={() => validateFields()}
                        style={loginStyles.signin}>
                        {
                            loading ? <ActivityIndicator color="#fff" size="small" /> : <Icon type='Feather' name="arrow-right" size={26} color="#fff" />
                        }

                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </ImageBackground>
    )
}

export default Login