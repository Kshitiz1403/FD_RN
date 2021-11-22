import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Account from '../screens/Account'
import Explore from '../screens/Explore'
import LoginScreen from '../screens/LoginScreen'
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Cart from '../screens/Cart'
import colors from '../constants/colors'
import { auth } from '../firebase'
import EditAccount from '../screens/EditAccount'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator();

const Home = () => {
    return (
        <Tab.Navigator detachInactiveScreens={false} screenOptions={({ route }) => ({
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
            <Tab.Screen name="Cart" component={Cart} />
            <Tab.Screen name="Account" component={Account} />
        </Tab.Navigator>
    )
}

const MyTheme = {
    dark:true,
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
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                setIsUserSignedIn(true)
            }
            else {
                setIsUserSignedIn(false)
            }
        })
        return unsubscribe
    }, [])

    const AuthStack = createNativeStackNavigator()
    const AuthStackScreen = () => (
        <AuthStack.Navigator>
            <AuthStack.Screen name="Login" component={LoginScreen}/>
        </AuthStack.Navigator>
    )

    const AppStack = createNativeStackNavigator()
    const AppStackScreen = () => (
        <AppStack.Navigator screenOptions={{cardStyle:{backgroundColor:colors.dark, opacity:1}, animationEnabled:false}}>
            <AppStack.Screen name="Home" component={Home} options={{headerShown:false}}/>
            <AppStack.Screen name="Edit_Account" component={EditAccount} options={{title:"Edit Account"}}/>
        </AppStack.Navigator>
    )

    return (
        <NavigationContainer theme={MyTheme}>
            {isUserSignedIn ? <AppStackScreen /> : <AuthStackScreen />}
        </NavigationContainer>
    )
}

export default RootNavigator

const styles = StyleSheet.create({})
