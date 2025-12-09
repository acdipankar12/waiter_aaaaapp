import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import FeatherIcon from 'react-native-vector-icons/Feather';

const Categories = ({ item, isSelected, onPress }) => {
    const obj = JSON.parse(item?.name);

    const firstValue = obj[Object.keys(obj)[0]];
    return (
        <TouchableOpacity
            key={item?.id}
            onPress={() => onPress(item)}
            style={[styles.pill, isSelected && styles.selectedPill, {
                flexDirection: 'row',
                alignItems: 'center'
            }]}
        >
            <Text style={[styles.pillText, isSelected && styles.selectedText , {fontSize:12}]}>
                {firstValue}
            </Text>
          

        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    pill: {
        backgroundColor: '#f0f0ff',
        paddingVertical: 9,
        paddingHorizontal: 15,
        borderRadius: 20,
        marginRight: 10,
    },
    selectedPill: {
        backgroundColor: '#0000ff',
    },
    pillText: {
        color: '#0000ff',
        fontFamily: "Jost_400Regular"
    },
    selectedText: {
        color: '#ffffff',
    },
});
export default Categories