import { useNavigation } from '@react-navigation/core'
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';
import React, { useRef, useState, useEffect } from 'react'
import { Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { auth } from '../firebase'
import { firebaseConfig } from '../firebaseConfig'
import * as firebase from 'firebase'
import colors from '../constants/colors';
import PrimaryButton from '../components/PrimaryButton'
import SecondaryButton from '../components/SecondaryButton';

const LoginScreen = () => {

    const [phone, setPhone] = useState()
    const [otp, setOtp] = useState()
    const [verificationId, setVerificationId] = useState();

    const handleSendOTP = async () => {
        try {
            const verificationId = await firebase.auth().signInWithPhoneNumber(
                `+91${phone}`,
                recaptchaVerifier.current
            );
            setVerificationId(verificationId);
            alert("OTP has been sent")
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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
        </View>
        </TouchableWithoutFeedback>
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
