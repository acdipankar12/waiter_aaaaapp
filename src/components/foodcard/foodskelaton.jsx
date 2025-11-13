import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

const Shimmer = ({ style }) => {
    const shimmerAnim = useRef(new Animated.Value(-1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(shimmerAnim, {
                toValue: 1,
                duration: 1200,
                useNativeDriver: true,
            })
        ).start();
    }, [shimmerAnim]);

    const translateX = shimmerAnim.interpolate({
        inputRange: [-1, 1],
        outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
    });

    return (
        <View style={[style, { overflow: 'hidden' }]}>
            <Animated.View
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: '100%',
                    width: '100%',
                    transform: [{ translateX }],
                    backgroundColor: 'rgba(200,200,200,0.2)',
                    opacity: 0.6,
                }}
            />
        </View>
    );
};

const FoodCardSkeleton = () => (
    <View style={styles.card}>
        <View style={styles.imageSkeleton}>
            <Shimmer style={styles.imageSkeleton} />
        </View>
        <View style={styles.infoContainer}>
            <View style={styles.headerRow}>
                <View style={styles.titleSkeleton}>
                    <Shimmer style={styles.titleSkeleton} />
                </View>
                <View style={styles.priceSkeleton}>
                    <Shimmer style={styles.priceSkeleton} />
                </View>
            </View>
            <View style={styles.descriptionRow}>
                <View style={styles.descriptionSkeleton}>
                    <Shimmer style={styles.descriptionSkeleton} />
                </View>
                <View style={styles.actionsSkeleton}>
                    <View style={styles.iconButtonSkeleton}>
                        <Shimmer style={styles.iconButtonSkeleton} />
                    </View>
                    <View style={styles.addButtonSkeleton}>
                        <Shimmer style={styles.addButtonSkeleton} />
                    </View>
                </View>
            </View>   
        </View>
    </View>
);

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        padding: 10,
        marginVertical: 6,
        borderRadius: 10,
        backgroundColor: '#fff',
        borderColor: "#CCCCCC80",
        borderWidth: 1,
        alignItems: 'flex-start',
    },
    imageSkeleton: {
        width: 70,
        height: 70,
        borderRadius: 8,
        marginRight: 10,
        marginTop: 6,
        backgroundColor: '#eee',
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
    titleSkeleton: {
        width: 80,
        height: 16,
        backgroundColor: '#eee',
        borderRadius: 4,
    },
    priceSkeleton: {
        width: 40,
        height: 16,
        backgroundColor: '#eee',
        borderRadius: 4,
        marginLeft: 10,
    },
    descriptionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'nowrap',
        marginTop: 4
    },
    descriptionSkeleton: {
        width: 120,
        height: 14,
        backgroundColor: '#eee',
        borderRadius: 4,
        flexShrink: 1,
        maxWidth: '95%',
    },
    actionsSkeleton: {
        flexDirection: 'row',
        gap: 6,
        alignSelf: "flex-end",
        marginLeft: 10,
    },
    iconButtonSkeleton: {
        width: 28,
        height: 28,
        backgroundColor: '#eee',
        borderRadius: 20,
        marginRight: 6,
    },
    addButtonSkeleton: {
        width: 28,
        height: 28,
        backgroundColor: '#eee',
        borderRadius: 20,
    },
});

export default FoodCardSkeleton;