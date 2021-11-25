import React from 'react'
import { StyleSheet, Text, View, useWindowDimensions, TouchableOpacity, Pressable, Platform } from 'react-native'
import colors from '../constants/colors'

const PrimaryButton = (props) => {
    return (
        <>
            {Platform.OS == "android" ?
                <View style={styles.androidContainer}>
                    <Pressable android_ripple={{ color: colors.text.default }}
                        style={[{ ...props.style, width: 0.4 * useWindowDimensions().width }, styles.androidPressable]}
                        onPress={props.onPress}>
                        <View style={styles.container}>
                            <Text style={styles.text}>{props.text}</Text>
                        </View>
                    </Pressable>
                </View>
                :
                <TouchableOpacity activeOpacity={0.7} onPress={props.onPress} style={{ ...props.style, width: 0.4 * useWindowDimensions().width }}>
                    <View style={[styles.container, { backgroundColor: colors.primary, borderRadius: 5 }]}>
                        <Text style={styles.text}>{props.text}</Text>
                    </View>
                </TouchableOpacity>
            }
        </>
    )
}

export default PrimaryButton

const styles = StyleSheet.create({
    androidContainer: {
        overflow: "hidden",
        borderRadius: 5
    },
    androidPressable: {
        backgroundColor: colors.primary
    },
    container: {
        width: '100%',
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
