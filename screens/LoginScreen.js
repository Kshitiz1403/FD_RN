import { useNavigation } from '@react-navigation/core'
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import React, { useRef, useState, useEffect } from 'react'
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { auth } from '../firebase'
import { firebaseConfig } from '../firebaseConfig'
// import * as firebase from 'firebase'
import colors from '../constants/colors';
import PrimaryButton from '../components/PrimaryButton'
import SecondaryButton from '../components/SecondaryButton';
import { PhoneAuthProvider, RecaptchaVerifier, signInWithCredential, signInWithPhoneNumber } from "firebase/auth";
import { initializeApp } from 'firebase/app';

const LoginScreen = () => {

    const [phone, setPhone] = useState()
    const [otp, setOtp] = useState()
    const [verificationId, setVerificationId] = useState();

    const handleSendOTP = async () => {
        if (Platform.OS == "web") {
            var phoneNumber = `+91${phone}`
            console.log(phoneNumber)
            setUpRecaptcha()
            var appVerifier = window.recaptchaVerifier
            signInWithPhoneNumber(auth, phoneNumber, appVerifier).then((confirmationResult) => {
                alert("OTP has been sent")
                setVerificationId(confirmationResult)
            }).catch((err) => alert(err))
        }

        else {
            try {
                const verificationId = await signInWithPhoneNumber(
                    auth,
                    `+91${phone}`,
                    recaptchaVerifier.current
                );
                setVerificationId(verificationId);
                alert("OTP has been sent")
            } catch (err) {
                alert(err)
            }
        }
    }



    const handleVerifyOTP = async () => {
        try {
            const credential = PhoneAuthProvider.credential(
                verificationId.verificationId,
                otp
            );
            await signInWithCredential(auth, credential);
            alert("Phone verification successful")
        } catch (err) {
            alert(err)
        }
    }

    const recaptchaVerifier = useRef(null);
    const attemptInvisibleVerification = true;

    auth.useDeviceLanguage()

    const setUpRecaptcha = () => {
        window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
            'size': 'invisible',
            'callback': (response) => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
                onSignInSubmit();
            }
        }, auth);
    }

    return (
        // <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? "padding" : 'height'}
            style={styles.container}
        >
            {Platform.OS != "web" ?
                <FirebaseRecaptchaVerifierModal
                    ref={recaptchaVerifier}
                    firebaseConfig={firebaseConfig}
                    attemptInvisibleVerification={attemptInvisibleVerification}
                /> :
                <View nativeID='recaptcha-container' />
            }

            <View style={styles.inputContainer}>
                <View style={[{ flexDirection: 'row', alignItems: 'center' }, styles.input]}>
                    <Text style={{ marginRight: 10, color: 'black' }}>
                        +91
                    </Text>
                    <TextInput
                        placeholder="Mobile Number"
                        value={phone}
                        onChangeText={v => setPhone(v.replace(/[^0-9]/g, ''))}
                        keyboardType="number-pad"
                        style={{ width: '90%' }}
                        maxLength={10}
                        onSubmitEditing={handleSendOTP}
                    />
                </View>

                <TextInput
                    placeholder="OTP"
                    value={otp}
                    onChangeText={v => setOtp(v.replace(/[^0-9]/g, ''))}
                    style={styles.input}
                    keyboardType="number-pad"
                    maxLength={6}
                />
            </View>
            <View style={styles.buttonContainer}>
                <PrimaryButton onPress={handleSendOTP} text="Send OTP" style={{ marginBottom: 10 }} />
                <SecondaryButton text="Verify" onPress={handleVerifyOTP} />
            </View>
            <View style={{ alignItems: 'center', position:'absolute', bottom:50 }}>
                <Text style={{ color: 'white' }}>For demo, use credentials- </Text>
                <Text style={{ color: 'white' }}>Mobile - 9876543210 </Text>
                <Text style={{ color: 'white' }}>OTP - 123456 </Text>

            </View>
        </KeyboardAvoidingView>
        // </TouchableWithoutFeedback>
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
})
