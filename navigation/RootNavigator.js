import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Account from '../screens/Account'
import Explore from '../screens/Explore'
import LoginScreen from '../screens/LoginScreen'
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Cart from '../screens/Cart'
import colors from '../constants/colors'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator();

const Home = () => {
    return (
        <Tab.Navigator screenOptions={({ route }) => ({
            tabBarIcon: () => {
                let icon;
                if (route.name === "Explore") {
                    icon = <Entypo name="home" size={24} color={colors.primary} />
                }
                else if (route.name === "Account") {
                    icon = <MaterialCommunityIcons name="account" size={24} color={colors.primary} />
                }
                else if (route.name === "Cart") {
                    icon = <Entypo name="shopping-bag" size={24} color={colors.primary} />
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
    // ...DefaultTheme,
    // dark:true,
    colors: {
        // ...DefaultTheme.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.dark,
        text: 'white'
    },
};

const RootNavigator = () => {
    return (
        <NavigationContainer theme={MyTheme}>
            <Stack.Navigator>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default RootNavigator

const styles = StyleSheet.create({})
