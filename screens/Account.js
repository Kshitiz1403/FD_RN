import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import colors from '../constants/colors'
import TextCustom from '../constants/TextCustom'
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import EditButton from '../components/EditButton';
import { auth, firestore } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const Account = () => {
    const [update, setUpdate] = useState(false)

    const UID = auth.currentUser.uid
    // const userRef = firestore.collection('users').doc(UID)
    const userRef = doc(firestore, 'users',UID)

    const [nameOfUser, setNameOfUser] = useState('Hello user')
    const [phone, setPhone] = useState(9999999999)
    const [email, setEmail] = useState('user@comapny.com')
    const [graduation, setGraduation] = useState(1999)

    useEffect(() => {

        const getDetails = async() =>{
            const querySnapshot = await getDoc(userRef)
            let data = querySnapshot.data()
            setPhone(auth.currentUser.phoneNumber)
            if (data) {
                if(data.Name){
                    setNameOfUser(data.Name)
                }
                if (data.Email) {
                    setEmail(data.Email)
                }
                if (data.graduationYear) {
                    setGraduation(data.graduationYear)
                }
                // console.log(doc.data())
                setUpdate(false)
    
                // get initial input state from firestore
            }
        }
        getDetails()
        

        // userRef.get().then((doc => {
        //     let data = doc.data()
        //     setPhone(auth.currentUser.phoneNumber)
        //     if (data) {
        //         if(data.Name){
        //             setNameOfUser(data.Name)
        //         }
        //         if (data.Email) {
        //             setEmail(data.Email)
        //         }
        //         if (data.graduationYear) {
        //             setGraduation(data.graduationYear)
        //         }
        //         // console.log(doc.data())
        //         setUpdate(false)

        //         // get initial input state from firestore
        //     }
        // })).catch((err) => console.log(err))
        return
    }, [update!=false])

    const handleSignOut = () => {
        auth
            .signOut()
    }

    const navigation = useNavigation()

    const Item = (props) => {
        return (
            <View onPress={props.onPress} style={[generalInfoStyles.container, { borderColor: colors.light, borderBottomWidth:0, paddingVertical:15}]}>
                <TouchableOpacity onPress={props.onPress}>
                    <Text style={styles.itemText}>{props.text}</Text>
                </TouchableOpacity>
            </View>
        )
    }
    const GeneralInfo = () => {
        return (
            <View style={[generalInfoStyles.container]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 2, paddingVertical: 5 }}>
                    <Text style={{ textTransform: 'uppercase', fontSize: 18, fontWeight: '700', color:colors.text.default  }}>{nameOfUser}</Text>
                    <EditButton text="Edit" onPress={() => navigation.navigate('Edit_Account',{
                        toUpdate:setUpdate
                    })} />
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
            <Item text="Orders"  />
            <Item text="Logout" onPress={() => handleSignOut()} />
        </View>
    )
}

export default Account

const generalInfoStyles = StyleSheet.create({
    container: {
        borderBottomWidth: 3,
        borderColor: colors.primary,
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginBottom:10,
        backgroundColor:colors.dark
    }
})
const styles = StyleSheet.create({
    itemText:{
        color: colors.text.default,
        textTransform:'uppercase',
        fontWeight:'700'
    }
})
