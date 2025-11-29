import { View, Text } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { StatusBar } from 'expo-status-bar'
import Splash from '../screens/splash/Splash'
import Login from '../screens/auth/Login/Login'
import ForgetEmail from '../screens/auth/forget/ForgetEmail'
import ForgetOtp from '../screens/auth/forget/ForgetOtp'
import NewPassword from '../screens/auth/forget/NewPassword'
import Toast from 'react-native-toast-message'
import Home from '../screens/home/Home'
import Contents from '../screens/content/Contents'
import TableDetails from '../screens/tabledetails/TableDetails'
import OrderList from '../screens/orderlist/OrderList'
import MyCart from '../screens/mycart/MyCart'
import Profile from '../screens/profile/Profile'
import { _removeStoreData, _retrieveStoreData } from '../utils/store'
import { UserContext } from '../context/UserContext'

const AppNavigator = () => {
    // const [user, setUser] = useState(false)
    const Stack = createNativeStackNavigator();
    const user = true;

    let { state, dispatch } = useContext(UserContext)
    async function checkUserSession() {

        let _retrieveUserSession = await _retrieveStoreData('userSession_waiter')
        if (_retrieveUserSession == null) {
            console.log('user not logged in')
            // setLoadingState(false)
            dispatch({ type: 'SET_IS_LOGIN', payload: false })
            dispatch({ type: 'SET_USER_DATA', payload: null })

        } else if (_retrieveUserSession != null) {
            console.log('user login///', _retrieveUserSession);
            // setLoadingState(false),
            dispatch({ type: 'SET_IS_LOGIN', payload: true })
            dispatch({ type: 'SET_USER_DATA', payload: _retrieveUserSession })


        }
    }

    useEffect(() => {

        checkUserSession()
    }, [])
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{
                headerShown: false
            }} initialRouteName='intro'>
                <Stack.Screen name='intro' component={Splash} />
                <Stack.Screen name='login' component={Login} />
                <Stack.Screen name='home' component={Home} />
                <Stack.Screen name='profile' component={Profile} />
                <Stack.Screen name='table-details' component={TableDetails} />
                <Stack.Screen name='order-list' component={OrderList} />
                <Stack.Screen name='my-cart' component={MyCart} />
                <Stack.Screen name='content' component={Contents} />
                <Stack.Screen name='forget-email' component={ForgetEmail} />
                <Stack.Screen name='forget-otp' component={ForgetOtp} />
                <Stack.Screen name='forget-otp-new' component={NewPassword} />

            </Stack.Navigator>
            <Toast />
        </NavigationContainer>
    )
}

export default AppNavigator