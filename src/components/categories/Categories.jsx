import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'

const Categories = ({ item, isSelected, onPress }) => {
    return (
        <TouchableOpacity
            key={item?.id}
            onPress={() => onPress(item)}
            style={[styles.pill, isSelected && styles.selectedPill]}
        >
            <Text style={[styles.pillText, isSelected && styles.selectedText]}>
                {item?.name}
            </Text>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    pill: {
        backgroundColor: '#f0f0ff',
        paddingVertical: 8,
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