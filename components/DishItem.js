import React from 'react'
import { Image, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import colors from '../constants/colors';
import { AntDesign } from '@expo/vector-icons';
import Shimmer from './Shimmer';


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
                {props.description ? <Text style={dishStyles.description} numberOfLines={2} >{props.description}</Text> : null}
            </View>
        </View>
        <View style={[dishStyles.imageContainer, { justifyContent: props.image ? 'flex-end' : 'center' }]}>
            <Image source={{ uri: props.image ? props.image : null }} style={dishStyles.image} />

            <View style={dishStyles.button}>
                {!(props.cartDishes).includes(props.id) ?
                    Platform.OS == "android" ?
                        <Pressable style={dishStyles.addButton} android_ripple={{ color: colors.light }} onPress={props.addToCart}>
                            <Text style={dishStyles.addText}>Add</Text>
                        </Pressable>
                        :
                        <TouchableOpacity style={dishStyles.addButton} onPress={props.addToCart}>
                            <Text style={dishStyles.addText}>Add</Text>
                        </TouchableOpacity>
                    :
                    <View style={dishStyles.addRemoveContainer}>
                        <TouchableOpacity style={dishStyles.plusMinusButton} onPress={props.removeFromCart}>
                            <AntDesign name="minus" size={16} color={colors.text.dark} />
                        </TouchableOpacity>
                        <Text style={dishStyles.quantityText}>{props.getQuantity}{/* dynamically change quantity, no of occurence of id in the array cartDishes */}</Text>
                        <TouchableOpacity style={dishStyles.plusMinusButton} onPress={props.addToCart} /* on Press, push the item id to the array*/>
                            <AntDesign name="plus" size={16} color={colors.text.dark} />
                        </TouchableOpacity>
                    </View>
                }
            </View>
        </View>
    </View>
);

export const LoadingDishItem = (props) => {
    return (
        <View style={[dishStyles.container, { height: props.image ? 150 : 100 }]}>
            <View style={dishStyles.detailsContainer}>
                <View style={dishStyles.vegIndicatorContainer}>
                    <View style={dishStyles.vegIndicator}>
                        <Shimmer width={'100%'} height={'100%'} />
                    </View>
                </View>
                <View style={[dishStyles.detailsText,]}>
                    <View style={{ height: 15, width: 100, marginBottom: 5 }}>
                        <Shimmer width={'100%'} height={'100%'} />
                    </View>
                    <View style={{ height: 15, width: 50, marginBottom: 5 }}>
                        <Shimmer width={'100%'} height={'100%'} />
                    </View>
                    {props.description ?
                        <View style={{ height: 25, width: '90%' }}>
                            <Shimmer width={'100%'} height={'100%'} />
                        </View>
                        :null
                    }

                </View>
            </View>
            <View style={[dishStyles.imageContainer, { justifyContent: props.image ? 'flex-end' : 'center' }]}>
                {props.image ?
                    <View style={[dishStyles.image, { overflow: "hidden" }]}>
                        <Shimmer width={'100%'} height={'100%'} />
                    </View>
                    :
                    <View style={[dishStyles.button, { overflow: 'hidden' }]}>
                        <Shimmer width={'100%'} height={'100%'} />
                    </View>}
            </View>
        </View>
    )
}
export default DishItem


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
        color: colors.text.dark,
        fontWeight: '700',
        textTransform: 'uppercase'
    }

});