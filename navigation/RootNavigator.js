import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { useEffect, useState } from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'
import Account from '../screens/Account'
import Explore from '../screens/Explore'
import LoginScreen from '../screens/LoginScreen'
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Cart from '../screens/Cart'
import colors from '../constants/colors'
import { auth, firestore } from '../firebase'
import EditAccount from '../screens/EditAccount'
import RestaurantScreen from '../screens/RestaurantScreen'
import { useIsFocused, useNavigation } from '@react-navigation/core';
import LottieView from 'lottie-react-native';
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator();
const Home = () => {

    const navigation = useNavigation()
    const isFocused = useIsFocused()

    const UID = auth.currentUser.uid
    const [badgeNumber, setBadgeNumber] = useState(0)
    const userRef = doc(firestore, 'users', UID)

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // The screen is focused
            // Call any action
            const setCartQuantity = async () => {
                const querySnapshot = await getDoc(userRef)
                let data = querySnapshot.data()
                setBadgeNumber(data.cart.dishes.length)
            }
            setCartQuantity()

        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [isFocused]);

    return (
        <Tab.Navigator screenOptions={({ route }) => ({
            tabBarIcon: ({ focused }) => {
                let icon;
                if (route.name === "Explore") {
                    icon = <Entypo name="home" size={24} color={focused ? colors.primary : colors.light} />
                }
                else if (route.name === "Account") {
                    icon = <MaterialCommunityIcons name="account" size={24} color={focused ? colors.primary : colors.light} />
                }
                else if (route.name === "Cart") {
                    icon = <Entypo name="shopping-bag" size={24} color={focused ? colors.primary : colors.light} />
                }
                return icon;
            }
        })}>
            <Tab.Screen name="Explore" component={Explore} />
            <Tab.Screen name="Cart" component={Cart} options={{ tabBarBadge: badgeNumber }} />
            <Tab.Screen name="Account" component={Account} />
        </Tab.Navigator>
    )
}

const MyTheme = {
    dark: true,
    colors: {
        ...DefaultTheme.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.dark,
        text: 'white'
    },
};

const RootNavigator = () => {

    const [isUserSignedIn, setIsUserSignedIn] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            if (user) {
                setIsUserSignedIn(true)
            }
            else {
                setIsUserSignedIn(false)
            }
            setTimeout(() => {
                setIsLoading(false)
            }, 1000)
            // setIsLoading(false)
            // setTimeout(() => {
            //     setIsLoading(false)
            // }, 1200);
        })
        return unsubscribe
    }, [])

    const AuthStack = createNativeStackNavigator()
    const AuthStackScreen = () => (
        <AuthStack.Navigator>
            <AuthStack.Screen name="Login" component={LoginScreen} />
        </AuthStack.Navigator>
    )

    const AppStack = createNativeStackNavigator()
    const AppStackScreen = () => (
        <View style={{ backgroundColor: colors.background, flex: 1 }}>
            <AppStack.Navigator >
                <AppStack.Screen name="Home" component={Home} options={{ headerShown: false }} />
                <AppStack.Screen name="Edit_Account" component={EditAccount} options={{ title: "Edit Account" }} />
                <AppStack.Screen name="Restaurant_Screen" component={RestaurantScreen} />
                <AppStack.Screen name="Cart" component={Cart} />
            </AppStack.Navigator>
        </View>
    )

    return (
        <NavigationContainer theme={MyTheme}>
            <View style={{ backgroundColor: colors.background, flex: 1 }}>
                {isLoading ? <LottieView source={require('../assets/animations/logo.json')} autoPlay /> :
                    isUserSignedIn ? <AppStackScreen /> : <AuthStackScreen />
                }
                {/* {Platform.OS !== "web" ?
                    isLoading ? <LottieView source={require('../assets/animations/logo.json')} autoPlay /> :
                        isUserSignedIn ? <AppStackScreen /> : <AuthStackScreen />
                    : null
                } */}
            </View>
        </NavigationContainer>
    )
}

export default RootNavigator

const styles = StyleSheet.create({})
