import { useNavigation } from '@react-navigation/core'
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';
import React, { useRef, useState, useEffect } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { auth } from '../firebase'
import { firebaseConfig } from '../firebaseConfig'
import * as firebase from 'firebase'

const LoginScreen = () => {

    // const [email, setEmail] = useState('')
    // const [password, setPassword] = useState('')
    const [phone, setPhone] = useState()
    const [otp, setOtp] = useState()
    const [verificationId, setVerificationId] = useState();

    {/* FOR EMAIL AND PASSWORD BASED AUTHENTICATION */ }


    // const handleUserSignUp = () => {
    //     auth
    //         .createUserWithEmailAndPassword(email, password)
    //         .then(userCredentials => {
    //             const user = userCredentials.user
    //             console.log(user.email)
    //             // User id
    //             console.log(user.uid)
    //             return (firestore.collection('users').doc(user.uid).set({
    //                 // Add the fields that you want to add to a user document inside users collection

    //             }))
    //         })
    //         .catch(error => alert(error))
    // }

    // const handleLogin = () => {
    //     auth
    //         .signInWithEmailAndPassword(email, password)
    //         .then(userCredentials => {
    //             const user = userCredentials.user
    //             console.log("Logged in with: ", user.email)
    //         })
    //         .catch(error => alert(error))
    // }

    // const handleResetPassword = () => {
    //     auth
    //         .sendPasswordResetEmail(email)
    //         .then(() => {
    //             alert("Password reset email sent!")
    //         })
    //         .catch((error) => {
    //             alert(error)
    //         })
    // }

    // const ref_input_password = useRef()

    {/* ------------------------------------------ */ }


    const handleSendOTP = async () => {
        try {
            const verificationId = await firebase.auth().signInWithPhoneNumber(
                `+91${phone}`,
                recaptchaVerifier.current
            );
            setVerificationId(verificationId);
            alert("OTP has been sent")
            console.log(verificationId)
        } catch (err) {
            alert(err)
        }
    }


    const handleVerifyOTP = async () => {
        try {
            const credential = firebase.auth.PhoneAuthProvider.credential(
                verificationId.verificationId,
                otp
            );
            await firebase.auth().signInWithCredential(credential);
            alert("Phone verification successful")
        } catch (err) {
            alert(err)
        }
    }

    const recaptchaVerifier = useRef(null);
    const attemptInvisibleVerification = true;


    return (
        <View
            style={styles.container}
        >
            <FirebaseRecaptchaVerifierModal
                ref={recaptchaVerifier}
                firebaseConfig={firebaseConfig}
                attemptInvisibleVerification={attemptInvisibleVerification}
            />
            <View style={styles.inputContainer}>
                <View style={[{ flexDirection: 'row', alignItems: 'center' }, styles.input]}>
                    <Text style={{ marginRight: 10, color: 'black' }}>
                        +91
                    </Text>
                    <TextInput
                        placeholder="Mobile Number"
                        value={phone}
                        onChangeText={v => setPhone(v)}
                        keyboardType="number-pad"
                        style={{ width: '90%' }}
                        maxLength={10}
                        onSubmitEditing={handleSendOTP}
                    />
                </View>

                <TextInput
                    placeholder="OTP"
                    value={otp}
                    onChangeText={v => setOtp(v)}
                    style={styles.input}
                    keyboardType="number-pad"
                    maxLength={6}
                />

                {/* FOR EMAIL AND PASSWORD BASED AUTHENTICATION */}
                {/* <TextInput
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
                /> */}
                {/* ------------------------------------------ */}

            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={handleSendOTP}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Send OTP</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleVerifyOTP}
                    style={[styles.button, styles.buttonOutline]}
                >
                    <Text style={styles.buttonOutlineText}>Verify</Text>
                </TouchableOpacity>

                {/* FOR EMAIL AND PASSWORD BASED AUTHENTICATION */}
                {/* <TouchableOpacity
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
                </TouchableOpacity> */}
                {/* ------------------------------------------ */}

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
        marginTop: 5,
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    button: {
        backgroundColor: '#EA7C69',
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
        borderColor: '#EA7C69',
        borderWidth: 2
    },
    buttonOutlineText: {
        color: '#EA7C69',
        fontWeight: '700',
        fontSize: 16,
        alignSelf: 'center'
    }
})
