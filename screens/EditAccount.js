import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import { port } from '../App'
import EditButton from '../components/EditButton'
import PrimaryButton from '../components/PrimaryButton'
import SecondaryButton from '../components/SecondaryButton'
import colors from '../constants/colors'
import { auth } from '../firebase'

const EditAccount = ({ route, navigation }) => {
    const { toUpdate } = route.params

    const [nameOfUser, setNameOfUser] = useState('')
    const [email, setEmail] = useState('')
    const [graduation, setGraduation] = useState('')

    const [editName, setEditName] = useState(false)
    const [editMail, setEditMail] = useState(false)
    const [editGraduation, setEditGraduation] = useState(false)

    const UID = auth.currentUser.uid

    useEffect(() => {
        const getDetails = async () => {
            const userDetails = await axios.get(`${port}/users/${UID}`)
            let data = userDetails.data
            if (data) {
                if (data.name) {
                    setNameOfUser(data.name)
                }
                if (data.email) {
                    setEmail(data.email)
                }
                if (data.graduationYear) {
                    setGraduation(data.graduationYear)
                }

                // get initial input state from firestore

                // when the user presses cancel on any form, the state should be set to the values from the firestore
            }
        }
        getDetails()
        return
    }, [])

    const getName = async () => {
        const userDetails = await axios.get(`${port}/users/${UID}`)
        let data = userDetails.data
        if (data) {
            if (data.name) {
                setNameOfUser(data.name)
            }
        }
    }

    const getEmail = async () => {
        const userDetails = await axios.get(`${port}/users/${UID}`)
        let data = userDetails.data
        if (data) {
            if (data.email) {
                setEmail(data.email)
            }
        }
    }

    const getGraduation = async () => {
        const userDetails = await axios.get(`${port}/users/${UID}`)
        let data = userDetails.data
        if (data) {
            if (data.graduationYear) {
                setGraduation(data.graduationYear)
            }
        }
    }

    const handleNameUpdate = () => {
        axios.patch(`${port}/users/${UID}`, {
            name: nameOfUser
        })
        setEditName(false)
        toUpdate(true)
    }

    const handleMailUpdate = () => {
        axios.patch(`${port}/users/${UID}`, {
            email
        })
        setEditMail(false)
        toUpdate(true)
    }

    const handleGraduationUpdate = () => {
        axios.patch(`${port}/users/${UID}`, {
            graduationYear: parseInt(graduation)
        })
        setEditGraduation(false)
        toUpdate(true)
    }

    const NameButtons = () => {
        return (
            <View style={styles.updateAndCancel}>
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
            <View style={styles.updateAndCancel}>
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
            <View style={styles.updateAndCancel}>
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
                            style={[itemStyles.input, , { outline: 'none' }]}
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
                            style={[itemStyles.input, , { outline: 'none' }]}
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
                            style={[itemStyles.input, , { outline: 'none' }]}
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
    updateAndCancel: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 25,
        marginBottom: 10
    }
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
