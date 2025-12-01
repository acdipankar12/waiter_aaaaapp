import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import FeatherIcon from 'react-native-vector-icons/Feather';

const SubCategories = ({ item, isSelected, onPress }) => {
    const obj = item?.name ? JSON.parse(item.name) : {};

    const firstValue = obj[Object.keys(obj)[0]];
    return (
        <TouchableOpacity
            key={item?.id}
            onPress={() => onPress(item)}
            style={[styles.pill, isSelected && styles.selectedPill, {
                flexDirection: 'row',
                alignItems: 'center',
                borderBottomColor: isSelected ? '#0000ff' : '#FFFFFF',
                borderBottomWidth: 1
            }]}
        >
            <Text style={[styles.pillText, isSelected && styles.selectedText]}>
                {firstValue}
            </Text>
            {
                // Show chevron when this item has nested children (handle both naming styles)
                ((item?.childrenCategories && item.childrenCategories.length > 0) || (item?.children_categories && item.children_categories.length > 0)) && (
                    <FeatherIcon
                        name='chevron-down'
                        color={isSelected ? '#0000ff' : '#000000'}
                        size={16}
                    />
                )
            }

        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    pill: {
        // backgroundColor: '#f0f0ff',
        paddingVertical: 8,
        paddingHorizontal: 15,
        // borderRadius: 20,
        marginRight: 10,

    },
    selectedPill: {
        // backgroundColor: '#0000ff',
    },
    pillText: {
        color: '#000000',
        fontFamily: "Jost_400Regular"
    },
    selectedText: {
        color: '#0000ff',
    },
});
export default SubCategories