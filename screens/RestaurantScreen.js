import React, { useEffect, useState } from "react";
import { FlatList, Image, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from "../constants/colors";
import TextCustom from "../constants/TextCustom";
import { firestore } from "../firebase";

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

    const [dishes, setDishes] = useState([])

    const getDishes = () => {
        firestore.collection('restaurants').doc(restaurantID).get().then((querySnapshot) => {
            console.log(querySnapshot.data())
            dishesArr = (querySnapshot.data().dishes)
            setDishes(dishesArr)
            console.log(dishesArr)
            // querySnapshot.forEach(documentSnapshot =>{
            //     dishesArr.push(documentSnapshot.data().dishes)
            // })
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
                {Platform.OS == "android" ?
                    <Pressable style={dishStyles.button} android_ripple={{ color: colors.primary }}>
                        <Text style={dishStyles.addText}>Add</Text>
                    </Pressable>
                    :
                    <TouchableOpacity activeOpacity={0.7} style={dishStyles.button}>
                        <Text style={dishStyles.addText}>Add</Text>
                    </TouchableOpacity>
                }

            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={dishes}
                renderItem={({ item }) => <DishItem dishName={item.name} isNonVeg={item.nonveg} price={item.price} description={item.description} image={item.imageURI} />}
                keyExtractor={item => item.dishID}
            />
        </View>
    );
};

export default RestaurantScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10
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
        width: '50%',
        borderRadius: 3,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    addText: {
        color: colors.primary, fontWeight: '700',
        textTransform: 'uppercase'
    }

});
