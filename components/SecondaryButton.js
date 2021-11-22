import React from 'react'
import { StyleSheet, Text, View, useWindowDimensions, TouchableOpacity } from 'react-native'
import colors from '../constants/colors'

const SecondaryButton = (props) => {
    return (
        <TouchableOpacity onPress={props.onPress} style={{ width: 0.4 * useWindowDimensions().width }}>
            <View style={{ width: '100%', borderRadius: 5, borderWidth: 1, borderColor: colors.primary, height: 45, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ textTransform: 'uppercase', color: colors.primary, fontWeight: '700', fontSize: 15, }}>{props.text}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default SecondaryButton

const styles = StyleSheet.create({})
