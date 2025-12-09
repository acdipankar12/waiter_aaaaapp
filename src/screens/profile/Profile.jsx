import { View, Text, Image, TouchableOpacity, TextInput, PermissionsAndroid } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { profilestyles } from './styles'
// import AntDesign from '@expo/vector-icons/AntDesign';
// import Feather from '@expo/vector-icons/Feather';
import user from "../../../assets/user.png"
import { useNavigation } from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { UserContext } from '../../context/UserContext'
// import Toast from 'react-native-toast-message'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { apiRequest } from '../../utils/apiService'
import { _retrieveStoreData } from '../../utils/store'
import Toast from "react-native-simple-toast";

const Profile = () => {
    const [secure, setSecure] = useState(true)
    const navigation = useNavigation()
    const { state, dispatch } = useContext(UserContext)

    const [loading, setloading] = useState(false)
    const [profileData, setProfileData] = useState({

        name: '',
        last_name: '',
        email: '',
        cel: '',
        password: '',
        image: null,

    })

    // let _local_image_url = ''
    const [_local_image_url, set__local_image_url] = useState('')
    useEffect(() => {
        getprofile_details()
        console.log(profileData, _local_image_url, 'contertewstr')


        console.log(Object.entries(JSON.parse(state?.user_data?.name))[0][1], 'lofininfins')
    }, [])


    async function chekccamera_permission() {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
                title: "App Camera Permission",
                message: "App needs access to your camera",
                buttonNeutral: "Ask Me Later",
                buttonNegative: "Cancel",
                buttonPositive: "OK"
            }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            openCamera()
        }
    }
    async function openCamera() {

        console.log('klfdsklfsk')
        let options = {
            saveToPhotos: true,
            mediaType: 'photo',
            includeBase64: false,
            maxWidth: 500,
            maxHeight: 500,
            quality: 0.5
        }
        let result = await launchImageLibrary({ ...options, selectionLimit: 1 });
        console.log(result, 'open cameara reskt>>>')

        if (result?.assets) {

            console.log(result?.assets[0], 'imagehfedf')
            setProfileData({ ...profileData, image: result?.assets[0] })

            set__local_image_url(result?.assets[0]?.uri)

            console.log(result?.assets[0]?.uri, 'images urilllll')


        }

        console.log(result, 'open cameara reskt>>>')
    }

    async function update_profile() {
        setloading(true)
        let _usertoken = await _retrieveStoreData('_waiter_token')
        console.log(_usertoken, 'tomenre')
        let formData = new FormData()



        formData.append('name', profileData?.name)
        formData.append('last_name', profileData?.last_name)
        formData.append('email', profileData?.email)
        formData.append('cel', profileData?.cel)
        formData.append('password', profileData?.password)

        formData.append('image', profileData?.image?.uri)


        console.log(formData, 'form dartata>>>>>')

        await apiRequest('waiter/update-profile', 'post', formData, {
            "Content-Type": "multipart/form-data",
            "Accept": "multipart/form-data",
            'Authorization': `Bearer ${_usertoken}`
        }).then((res) => {
            setloading(false)
              if (res?.status == true) {
                Toast.show('Profile updated successfully', Toast.SHORT, Toast.BOTTOM);

            } else {
                Toast.show('Something went wrong', Toast.SHORT, Toast.BOTTOM);

            }
            console.log(res, 'update proile respone../?????')
        })

    }


    async function getprofile_details() {
        let _usertoken = await _retrieveStoreData('_waiter_token')

        await apiRequest('waiter/get-profile', 'post', {}, {
            'Authorization': `Bearer ${_usertoken}`
        }).then((res) => {
            setProfileData({
                ...profileData,
                name: Object.entries(JSON.parse(res?.data?.name))[0][1],
                last_name: Object.entries(JSON.parse(res?.data?.last_name))[0][1],
                email: res?.data?.email,
                cel: res?.data?.tel,
                password: '',
                image: null,
            })
          
            console.log(res, 'profile response')
        })
    }


    return (
        <SafeAreaView style={{ flex: 1, paddingHorizontal: 20 }}>
            <View style={profilestyles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={profilestyles.backbutt}>
                    <AntDesignIcon name="left" size={20} color="black" />
                    <Text style={{ fontFamily: "Jost_400Regular", fontSize: 16 }}>Back</Text>
                </TouchableOpacity>
                <Text style={profilestyles.acctext}>My Account</Text>
            </View>
            <View style={profilestyles.profilebody}>
                <View style={profilestyles.imagewrap}>
                    {
                        typeof profileData?.image == 'object' && (
                            <Image source={user} style={profilestyles.image}></Image>

                        )

                    }
                    {
                        typeof profileData?.image != 'object' && profileData?.image != null && (
                            <Image source={{ uri: profileData?.image }} style={profilestyles.image}></Image>

                        )

                    }


                    <FeatherIcon
                        onPress={() => chekccamera_permission()}
                        name="camera" size={14} color="#fff" style={profilestyles.cam} />
                </View>
                <Text style={profilestyles.proftext}>Upload your profile picture</Text>
                <View style={profilestyles.inputs}>
                    <TouchableOpacity style={profilestyles.input}>
                        <TextInput
                            value={profileData?.name}
                            onChangeText={(T) => setProfileData({
                                ...profileData,
                                name: T
                            })}
                            placeholderTextColor={"#b8b8b8"} placeholder='First Name'
                            style={profilestyles.inputtext}></TextInput>
                    </TouchableOpacity>
                    <TouchableOpacity style={profilestyles.input}>
                        <TextInput
                            value={profileData?.last_name}
                            onChangeText={(T) => setProfileData({
                                ...profileData,
                                last_name: T
                            })}
                            placeholderTextColor={"#b8b8b8"} placeholder='Last Name' style={profilestyles.inputtext}></TextInput>
                    </TouchableOpacity>
                    <TouchableOpacity style={profilestyles.input}>
                        <TextInput
                            value={profileData?.cel}
                            onChangeText={(T) => setProfileData({
                                ...profileData,
                                cel: T
                            })}
                            placeholderTextColor={"#b8b8b8"} placeholder='Mobile Number' style={profilestyles.inputtext}></TextInput>
                    </TouchableOpacity>
                    <TouchableOpacity style={profilestyles.input}>
                        <TextInput
                            value={profileData?.email}
                            onChangeText={(T) => setProfileData({
                                ...profileData,
                                email: T
                            })}
                            placeholderTextColor={"#b8b8b8"} placeholder='Email' style={profilestyles.inputtext}></TextInput>
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={profilestyles.input}>
                        <TextInput
                            placeholderTextColor={"#b8b8b8"} placeholder='Password'
                            style={profilestyles.inputtext2}
                            secureTextEntry={secure ? true : false}
                            value={profileData?.password}
                            onChangeText={(T) => setProfileData({
                                ...profileData,
                                password: T
                            })}
                        ></TextInput>
                        {
                            secure ? <FeatherIcon onPress={() => setSecure(!secure)} style={profilestyles.eye} name="eye-off" size={16} color="#b8b8b8" /> : <FeatherIcon onPress={() => setSecure(!secure)} style={profilestyles.eye} name="eye" size={16} color="#b8b8b8" />
                        }

                    </TouchableOpacity> */}
                </View>
                <View style={profilestyles.buttsec}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={profilestyles.butt1}>
                        <Text style={{ fontSize: 15, fontFamily: "Jost_500Medium" }}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={profilestyles.butt2}
                        onPress={() => {
                            update_profile()
                        }}
                    >


                        {
                            loading ? <Text style={{ fontSize: 15, fontFamily: "Jost_500Medium", color: "#fff" }}>Loading...</Text> : <Text style={{ fontSize: 15, fontFamily: "Jost_500Medium", color: "#fff" }}>Save</Text>
                        }

                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Profile