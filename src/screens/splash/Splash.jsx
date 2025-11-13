import React, { useContext, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../../context/UserContext';
// import { StatusBar } from 'expo-status-bar';

const Splash = () => {
    const navigation = useNavigation();
    const progress = new Animated.Value(0);

    let { state } = useContext(UserContext)
    useEffect(() => {
        // Animate the progress bar
        Animated.timing(progress, {
            toValue: 1,
            duration: 4000, // 3 seconds
            useNativeDriver: false,
        }).start();

        // Navigate to Login after 3 seconds
        const timeout = setTimeout(() => {
            if (state.is_login) {
                console.log('state in splash >>>>>', state);

                navigation.replace('home');
            } else {
                console.log('state in splash', state);
                navigation.replace('login'); // Change to your login page name
            }
        }, 4000);

        return () => clearTimeout(timeout);
    }, [state]);

    const progressWidth = progress.interpolate({
        inputRange: [0, 1],        
        outputRange: ['0%', '100%'],
    });

    return (
        <View style={styles.container}>

            <Image source={require("../../../assets/logo.png")} style={styles.logo} />
            <Text style={styles.loadingText}>LOADING...</Text>
            <View style={styles.progressBar}>
                <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
            </View>
            <Text style={styles.waitText}>Please Wait</Text>
        </View>
    );
};

export default Splash;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    logo: {
        width: 200,
        height: 100,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    loadingText: {
        fontSize: 18,
        fontFamily: "Jost_600SemiBold",
        marginBottom: 10,
    },
    progressBar: {
        width: '80%',
        height: 10,
        backgroundColor: '#ddd',
        borderRadius: 5,
        overflow: 'hidden',
        marginBottom: 10,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#0000ff', // Blue color
        borderRadius: 5,
    },
    waitText: {
        fontSize: 14,
        color: '#0000ff',
        fontFamily: "Jost_600SemiBold",
    },
});
