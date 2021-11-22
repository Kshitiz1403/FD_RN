import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import colors from '../constants/colors'
import TextCustom from '../constants/TextCustom'
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import EditButton from '../components/EditButton';
import { auth, firestore } from '../firebase';

const Account = () => {

    const UID = auth.currentUser.uid
    const userRef = firestore.collection('users').doc(UID)

    const [phone, setPhone] = useState()
    const [email, setEmail] = useState()
    const [graduation, setGraduation] = useState()

    useEffect(() => {
        userRef.get().then((doc => {
            if (doc.data()) {
                setPhone(auth.currentUser.phoneNumber)
                if (doc.data().Email) {
                    setEmail(doc.data().Email)
                }
                if (doc.data().graduationYear) {
                    setGraduation(doc.data().graduationYear)
                }
                console.log(doc.data())

                // get initial input state from firestore
            }
        })).catch((err) => console.log(err))
        return
    }, [])

    const navigation = useNavigation()
    const GeneralInfo = () => {
        return (
            <View style={generalInfoStyles.container}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 2, paddingVertical: 5 }}>
                    <TextCustom style={{ textTransform: 'uppercase', fontSize: 18, fontWeight: '700' }}>Kshitiz Agrawal</TextCustom>
                    <EditButton text="Edit" onPress={() => navigation.navigate('Edit_Account')} />
                </View>
                <ScrollView horizontal>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: colors.text.light }}>{phone}</Text>
                        <Entypo name="dot-single" size={24} color={colors.light} />
                        <Text style={{ color: colors.text.light }}>{email}</Text>
                        <Entypo name="dot-single" size={24} color={colors.light} />
                        <Text style={{ color: colors.text.light }}>{graduation}</Text>
                    </View>
                </ScrollView>
            </View>
        )
    }
    return (
        <View>
            <GeneralInfo />
            {/* <Text></Text> */}
        </View>
    )
}

export default Account

const generalInfoStyles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        borderColor: colors.primary,
        marginHorizontal: 10,
        paddingVertical: 10
    }
})
const styles = StyleSheet.create({
})
