import React, { useEffect, useState } from 'react'
import { FlatList, Image, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import colors from '../constants/colors'
import { auth, firestore } from '../firebase';
import { useIsFocused, useNavigation } from '@react-navigation/core';
import DishItem from '../components/DishItem';
import { Entypo } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Lottie from 'lottie-react';

const Cart = ({ route, navigation }) => {
    const auth = getAuth()
    const UID = auth.currentUser.uid
    const userRef = doc(firestore, 'users', UID)

    let isFocused = useIsFocused()

    const [restaurantID, setRestaurantID] = useState('')
    const [allDishesData, setAllDishesData] = useState([])
    const [cartDishIDs, setCartDishIDs] = useState([])
    const [allCartDishesData, setAllCartDishesData] = useState([])
    const [restaurantData, setRestaurantData] = useState({})
    const [uniqueAllCartDishesData, setUniqueAllCartDishesData] = useState([])
    const [cartPrice, setCartPrice] = useState(0)
    const [isCartEmpty, setIsCartEmpty] = useState(true)


    useEffect(() => {
        const script = document.createElement("script")
        script.src = "https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"
    }, [])



    // re- renders every time the screen is brought to focus 
    useEffect(() => {
        fetchCartInfo()
    }, [isFocused == true])

    // sets the tab bar badge to the amount of items in the cart
    useEffect(() => {
        navigation.setOptions({
            tabBarBadge: cartDishIDs.length
        })
        if (cartDishIDs.length != 0) {
            setIsCartEmpty(false)
        }
        else {
            setIsCartEmpty(true)
        }
    }, [cartDishIDs])

    // fetches the IDs of dishes in the cart and stores in a state variable
    const fetchCartInfo = async () => {
        const userSnapshot = await getDoc(userRef)
        // data from the logged in user stored in "data"
        let data = userSnapshot.data()
        let cartDishIDsArr = []
        let allDishesArr = []
        if (data.cart) {
            // array of all the IDs of dishes added in the cart of the user
            cartDishIDsArr = data.cart.dishes
            setCartDishIDs(data.cart.dishes)
            setCartPrice(data.cart.cartTotal)

            // restaurant ID of the restaurant whose dishes are in cart
            setRestaurantID(data.cart.restaurantID)
            let restoID = data.cart.restaurantID

            const restaurantRef = doc(firestore, 'restaurants', restoID)
            const restaurantSnapshot = await getDoc(restaurantRef)

            // restaurant data stored in restoData
            let restoData = restaurantSnapshot.data()
            setRestaurantData(restoData)

            // list of all dishes from that restaurant
            allDishesArr = restoData.dishes
            setAllDishesData(restoData.dishes)

            // array of data of dishes in cart with information like price, non veg, name, dishID, etc. 
            let cartDishesDataArr = []
            for (var i of allDishesArr) {
                for (var j of cartDishIDsArr) {
                    if (i.dishID == j) {
                        cartDishesDataArr.push(i)
                    }
                }
            }
            setAllCartDishesData(cartDishesDataArr)

            let arr = cartDishesDataArr
            let unique = []
            for (let el of arr) {
                if (!unique.includes(el)) {
                    unique.push(el)
                }
            }
            // setting only the unique cart dishes which is later used to render Flatlist. Used for rendering only the unique dishes in the flatlist and later increasing the quantity only without adding more items to Flatlist 
            setUniqueAllCartDishesData(unique)
        }
    }

    // Responsible for handling the total cart value => returns total cart value (number) 
    const priceHandler = (cartIDS) => {
        let frequency = {}
        for (let num of cartIDS) {
            frequency[num] = frequency[num] ? frequency[num] + 1 : 1
        }
        // This gives me frequency of cart Items as {"dishID": occurrences, "anotherDishID": occurrences }

        let priceObj = {}
        allCartDishesData.forEach(el => {
            priceObj[el.dishID] = el.price
        })
        // This gives me priceObj as {"dishID":itsPrice, "anotherDishID":itsPrice}

        let price = 0
        for (let i in priceObj) {
            for (let j in frequency) {
                if (j == i) {
                    price += (priceObj[i] * frequency[j])
                }
            }
        }
        setCartPrice(price)
        return price
    }


    // Returns the quantity of every dish in the cart => Return type = number
    const getQuantity = (id) => {
        let freq = {}
        let arr = [...cartDishIDs]
        for (let num of arr) {
            freq[num] = freq[num] ? freq[num] + 1 : 1
        }
        return freq[id]
    }

    // Responsible for updating changes to the firestore database. Changes => array of dishIDs, restaurantID (whose dishes are in the cart), cartTotal
    const updateCart = async (arr, price) => {
        setDoc(userRef, {
            cart: {
                dishes: arr,
                restaurantID: restaurantID,
                cartTotal: price
            }
        }, { merge: true })
    }

    // Responsible for reducing item quantity by 1 and later updating that value to the database
    const removeFromCart = async (id) => {
        let removeDishes = [...cartDishIDs]
        let index = removeDishes.indexOf(id)
        if (index > -1) {
            removeDishes.splice(index, 1)
        }
        setCartDishIDs(removeDishes)
        let price = priceHandler(removeDishes)
        updateCart(removeDishes, price)
        // priceHandler(removeDishes)
        // add update Cart i.e. to handle updates on firestore
        // add cartpricehandler i.e. to handle total amount in the cart
    }

    // Responsible for increasing item quantity by 1 and later updating that value to the database
    const addToCart = (id) => {
        let arr = [...cartDishIDs]
        arr.push(id)
        setCartDishIDs(arr)
        let price = priceHandler(arr)
        updateCart(arr, price)
    }


    const RestaurantDetails = () => (
        <View style={restaurantStyles.container}>
            <View style={restaurantStyles.imageContainer}>
                <Image source={{ uri: restaurantData.imageURI }} style={restaurantStyles.image} />
            </View>
            <View>
                <Text style={restaurantStyles.restaurantName}>{restaurantData.restaurantName ? restaurantData.restaurantName : "Restaurant"}</Text>
                <View style={restaurantStyles.ratingContainer}>
                    <Entypo name="star" size={16} color={colors.light} style={restaurantStyles.star} />
                    <View>
                        <Text style={restaurantStyles.ratingText}>{restaurantData.rating ? restaurantData.rating : "Not available"}</Text>
                    </View>
                </View>
                <View style={restaurantStyles.cuisinesContainer}>
                    <Text style={restaurantStyles.cuisines}>{restaurantData.cuisines}</Text>
                </View>
            </View>
        </View>
    )

    return (<>
        {isCartEmpty ?
            <View style={emptyCartStyles.container}>
                <div>
                    <Lottie animationData={require('../assets/animations/emptyCart.json')} style={{ width: '90%' }} />
                </div>
                <View style={emptyCartStyles.textContainer}>
                    <Text style={emptyCartStyles.text}>{`My stomach is empty.`}</Text>
                    <Text style={emptyCartStyles.text}>{`Please add some items in it!`}</Text>
                </View>
            </View>
            :
            <View style={styles.container}>
                <RestaurantDetails />
                <FlatList
                    style={{ backgroundColor: colors.dark, paddingHorizontal: 10 }}
                    data={uniqueAllCartDishesData}
                    keyExtractor={item => item.dishID}
                    renderItem={({ item }) => (
                        <DishItem
                            cartDishes={cartDishIDs}
                            dishName={item.name}
                            id={item.dishID}
                            price={item.price}
                            isNonVeg={item.nonveg}
                            getQuantity={getQuantity(item.dishID)}
                            removeFromCart={() => removeFromCart(item.dishID)}
                            addToCart={() => addToCart(item.dishID)}
                        />
                    )}
                />
            </View>
        }
    </>
    )
}

export default Cart

const styles = StyleSheet.create({
    container: {
        // margin: 10
    }
})

const restaurantStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        borderColor: colors.light,
        borderBottomWidth: 1.5,
        backgroundColor: colors.dark,
        padding: 10,
        marginBottom: 20,
        borderTopWidth: 1.5
    },
    imageContainer: {
        width: 75,
        height: 75,
        marginEnd: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 5
    },
    restaurantName: {
        color: colors.text.default,
        fontWeight: '700',
        fontSize: 16
    },
    ratingContainer:
    {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2
    },
    star: {
        marginRight: 5
    },
    ratingText: {
        fontWeight: '700',
        color: colors.light,
        fontSize: 13,
        textAlign: 'center'
    },
    cuisinesContainer: {
        marginTop: 2
    },
    cuisines: {
        color: colors.light
    }
})

const emptyCartStyles = StyleSheet.create({
    container: {
        justifyContent: 'center', alignItems: 'center', flex: 1, width: '100%'
    },
    animation: {
        width: '90%'
    },
    textContainer: {
        alignItems: 'center',
        width: '100%'
    },
    text: {
        color: colors.text.light, fontSize: 18, fontWeight: '700', width: '70%', textAlign: 'center'
    }
})