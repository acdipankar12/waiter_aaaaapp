import { View, Text, ImageBackground, TextInput, TouchableOpacity, StatusBar } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { forgetEmailStyles, forgetOtpStyles } from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
// import { StatusBar } from 'expo-status-bar';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { apiRequest } from '../../../utils/apiService';

const ForgetOtp = ({ navigation, route }) => {
    const [code, setCode] = useState(['', '', '', '']);
    const inputs = useRef([]);
    const { email, user } = route.params

    const [loading, setloading] = useState(false)
    const [timer, settimer] = useState(60)
    const timerRef = useRef(null)
    const handleChange = (text, index) => {
        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);

        if (text && index < 4) {
            inputs.current[index + 1]?.focus();
        }
    };




    useEffect(() => {
        if (timer > 0) {
            timerRef.current = setTimeout(() => settimer(timer - 1), 1000);
        }
        return () => clearTimeout(timerRef.current);
    }, [timer]);


    // resendotp function
    const validateFields = async () => {
        // console.log('login_cre', login_cre);

        // let passwordBorder = login_cre.password.trim() === '' ? 'red' : '';



        await apiRequest('forgot-password', 'post', {
            email: email,
        }).then(async (response) => {
            console.log("Forget Response", response);
            if (response.status == false) {
                Toast.show({
                    type: 'error',
                    text1: response.message
                })
                setloading(false)
            } else if (response.success == true) {
                // console.log("Forget Response>>>>>.", response);
                Toast.show({
                    type: 'success',
                    text1: response.message
                })

                setloading(false)
                // navigation.navigate("home")
            }
            // console.log("Login Response", response);
            // Handle successful login
        }).catch((error) => {
            setloading(false)
            // Handle login error
        });

        // You can add further logic here (e.g., show error message)
    };

    // verify OTP 
    const verify_otp_function = async () => {
        // console.log('login_cre', login_cre);

        // let passwordBorder = login_cre.password.trim() === '' ? 'red' : '';

        setloading(true)

        console.log(code?.join(""), user, 'datata...')
        await apiRequest('forgot-password-check-otp', 'post', {
            otp: code?.join("")?.toString(),
            user: user?.toString()
        }).then(async (response) => {
            console.log("Forget Response///////", response);
            if (response.status == false) {
                Toast.show({
                    type: 'error',
                    text1: response.message
                })
                setloading(false)
            } else if (response.success == true) {
                // console.log("Forget Response>>>>>.", response);
                Toast.show({
                    type: 'success',
                    text1: response.message
                })

                setloading(false)
                navigation.navigate("forget-otp-new")
            }
            // console.log("Login Response", response);
            // Handle successful login
        }).catch((error) => {
            console.log(error, 'error ')
            setloading(false)
            // Handle login error
        });

        // You can add further logic here (e.g., show error message)
    };
    const handleResend = () => {
        if (timer === 0) {
            settimer(60);
            validateFields()
            // Add your resend logic here
        }
    };
    const handleSubmit = () => {
        console.log('Code Submitted:', code.join(''));
    };
    return (
        <ImageBackground style={{ flex: 1 }} resizeMode='cover' source={require("../../../../assets/wappbg.png")}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <SafeAreaView style={forgetOtpStyles.forgetWrap}>
                <Text style={forgetOtpStyles.head}>Forget Password</Text>
                <Text style={forgetOtpStyles.subhead}>Code has been sent to {email}</Text>
                <View style={forgetOtpStyles.codeContainer}>
                    {code.map((digit, index) => (
                        <TextInput
                            key={index}
                            style={forgetOtpStyles.input}
                            keyboardType="numeric"
                            maxLength={1}
                            ref={(ref) => (inputs.current[index] = ref)}
                            onChangeText={(text) => handleChange(text, index)}
                            value={digit}
                        />
                    ))}
                </View>
                <Text style={forgetOtpStyles.resendtext}>Didn't recieve code? {' '}
                    {timer === 0 ? (
                        <Text style={{ color: 'grey' }} onPress={handleResend}>Resend again</Text>
                    ) : (
                        <Text style={{ color: 'grey' }}>Resend again ({timer}s)</Text>
                    )}
                </Text>
                <TouchableOpacity
                    style={forgetEmailStyles.submit}
                    onPress={() => {
                        verify_otp_function()
                    }}
                >
                    {
                        loading ? <Text style={forgetEmailStyles.submittext}>Loading...</Text> : <Text style={forgetEmailStyles.submittext}>Submit</Text>
                    }
                </TouchableOpacity>
            </SafeAreaView>
        </ImageBackground>
    )
}

export default ForgetOtp