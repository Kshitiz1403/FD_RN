import React, { useEffect, useState } from "react";
import { FlatList, Image, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from "../constants/colors";
import { firestore } from "../firebase";
import { AntDesign } from '@expo/vector-icons';

const RestaurantScreen = ({ route, navigation }) => {
    const { restaurantID, restaurantName } = route.params;
    navigation.setOptions({
        headerTitle: restaurantName,
    });

    dishesArr = []
    useEffect(() => {
        getDishes()
        return
    }, [])

    // Build a logic to fetch cart items from the database at initial render
    // Build a logic to store the cart items to the database

    const [dishes, setDishes] = useState([])

    const [cartDishes, setCartDishes] = useState([])
    const [cartPrice, setCartPrice] = useState(0)

    const addToCart = (id, price) => {
        setCartDishes([...cartDishes, id])
        setCartPrice(cartPrice + price)
    }

    const removeFromCart = (id, price) => {
        let removeDishes = cartDishes
        let index = removeDishes.indexOf(id)
        if (index > -1) {
            removeDishes.splice(index, 1)
        }
        setCartDishes(removeDishes)
        setCartPrice(cartPrice - price)
    }

    const getQuantity = (id) => {
        let arr = cartDishes
        let count = {}
        for (let num of arr) {
            count[num] = count[num] ? count[num] + 1 : 1
        }
        return (count[id])
    }

    const getDishes = () => {
        firestore.collection('restaurants').doc(restaurantID).get().then((querySnapshot) => {
            dishesArr = (querySnapshot.data().dishes)
            setDishes(dishesArr)
        })
    }

    const DishItem = (props) => (
        <View style={[dishStyles.container, { height: props.image ? 150 : 100 }]}>
            <View style={dishStyles.detailsContainer}>
                <View style={dishStyles.vegIndicatorContainer}>
                    {props.isNonVeg ?
                        <Image source={require('../assets/nonveg.png')} style={dishStyles.vegIndicator} /> :
                        <Image source={require('../assets/veg.png')} style={dishStyles.vegIndicator} />
                    }
                </View>
                <View style={dishStyles.detailsText}>
                    <Text style={dishStyles.dishText}>{props.dishName}</Text>
                    <Text style={dishStyles.dishPrice}>₹{props.price}</Text>
                    <Text style={dishStyles.description} numberOfLines={2} >{props.description}</Text>
                </View>
            </View>
            <View style={[dishStyles.imageContainer, { justifyContent: props.image ? 'flex-end' : 'center' }]}>
                <Image source={{ uri: props.image }} style={dishStyles.image} />

                <View style={dishStyles.button}>
                    {!cartDishes.includes(props.id) ?
                        Platform.OS == "android" ?
                            <Pressable style={dishStyles.addButton} android_ripple={{ color: colors.primary }} onPress={() => addToCart(props.id, props.price)}>
                                <Text style={dishStyles.addText}>Add</Text>
                            </Pressable>
                            :
                            <TouchableOpacity style={dishStyles.addButton} onPress={() => addToCart(props.id, props.price)}>
                                <Text style={dishStyles.addText}>Add</Text>
                            </TouchableOpacity>
                        :
                        <View style={dishStyles.addRemoveContainer}>
                            <TouchableOpacity style={dishStyles.plusMinusButton} onPress={() => removeFromCart(props.id, props.price)}>
                                <AntDesign name="minus" size={16} color={colors.text.dark} />
                            </TouchableOpacity>
                            <Text style={dishStyles.quantityText}>{getQuantity(props.id)}{/* dynamically change quantity, no of occurence of id in the array cartDishes */}</Text>
                            <TouchableOpacity style={dishStyles.plusMinusButton} onPress={() => addToCart(props.id, props.price)} /* on Press, push the item id to the array*/>
                                <AntDesign name="plus" size={16} color={colors.text.dark} />
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            </View>
        </View>
    );

    const Cart = () => <View style={[cartStyles.container,
    { display: cartDishes.length == 0 ? "none" : "flex" }
    ]}>
        {Platform.OS == "android"
            ?
            <Pressable android_ripple={{ color: colors.text.default, }} style={[cartStyles.subContainer, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                <View>
                    <Text style={cartStyles.detailsText}>{cartDishes.length} Item{cartDishes.length == 1 ? '' : 's'} {/*'s' only when more than one items*/} |  ₹{cartPrice}</Text>
                </View>
                <View>
                    <Text style={cartStyles.text}>Go to cart</Text>
                </View>
            </Pressable>
            :
            <TouchableOpacity style={[cartStyles.subContainer, { flexDirection: 'row', justifyContent: 'space-between' }]}>
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
        <View style={styles.container}>
            <FlatList
                data={dishes}
                renderItem={({ item }) => <DishItem dishName={item.name} isNonVeg={item.nonveg} price={item.price} description={item.description} image={item.imageURI} id={item.dishID} />}
                keyExtractor={item => item.dishID}
            />
            <Cart />
        </View>
    );
};

export default RestaurantScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
    },
});

const dishStyles = StyleSheet.create({
    container: {
        flexDirection: "row",
        borderBottomWidth: 0.5,
        paddingVertical: 10,
        borderColor: colors.light,
    },
    detailsContainer: {
        width: "65%",
        flexDirection: 'row',
        alignItems: 'center',
    },
    vegIndicatorContainer: {
        marginRight: 12,
    },
    vegIndicator: {
        height: 20,
        width: 20,
    },
    detailsText: {
        flex: 1
    },
    dishText: {
        color: colors.text.default,
        fontWeight: 'bold',
        fontSize: 16
    },
    dishPrice: {
        color: colors.text.light
    },
    description: {
        color: colors.text.light,
        fontSize: 10
    },
    imageContainer: {
        width: "35%",
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10
    },
    button: {
        position: 'absolute',
        backgroundColor: colors.text.default,
        width: '60%',
        borderRadius: 5,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: colors.primary,
        borderWidth: 1.5,
    },
    addButton: {
        width: '100%',
        alignItems: 'center',
        height: '100%',
        justifyContent: 'center'
    },
    addRemoveContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center',
        height: '100%'
    },
    plusMinusButton: {
        height: '100%', flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityText: {
        flex: 0.7,
        textAlign: 'center',
        color: colors.text.dark,
    },
    addText: {
        color: colors.primary,
        fontWeight: '700',
        textTransform: 'uppercase'
    }

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
        justifyContent: 'center'
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