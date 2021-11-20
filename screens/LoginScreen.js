import { useNavigation } from '@react-navigation/core'
import React, { useRef, useState } from 'react'
import { useEffect } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { auth } from '../firebase'

const LoginScreen = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigation = useNavigation()

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                navigation.replace("Home")
            }
        })
        return unsubscribe
    }, [])

    const handleUserSignUp = () => {
        auth
            .createUserWithEmailAndPassword(email, password)
            .then(userCredentials => {
                const user = userCredentials.user
                console.log(user.email)
            })
            .catch(error => alert(error))
    }

    const handleLogin = () => {
        auth
            .signInWithEmailAndPassword(email, password)
            .then(userCredentials => {
                const user = userCredentials.user
                console.log("Logged in with: ", user.email)
            })
            .catch(error => alert(error))
    }

    const handleResetPassword = () => {
        auth
            .sendPasswordResetEmail(email)
            .then(() => {
                alert("Password reset email sent!")
            })
            .catch((error) => {
                alert(error)
            })
    }

    const ref_input_password = useRef()

    return (
        <View
            style={styles.container}
        >
            <View style={styles.inputContainer}>
                <TextInput
                    autoCapitalize="none"
                    placeholder="Email"
                    value={email}
                    onChangeText={v => setEmail(v)}
                    style={styles.input}
                    autoComplete="email"
                    returnKeyType="next"
                    onSubmitEditing={() => { ref_input_password.current.focus() }}
                    blurOnSubmit={false}
                />
                <TextInput
                    ref={ref_input_password}
                    placeholder="Password"
                    value={password}
                    onChangeText={v => setPassword(v)}
                    style={styles.input}
                    secureTextEntry
                    onSubmitEditing={handleLogin}
                />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={handleLogin}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleUserSignUp}
                    style={[styles.button, styles.buttonOutline]}
                >
                    <Text style={styles.buttonOutlineText}>Register</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleResetPassword}
                >
                    <Text>Forgot Password</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    inputContainer: {
        width: '80%'
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    button: {
        backgroundColor: 'lightblue',
        width: '100%',
        padding: 15,
        borderRadius: 10
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
        alignSelf: 'center'
    },
    buttonOutline: {
        backgroundColor: 'white',
        marginTop: 5,
        borderColor: 'lightblue',
        borderWidth: 2
    },
    buttonOutlineText: {
        color: 'lightblue',
        fontWeight: '700',
        fontSize: 16,
        alignSelf: 'center'
    }
})
