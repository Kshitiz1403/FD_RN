import { useNavigation } from '@react-navigation/core'
import React, { useState } from 'react'
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions, TextInput } from 'react-native'
import TextCustom from '../constants/TextCustom'
import { auth } from '../firebase'
import { SimpleLineIcons } from '@expo/vector-icons';
import colors from '../constants/colors'
import { Feather } from '@expo/vector-icons';
import Modal from "react-native-modal";
import { Picker } from '@react-native-picker/picker'

const Explore = () => {

    const [selectedHostel, setSelectedHostel] = useState()
    const [roomNumber, setRoomNumber] = useState()

    const [address, setAddress] = useState({ roomNo: NaN, hostel: null })
    // fetch address from firebase and store it in initial state


    const [isAddressModalVisible, setIsAddressModalVisible] = useState(false)

    const navigation = useNavigation()

    const handleSignOut = () => {
        auth
            .signOut()
            // .then(() => {
            //     navigation.replace("Login")
            // })
            // .catch((err) => alert(err))
    }

    let handleHostelIdentifier
    if (address.hostel == 'girls') {
        handleHostelIdentifier = "Girls"
    }
    else if (address.hostel == 'boys1') {
        handleHostelIdentifier = "Boys(Old)"
    }
    else if (address.hostel == 'boys2') {
        handleHostelIdentifier = "Boys(New)"
    }
    else {
        handleHostelIdentifier = NaN
    }

    const DeliverTo = () => {
        return (
            <View>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'flex-end' }} onPress={toggleAddressModal}>
                    <TextCustom>Deliver to  </TextCustom>
                    <SimpleLineIcons name="arrow-down" size={14} color="white" />
                </TouchableOpacity>
                <TextCustom style={{ color: colors.primary }} numberOfLines={1}>{address.roomNo} Room number in {handleHostelIdentifier} Hostel </TextCustom>
            </View>)
    }

    const toggleAddressModal = () => {
        setIsAddressModalVisible(!isAddressModalVisible)
    }

    const Search = () => {
        return <View style={[styles.searchContainer, { width: useWindowDimensions().width * 0.8 }]}>
            <Feather name="search" size={20} color={colors.light} />
            <TextInput placeholder="Search for food, restaurant, etc." placeholderTextColor={colors.text.light} style={styles.searchInput} numberOfLines={1} />
        </View>
    }
    navigation.setOptions({
        headerTitle: () => <DeliverTo />
    })

    const handleSaveAddress = () => {
        // Implement firebase logic to save address to the firestore database


        setAddress({ roomNo: roomNumber, hostel: selectedHostel })
        toggleAddressModal()
    }
    return (
        <View>
            <View style={{ alignItems: 'center', marginTop: 10 }}>
                <Search />
            </View>
            <Modal isVisible={isAddressModalVisible} onBackButtonPress={toggleAddressModal} animationInTiming={200} onBackdropPress={toggleAddressModal}>
                <View style={styles.addressModalContainer}>
                    <TextInput
                        value={roomNumber}
                        onChangeText={(v) => setRoomNumber(v)}
                        placeholder="Room Number"
                        placeholderTextColor={colors.text.light}
                        keyboardType="number-pad"
                        textAlign="center"
                        style={styles.addressInput} />
                    <Text style={{ color: colors.text.light }}>Select hostel</Text>
                    <Picker
                        selectedValue={selectedHostel}
                        onValueChange={(itemValue, itemIndex) =>
                            setSelectedHostel(itemValue)
                        }
                        style={{ width: '80%', color: colors.text.light, alignItems: 'center' }}
                        mode="dropdown"
                        dropdownIconColor={colors.light}
                    >
                        <Picker.Item label="Girls" value="girls" />
                        <Picker.Item label="Boys(Old)" value="boys1" />
                        <Picker.Item label="Boys(New)" value="boys2" />
                    </Picker>
                    <TouchableOpacity
                        onPress={handleSaveAddress}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Save Address</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
            <TouchableOpacity onPress={handleSignOut} style={{ marginTop: 150 }}>
                <TextCustom>Sign Out</TextCustom>
            </TouchableOpacity>
        </View>
    )
}

// Explore.navigationOptions = {
//     headerTitle:'Test'
// }

export default Explore

const styles = StyleSheet.create({
    heading: {
        fontSize: 28
    },
    searchContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: colors.light,
        borderRadius: 10,
        padding: 10,
        paddingHorizontal: 15,
        alignItems: 'center',
    },
    searchInput: {
        marginHorizontal: 20
    },
    addressModalContainer: {
        width: '75%',
        paddingVertical: 20,
        backgroundColor: colors.dark,
        borderRadius: 10,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    addressInput: {
        color: colors.text.default,
        borderBottomWidth: 1,
        borderBottomColor: colors.text.light,
        width: '70%',
        marginBottom: 20
    },
    button: {
        backgroundColor: '#EA7C69',
        // width: '60%',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10
    },
    buttonText: {
        color: 'white',
        fontWeight: '500',
        fontSize: 15,
        alignSelf: 'center',
    },


})
