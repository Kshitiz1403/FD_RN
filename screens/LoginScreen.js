import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import React, { useRef, useState, useEffect } from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native'
import { auth } from '../firebase'
import { firebaseConfig } from '../firebaseConfig'
import PrimaryButton from '../components/PrimaryButton'
import SecondaryButton from '../components/SecondaryButton';
import { PhoneAuthProvider, RecaptchaVerifier, signInWithCredential, signInWithPhoneNumber } from "firebase/auth";
import validator from 'validator';
import axios from 'axios';
import { port } from '../App';

const LoginScreen = () => {

    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState()
    const [otp, setOtp] = useState()
    const [isEmailValid, setIsEmailValid] = useState(false)
    const [isEmailErrorShown, setIsEmailErrorShown] = useState(false)
    const [verificationId, setVerificationId] = useState();

    const emailHandler = (v) =>{
        setEmail(v)
        const isEmail = validator.isEmail(v)
        if(isEmail) {setIsEmailValid(true); setIsEmailErrorShown(false) }
        else setIsEmailValid(false)
    }

    const handleSendOTP = async () => {
        if (Platform.OS == "web") {
            var phoneNumber = `+91${phone}`
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
        if(!isEmailValid) return setIsEmailErrorShown(true)
        setIsEmailErrorShown(false)
        try {
            const credential = PhoneAuthProvider.credential(
                verificationId.verificationId,
                otp
            );
            await signInWithCredential(auth, credential);
            axios.patch(`${port}/users/${auth.currentUser.uid}`,{
                email
            }).then(data=> console.log(data.data)).catch(err=>console.log(err))
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
                {isEmailErrorShown?
                <Text style={{color:'white'}}>Email is invalid</Text>:null}
                <TextInput
                    placeholder="Email"
                    autoComplete='email'
                    value={email}
                    onChangeText={v => emailHandler(v)}
                    style={[styles.input, {outline:'none', borderColor:!isEmailValid?'red':null, borderWidth:2, borderStyle:'solid'}]}
                />
                <View style={[{ flexDirection: 'row', alignItems: 'center' }, styles.input]}>
                    <Text style={{ marginRight: 10, color: 'black' }}>
                        +91
                    </Text>
                    <TextInput
                        placeholder="Mobile Number"
                        value={phone}
                        onChangeText={v => setPhone(v.replace(/[^0-9]/g, ''))}
                        keyboardType="number-pad"
                        style={{ width: '90%', outline:'none' }}
                        maxLength={10}
                        onSubmitEditing={handleSendOTP}
                    />
                </View>

                <TextInput
                    placeholder="OTP"
                    value={otp}
                    onChangeText={v => setOtp(v.replace(/[^0-9]/g, ''))}
                    style={[styles.input, {outline:'none'}]}
                    keyboardType="number-pad"
                    maxLength={6}
                />
            </View>
            <View style={styles.buttonContainer}>
                <PrimaryButton onPress={handleSendOTP} text="Send OTP" style={{ marginBottom: 10 }} />
                <SecondaryButton text="Verify" onPress={handleVerifyOTP} />
            </View>
            <View style={{ alignItems: 'center', position: 'absolute', bottom: 50 }}>
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
