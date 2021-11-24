import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import EditButton from '../components/EditButton'
import PrimaryButton from '../components/PrimaryButton'
import SecondaryButton from '../components/SecondaryButton'
import colors from '../constants/colors'
import { auth, firestore } from '../firebase'

const EditAccount = ({route, navigation}) => {

    const {toUpdate} = route.params

    const [nameOfUser, setNameOfUser] = useState('')
    const [email, setEmail] = useState('')
    const [graduation, setGraduation] = useState('')

    const [editName, setEditName] = useState(false)
    const [editMail, setEditMail] = useState(false)
    const [editGraduation, setEditGraduation] = useState(false)

    const UID = auth.currentUser.uid
    const userRef = firestore.collection('users').doc(UID)

    useEffect(() => {
        userRef.get().then((doc => {
            if (doc.data()) {
                if (doc.data().Name){
                    setNameOfUser(doc.data().Name)
                }
                if (doc.data().Email){
                    setEmail(doc.data().Email)
                }
                if (doc.data().graduationYear){
                    setGraduation(doc.data().graduationYear)
                }
                console.log(doc.data())

                // get initial input state from firestore

                // when the user presses cancel on any form, the state should be set to the values from the firestore
            }
        })).catch((err) => console.log(err))
        return
    }, [])

    const getName = () =>{
        userRef.get().then((doc=>{
            if (doc.data()){
                if (doc.data().Name){
                    setNameOfUser(doc.data().Name)
                }
            }
        }))
    }

    const getEmail = () =>{
        userRef.get().then((doc=>{
            if (doc.data()){
                if (doc.data().Email){
                    setEmail(doc.data().Email)
                }
            }
        }))
    }

    const getGraduation = () =>{
        userRef.get().then((doc=>{
            if (doc.data()){
                if (doc.data().graduationYear){
                    setGraduation(doc.data().graduationYear)
                }
            }
        }))
    }

    const handleNameUpdate = async () => {
        userRef.set({ Name: nameOfUser }, { merge: true })
        .then(()=>{setEditName(false); toUpdate(true)})
        .catch((err)=>console.log("Error on updating name- ", err))
    }

    const handleMailUpdate = () => {
        userRef.set({ Email: email }, { merge: true })
            .then(()=>{setEditMail(false); toUpdate(true)})
            .catch((err) => console.log("Error on updating email- ", err))
    }

    const handleGraduationUpdate = () => {
        userRef.set({graduationYear: parseInt(graduation)},{merge:true})
        .then(()=>{setEditGraduation(false); toUpdate(true)})
        .catch((err) => console.log("Error on updating graduation- ", err))
    }

    const NameButtons = () => {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 25, marginBottom: 10 }}>
                <PrimaryButton text="Update" onPress={() => handleNameUpdate()} />
                <SecondaryButton text="Cancel" onPress={() => {
                    setEditName(false)
                    getName()
                    }} />
            </View>
        )
    }

    const MailButtons = () => {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 25, marginBottom: 10 }}>
                <PrimaryButton text="Update" onPress={() => handleMailUpdate()} />
                <SecondaryButton text="Cancel" onPress={() => {
                    setEditMail(false)
                    getEmail()
                    }} />
            </View>
        )
    }

    const GraduationButtons = () => {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 25, marginBottom: 10 }}>
                <PrimaryButton text="Update" onPress={() => handleGraduationUpdate()} />
                <SecondaryButton text="Cancel" onPress={() => {
                    setEditGraduation(false)
                    getGraduation()
                    }} />
            </View>
        )
    }

    return (
        <View>

            {/* For name */}
            <>
                <View style={[itemStyles.container, { borderColor: editName ? colors.primary : colors.light }]}>
                    <View>
                        <Text style={itemStyles.title}>Name</Text>
                    </View>
                    <View style={itemStyles.inputContainer}>
                        <TextInput
                            style={itemStyles.input}
                            value={nameOfUser}
                            autoComplete="name"
                            placeholderTextColor={colors.text.default}
                            editable={editName ? true : false}
                            onChangeText={(v) => setNameOfUser(v)}
                            autoCapitalize="words"
                        />
                        <EditButton text="Edit" onPress={() => setEditName(!editName)} />
                    </View>

                </View>
                {editName ? <NameButtons /> : null}
            </>

            {/* For email */}
            <>
                <View style={[itemStyles.container, { borderColor: editMail ? colors.primary : colors.light }]}>
                    <View>
                        <Text style={itemStyles.title}>Email Address</Text>
                    </View>
                    <View style={itemStyles.inputContainer}>
                        <TextInput
                            style={itemStyles.input}
                            value={email}
                            autoCapitalize="none"
                            autoComplete="email"
                            placeholderTextColor={colors.text.default}
                            editable={editMail ? true : false}
                            onChangeText={(v) => setEmail(v)}
                        />
                        <EditButton text="Edit" onPress={() => setEditMail(!editMail)} />
                    </View>

                </View>
                {editMail ? <MailButtons /> : null}
            </>

            {/* For graduation */}

            <>
                <View style={[itemStyles.container, { borderColor: editGraduation ? colors.primary : colors.light }]}>
                    <View>
                        <Text style={itemStyles.title}>Graduation Year</Text>
                    </View>
                    <View style={itemStyles.inputContainer}>
                        <TextInput
                            style={itemStyles.input}
                            value={graduation.toString()}
                            placeholderTextColor={colors.text.default}
                            editable={editGraduation ? true : false}
                            onChangeText={(v) => setGraduation(v.replace(/[^0-9]/g, ''))}
                            keyboardType={'number-pad'}
                            maxLength={4}
                        />
                        <EditButton text="Edit" onPress={() => setEditGraduation(!editGraduation)} />
                    </View>

                </View>
                {editGraduation ? <GraduationButtons /> : null}
            </>

        </View>
    )
}

export default EditAccount

const styles = StyleSheet.create({

})

const itemStyles = StyleSheet.create({
    container: {
        margin: 10,
        borderBottomWidth: 1,
        padding: 5
    },
    title: {
        textTransform: 'uppercase',
        color: colors.text.light,
        fontSize: 12
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    input: {
        width: '75%',
        color: colors.text.default,
        fontWeight: '700',
        fontSize: 15
    }
})
