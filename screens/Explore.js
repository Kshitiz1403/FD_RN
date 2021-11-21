import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import TextCustom from '../constants/TextCustom'
import { auth } from '../firebase'

const Explore = () => {

    const navigation = useNavigation()

    const handleSignOut = () => {
        auth
            .signOut()
            .then(() => {
                navigation.replace("Login")
            })
    }
    return (
        <View>
            <TextCustom>Home Screen</TextCustom>
            <TouchableOpacity onPress={handleSignOut}>
                <TextCustom>Sign Out</TextCustom>
            </TouchableOpacity>
        </View>
    )
}

export default Explore

const styles = StyleSheet.create({
})
