// import { StatusBar } from 'expo-status-bar';,
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
// import * as SplashScreen from 'expo-splash-screen'
// import { Jost_300Light, Jost_400Regular, Jost_500Medium, Jost_600SemiBold, Jost_700Bold, useFonts } from '@expo-google-fonts/jost';
import { useCallback } from 'react';
import { ContextProvider } from './src/context/UserContext';


export default function App() {


  // const [fontsLoaded] = useFonts({
  //   Jost_300Light,
  //   Jost_400Regular,
  //   Jost_500Medium,
  //   Jost_600SemiBold,
  //   Jost_700Bold,
  // });

  // const onLayoutRootView = useCallback(async () => {
  //   if (fontsLoaded) {
  //     await SplashScreen.hideAsync();
  //   }
  // }, [fontsLoaded]);

  // if (!fontsLoaded) {
  //   return null;
  // }

  // SplashScreen.hideAsync();
  return (
    <ContextProvider>

      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />


      <AppNavigator />
    </ContextProvider>
  );
}


