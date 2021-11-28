import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Image, Platform, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from "../constants/colors";
import { auth, firestore } from "../firebase";
import DishItem from "../components/DishItem";

const RestaurantScreen = ({ route, navigation }) => {
    const { restaurantID, restaurantName } = route.params;
    navigation.setOptions({
        headerTitle: restaurantName,
    });



    // cartPriceHandler()
    // Build a logic to fetch cart items from the database at initial render
    const UID = auth.currentUser.uid

    const [dishes, setDishes] = useState([])

    const [cartDishes, setCartDishes] = useState([])
    const [doNotRemoveState, setDoNotRemoveState] = useState(0)

    const [cartPrice, setCartPrice] = useState(0)

    // getting the dishes which are added in the cart
    useEffect(() => {
        getDishes()
        getCart()
        return
    }, [])

    // Gets the array of dishIDs and cart total present in the cart
    const getCart = () => {
        firestore.collection('users').doc(UID).get()
            .then((doc) => {
                if (doc.data().cart.restaurantID == restaurantID) {
                    setCartDishes(doc.data().cart.dishes)
                    setCartPrice(doc.data().cart.cartTotal)
                }
            })
    }

    // Updates the cart details like dishes array, cart total, restaurantID in the database 
    const updateCart = async () => {
        firestore.collection('users').doc(UID).set({
            cart: {
                dishes: cartDishes,
                restaurantID: restaurantID,
                cartTotal: cartPrice
            }
        }, { merge: true })

        // add a logic to change a state to update cart screen every time that state changes i.e. every time we update Cart
    }

    // triggers every time we add an item to the cart
    const addToCart = (id, price) => {
        setDoNotRemoveState(doNotRemoveState + price)
        // Do not remove setDoNotRemoveState as it breaks the functionality even if it not in use
        let arr = cartDishes
        arr.push(id)
        setCartDishes(arr)
        updateCart()
        cartPriceHandler()
    }

    // Method for getting the cart total amount, updates the state, updates cart total in the database
    const cartPriceHandler = () => {
        let frequency = {}
        for (let num of cartDishes) {
            frequency[num] = frequency[num] ? frequency[num] + 1 : 1
        }
        // This gives me frequency of cart Items as {"dishID": occurrences, "anotherDishID": occurrences }

        let priceObj = {}
        dishes.forEach(el => {
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

        // Seems similar to updateCart but is not. It uses a local variable instead of a state variable to update cart total to the database 
        firestore.collection('users').doc(UID).set({
            cart: {
                dishes: cartDishes,
                restaurantID: restaurantID,
                cartTotal: price
            }
        }, { merge: true })
    }

    // triggers every time we remove an item to the cart
    const removeFromCart = (id, price) => {
        let removeDishes = cartDishes
        let index = removeDishes.indexOf(id)
        if (index > -1) {
            removeDishes.splice(index, 1)
        }
        setCartDishes(removeDishes)
        // Do not remove setDoNotRemoveState as it breaks the functionality even if it not in use
        setDoNotRemoveState(doNotRemoveState - price)
        updateCart()
        cartPriceHandler()
    }

    // Method for getting the amount of same dishes in the cart => returns a number
    const getQuantity = (id) => {
        let array = []
        for (var i of cartDishes) {
            array.push(i)
        }
        let count = {}
        for (let num of array) {
            count[num] = count[num] ? count[num] + 1 : 1
        }
        return (count[id])
    }

    // gets all the dishes from the restaurant and updates the state to an array of dishIDs
    const getDishes = () => {
        firestore.collection('restaurants').doc(restaurantID).get().then((querySnapshot) => {
            let dishesArr = (querySnapshot.data().dishes)
            setDishes(dishesArr)
        })
    }

    const Cart = () => <View style={[cartStyles.container,
    { display: cartDishes.length == 0 ? "none" : "flex" }
    ]}>
        {Platform.OS == "android"
            ?
            <Pressable onPress={() => {
                navigation.navigate('Cart')
            }} android_ripple={{ color: colors.text.default, }} style={cartStyles.subContainer}>
                <View>
                    <Text style={cartStyles.detailsText}>{cartDishes.length} Item{cartDishes.length == 1 ? '' : 's'} {/*'s' only when more than one items*/} |  ₹{cartPrice}</Text>
                </View>
                <View>
                    <Text style={cartStyles.text}>Go to cart</Text>
                </View>
            </Pressable>
            :
            <TouchableOpacity onPress={() => {
                navigation.navigate('Cart')
            }} style={cartStyles.subContainer}>
                <View>
                    <Text style={cartStyles.detailsText}>{cartDishes.length} Item{cartDishes.length == 1 ? '' : 's'} {/*'s' only when more than one items*/} |  ₹{cartPrice}</Text>
                </View>
                <View>
                    <Text style={cartStyles.text}>Go to cart</Text>
                </View>
            </TouchableOpacity>

        }
        {/* Add conditional touchable opacity support for ios devices  */}

    </View>

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={dishes}
                renderItem={({ item }) =>
                    <DishItem
                        cartDishes={cartDishes}
                        dishName={item.name}
                        isNonVeg={item.nonveg}
                        getQuantity={getQuantity(item.dishID)}
                        price={item.price}
                        description={item.description}
                        image={item.imageURI}
                        id={item.dishID}
                        addToCart={() => addToCart(item.dishID, item.price)}
                        removeFromCart={() => removeFromCart(item.dishID, item.price)}
                    />
                }
                keyExtractor={item => item.dishID}
            />
            <Cart />
        </SafeAreaView>
    );
};

export default RestaurantScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
    },
});


const cartStyles = StyleSheet.create({
    container: {
        borderRadius: 10,
        backgroundColor: colors.primary,
        overflow: 'hidden',
        height: 50,
        marginHorizontal: 20,
        marginBottom: 10,
    },
    subContainer: {
        paddingHorizontal: 20,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    detailsText: {
        color: colors.text.default,
        fontWeight: '700',
    },
    text: {
        color: colors.text.default,
        textTransform: 'uppercase',
        fontWeight: '700',
    }
})