import React from 'react';
import { View, StyleSheet } from 'react-native';

const CategoriesSkeleton = () => (
    <View style={styles.skeletonBox} />
);

const styles = StyleSheet.create({
    skeletonBox: {
        width: 80,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#eee',
        marginRight: 12,
        marginTop: 8,
    },
});

export default CategoriesSkeleton;