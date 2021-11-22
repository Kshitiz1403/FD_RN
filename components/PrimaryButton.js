import React from 'react'
import { StyleSheet, Text, View, useWindowDimensions, TouchableOpacity } from 'react-native'
import colors from '../constants/colors'

const PrimaryButton = (props) => {
    return (
        <TouchableOpacity onPress={props.onPress} style={[{ width: 0.4 * useWindowDimensions().width },{...props.style}]}>
            <View style={{ width: '100%', backgroundColor: colors.primary, borderRadius: 5, height: 45, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ textTransform: 'uppercase', color: colors.text.default, fontWeight: '700', fontSize: 15 }}>{props.text}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default PrimaryButton

const styles = StyleSheet.create({})
