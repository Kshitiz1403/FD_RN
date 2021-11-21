import React, { Children } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import colors from './colors'

const TextCustom = (props) => {
    return (<Text style={{ ...styles.text, ...props.style }}>
        {props.children}
    </Text>
    )
}

export default TextCustom

const styles = StyleSheet.create({
    text: {
        color: 'white'
    }
})
