import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import EditButton from '../components/EditButton'
import PrimaryButton from '../components/PrimaryButton'
import SecondaryButton from '../components/SecondaryButton'
import colors from '../constants/colors'
import { auth, firestore } from '../firebase'

const EditAccount = () => {

    const [nameOfUser, setNameOfUser] = useState()
    const [email, setEmail] = useState('')
    const [graduation, setGraduation] = useState()

    const UID = auth.currentUser.uid

    useEffect(() => {
        firestore.collection('users').doc(UID).get().then((doc => {
            if (doc.data()) {
                // 
            }
        })).catch((err) => console.log(err))
        return
    }, [])

    const EditItem = (props) => {
        const [edit, setEdit] = useState(false)


        // get the initial input state from the firestore

        const handleUpdate = () => {
            // take the input value and store it in firestore
            // set the setEdit(false)
        }
        const Buttons = () => {
            return (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 25, marginBottom: 10 }}>
                    <PrimaryButton text="Update" onPress={() => { handleUpdate() }} />
                    <SecondaryButton text="Cancel" onPress={() => setEdit(false)} />
                </View>
            )
        }

        return (
            <>
                <View style={[itemStyles.container, { borderColor: edit ? colors.primary : colors.light }]}>
                    <View>
                        <Text style={itemStyles.title}>{props.title}</Text>
                    </View>
                    <View style={itemStyles.inputContainer}>
                        <TextInput
                            style={itemStyles.input}
                            value={props.value}
                            placeholderTextColor={colors.text.default}
                            editable={edit ? true : false}
                            onChangeText={props.onChangeText}
                        />
                        <EditButton text="Edit" onPress={() => setEdit(!edit)} />
                    </View>

                </View>
                {edit ? <Buttons /> : null}
            </>
        )
    }

    return (
        <View>

            <EditItem title="Name" value={nameOfUser} onChangeText={(v) => setNameOfUser(v)} />
            <EditItem title="Email address" />
            <EditItem title="graduation year" />

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
