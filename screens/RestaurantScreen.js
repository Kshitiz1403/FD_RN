import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const RestaurantScreen = ({ route, navigation }) => {

    const { restaurantID, restaurantName } = route.params
    navigation.setOptions({
        headerTitle: restaurantName
    })


    return (
        <View style={styles.container}>
            <Text></Text>
        </View>
    )
}

export default RestaurantScreen

const styles = StyleSheet.create({
    container:{
        flex:1
    }
})
