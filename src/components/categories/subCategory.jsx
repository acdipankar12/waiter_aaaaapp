import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import FeatherIcon from 'react-native-vector-icons/Feather';

const SubCategories = ({ item, isSelected, onPress }) => {
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
            <Text style={[styles.pillText, isSelected && styles.selectedText]}>
                {firstValue}
            </Text>
            {
                typeof item?.childrenCategories != null && item?.childrenCategories?.length != 0 && (
                    <FeatherIcon
                        name='chevron-down'
                        color={isSelected ? '#FFFFFF' : '#0000ff'}
                        size={20}
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
        borderBottomColor: '#0000ff',
        borderBottomWidth: 1
    },
    selectedPill: {
        // backgroundColor: '#0000ff',
    },
    pillText: {
        color: '#0000ff',
        fontFamily: "Jost_400Regular"
    },
    selectedText: {
        color: '#ffffff',
    },
});
export default SubCategories