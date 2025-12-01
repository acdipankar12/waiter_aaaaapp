import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import { Image } from 'react-native'
// import AntDesign from '@expo/vector-icons/AntDesign';
// import Feather from '@expo/vector-icons/Feather';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FeatherIcon from 'react-native-vector-icons/Feather';
import RenderHtml from 'react-native-render-html';
import HTML from 'react-native-render-html';

const FoodCard = ({ onPress, food }) => {
    return (
        <View style={styles.card}>
            <Image source={{ uri: food.url }} style={styles.image} />

            <View style={styles.infoContainer}>
                <View style={styles.headerRow}>
                    <Text style={styles.title}>{food.name}</Text>
                    <Text style={styles.price}>{

                        food?.offerprice && !isNaN(Number(food.offerprice))
                            ? `$${Number(food.offerprice).toFixed(2)}`
                            : ''


                    }</Text>
                </View>
                <View style={styles.descriptionRow}>
                    <View>
                        <HTML html={food?.description}
                            containerStyle={styles?.description}
                        //    imagesMaxWidth={Dimensions.get('window').width}
                        />
                    </View>




                </View>
                <View>
                    <View style={[styles.actions]}>
                        <TouchableOpacity style={styles.iconButton}>
                            <AntDesignIcon name="appstore1" size={16} color="#fff" style={styles.ico1} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onPress} style={styles.addButton}>
                            <FeatherIcon name="plus" size={16} color="#fff" style={styles.ico2} onPress={onPress} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}


//  
//                    

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        padding: 10,
        // marginHorizontal: 12,
        marginVertical: 6,
        borderRadius: 10,
        backgroundColor: '#fff',
        borderColor: "#CCCCCC80",
        borderWidth: 1,
        alignItems: 'flex-start',
        maxWidth: '100%'
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 8,
        marginRight: 10,
        marginTop: 6, // Slightly down so it's aligned with description
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    title: {
        fontWeight: '600',
        fontSize: 14,
        flex: 1,
    },
    price: {
        fontWeight: '600',
        fontSize: 15,
        color: '#08D61D',
        marginLeft: 10,
    },
    descriptionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'nowrap',
        marginTop: 4,
        maxWidth: '100%'


         
    },
    description: {
        color: '#333333',
        fontSize: 13,
        flexShrink: 1,
        fontWeight: "400",
        width: '100%',
    },
    actions: {
        flexDirection: 'row',
        gap: 6,
        alignSelf: "flex-end",
        marginLeft: 10,
        position: 'relative'
    },
    iconButton: {
        backgroundColor: '#FFA235',
        borderRadius: 20,
        padding: 6,
    },
    addButton: {
        backgroundColor: '#08D61D',
        borderRadius: 20,
        padding: 6,
    },
});
export default FoodCard