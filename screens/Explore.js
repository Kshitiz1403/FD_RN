import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions, TextInput, Image, FlatList, Platform } from 'react-native'
import TextCustom from '../constants/TextCustom'
import { auth, firestore } from '../firebase'
import { SimpleLineIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import colors from '../constants/colors'
import { Feather } from '@expo/vector-icons';
import Modal from "react-native-modal";
import { Picker } from '@react-native-picker/picker'
import PrimaryButton from '../components/PrimaryButton'
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore"; 
import Shimmer from '../components/Shimmer'

const Explore = () => {

    const [selectedHostel, setSelectedHostel] = useState()
    const [roomNumber, setRoomNumber] = useState()
    const [address, setAddress] = useState({ roomNo: NaN, hostel: null })
    const [restaurants, setRestaurants] = useState([])
    const [isAddressModalVisible, setIsAddressModalVisible] = useState(false)
    const [count, setCount] = useState(0)
    const [isLoaded, setIsLoaded] = useState(false)

    const user = auth.currentUser
    const UID = user.uid
    const userRef = doc(firestore, 'users', UID)

    useEffect(() => {
        const getAddress = async() =>{
            const querySnapshot = await getDoc(userRef)
            let data = querySnapshot.data()
            if (data?.address) {
                setAddress({ roomNo: data.address.roomNumber, hostel: data.address.hostel })
            }
        }
        getAddress()
        return
    }, [])
    useEffect(() => {
        getRestaurants()
        return
    }, [])

    useEffect(() => {
        navigation.setOptions({
            headerTitle: () => <DeliverTo />
        })
    }, [address])

    const navigation = useNavigation()



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


    let restaurantArray = []
    const getRestaurants = async () => {
        const querySnapshot = await getDocs(collection(firestore,'restaurants'))
        querySnapshot.forEach((doc)=>{
            restaurantArray.push({...doc.data(), id:doc.id})
        })
        setRestaurants(restaurantArray)
        setIsLoaded(true)
    }
    const DeliverTo = () => {
        return (
            <View>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent:Platform.OS=="ios"?"center":null }} onPress={toggleAddressModal}>
                    <Text style={{color:colors.text.default}}>Deliver to  </Text>
                    <SimpleLineIcons name="arrow-down" size={14} color="white" />
                </TouchableOpacity>
                <TextCustom style={{ color: colors.primary }} numberOfLines={1}>{address.roomNo} Room number in {handleHostelIdentifier} Hostel </TextCustom>
            </View>)
    }

    const toggleAddressModal = () => {
        setIsAddressModalVisible(!isAddressModalVisible)
    }

    const Search = () => {
        return <View style={[styles.searchContainer]}>
            <Feather name="search" size={20} color={colors.light} />
            <TextInput placeholder="Search for food, restaurant, etc." placeholderTextColor={colors.text.light} style={styles.searchInput} numberOfLines={1} />
        </View>
    }

    const handleSaveAddress = async () => {
        setAddress({ roomNo: roomNumber, hostel: selectedHostel })
        toggleAddressModal()

        setDoc(userRef, {address: {
            roomNumber: parseInt(roomNumber),
            hostel: selectedHostel
        }}, {merge:true})
    }

    const LoadingRestaurant = () => {
        return(
            <>
            <LoadingRestaurantItem/>
            <LoadingRestaurantItem/>
            <LoadingRestaurantItem/>
            </>
        )
        
    }
    const RestaurantItem = (props) => {
        return (
            <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Restaurant_Screen', { restaurantID: props.id, restaurantName: props.name})} style={[restaurantStyles.container, { width: useWindowDimensions().width }]}>
                <View style={restaurantStyles.imageContainer}>
                    <Image source={{ uri: props.imageURI }} style={restaurantStyles.image} />
                </View>
                <View style={restaurantStyles.detailsContainer}>
                    <Text numberOfLines={1} style={[restaurantStyles.titleText, { color: colors.text.default, }]}>{props.name}</Text>
                    <View style={[restaurantStyles.ratingContainer,]}>
                        <Entypo name="star" size={16} color={colors.light} style={{ marginRight: 5 }} />
                        <View>
                            <Text style={restaurantStyles.rating}>{props.rating ? props.rating : "Not available"}</Text>
                        </View>
                    </View>
                    <View>
                        <Text numberOfLines={1} style={restaurantStyles.cuisines}>
                            {props.cuisines}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            <View style={{ alignItems: 'center', marginTop: 10 }}>
                <Search />
            </View>
            <Modal isVisible={isAddressModalVisible} onBackButtonPress={toggleAddressModal} animationInTiming={200} onBackdropPress={toggleAddressModal}>
                <View style={styles.addressModalContainer}>
                    <TextInput
                        value={roomNumber}
                        onChangeText={(v) => setRoomNumber(v.replace(/[^0-9]/g, ''))}
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
                    <PrimaryButton text="Save Address" onPress={handleSaveAddress} />
                </View>
            </Modal>

            <>
            {!isLoaded ?<LoadingRestaurant/>:
            <FlatList
                showsHorizontalScrollIndicator={false}
                data={restaurants}
                renderItem={({ item }) => <RestaurantItem name={item.restaurantName} rating={item.rating} cuisines={item.cuisines} imageURI={item.imageURI} id={item.id} />}
                keyExtractor={item => item.id}
            />
            }
            </>
        </View>
    )
}

export const LoadingRestaurantItem = () =>{
    return(
        <View style={[restaurantStyles.container, { width: useWindowDimensions().width }]}>
            <View style={restaurantStyles.imageContainer}>
                <View style={{ width: '100%', aspectRatio: 1, overflow: 'hidden', borderRadius: 5, }}>
                    <Shimmer width='100%' height='100%' />
                </View>
            </View>
            <View style={restaurantStyles.detailsContainer}>
                <View style={{ width: 150, height: 15, marginBottom: 5 }}>
                    <Shimmer width={'100%'} height={'100%'} />
                </View>
                <View style={{ width: 50, height: 15, marginBottom: 5 }}>
                    <Shimmer width={'100%'} height={'100%'} />
                </View>
                <View style={{ width: 100, height: 15 }}>
                    <Shimmer width={'100%'} height={'100%'} />
                </View>
            </View>
        </View>
    )
}

export default Explore

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 10,
        flex: 1
    },
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
        width: '100%'
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
    restaurantContainer: {
        height: 100,
        marginVertical: 10,
        flexDirection: 'row'
    }
})

const restaurantStyles = StyleSheet.create({
    container: {
        height: 100,
        marginVertical: 10,
        flexDirection: 'row'
    },
    imageContainer: {
        height: '100%',
        width: '25%'
    },
    image: {
        height: '100%',
        width: '100%',
        borderRadius: 5
    },
    detailsContainer: {
        height: '100%', width: '75%',
        justifyContent: 'center',
        padding: 20
    },
    titleText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 2
    },
    rating: {
        color: colors.light,
        fontWeight: '700',
        fontSize: 12
    },
    cuisines: {
        color: colors.light
    }

})
