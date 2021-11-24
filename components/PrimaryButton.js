import React from 'react'
import { StyleSheet, Text, View, useWindowDimensions, TouchableOpacity } from 'react-native'
import colors from '../constants/colors'

const PrimaryButton = (props) => {
    return (
        <TouchableOpacity activeOpacity={0.7} onPress={props.onPress} style={{ ...props.style, width: 0.4 * useWindowDimensions().width }}>
            <View style={styles.container}>
                <Text style={styles.text}>{props.text}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default PrimaryButton

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: colors.primary,
        borderRadius: 5,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        textTransform: 'uppercase',
        color: colors.text.default,
        fontWeight: '700',
        fontSize: 15
    }

})
