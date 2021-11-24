import React from 'react'
import { StyleSheet, Text, View, useWindowDimensions, TouchableOpacity, Pressable, Platform } from 'react-native'
import colors from '../constants/colors'

const SecondaryButton = (props) => {
    return (
        <>
            {Platform.OS == "android" ?
                <Pressable android_ripple={{ color: colors.primary }} onPress={props.onPress} style={{ width: 0.4 * useWindowDimensions().width, ...props.style }}>
                    <View style={styles.container}>
                        <Text style={styles.text}>{props.text}</Text>
                    </View>
                </Pressable> :
                <TouchableOpacity activeOpacity={0.7} onPress={props.onPress} style={{ width: 0.4 * useWindowDimensions().width, ...props.style }}>
                    <View style={styles.container}>
                        <Text style={styles.text}>{props.text}</Text>
                    </View>
                </TouchableOpacity>
            }

        </>
    )
}

export default SecondaryButton

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.primary,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        textTransform: 'uppercase',
        color: colors.primary,
        fontWeight: '700',
        fontSize: 15
    }
})
