import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import colors from '../constants/colors'

const EditButton = (props) => {
    return (
        <TouchableOpacity onPress={props.onPress} style={{ padding: 5 }}>
            <Text style={styles.button}>{props.text}</Text>
        </TouchableOpacity>
    )
}

export default EditButton

const styles = StyleSheet.create({
    button: {
        color: colors.primary,
        textTransform: 'uppercase',
        fontWeight: '700',
        fontSize: 12
    }
})
