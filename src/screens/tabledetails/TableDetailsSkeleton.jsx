import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions, ScrollView } from 'react-native';
import { tableDetailstyles } from './styles';

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

const TableDetailsSkeleton = () => {
    return (
        <ScrollView style={tableDetailstyles.tableWrapper}>
            <View style={tableDetailstyles.tableBox}>
                {/* Header Skeleton */}
                {/* <View style={tableDetailstyles.header}>
                    <View style={styles.headerTextSkeleton}>
                        <Shimmer style={styles.headerTextSkeleton} />
                    </View>
                    <View style={styles.headerTextSkeleton2}>
                        <Shimmer style={styles.headerTextSkeleton2} />
                    </View>
                </View> */}

                {/* Food Items Skeleton - Render 3 items */}
                {[1, 2, 3].map((item, index) => (
                    <View key={index} style={tableDetailstyles.fooditem}>
                        {/* Item Header */}
                        <View style={tableDetailstyles.itemhead}>
                            <View style={styles.itemNameSkeleton}>
                                <Shimmer style={styles.itemNameSkeleton} />
                            </View>
                            <View style={styles.itemPriceSkeleton}>
                                <Shimmer style={styles.itemPriceSkeleton} />
                            </View>
                        </View>

                        {/* Description Skeleton */}
                        <View style={styles.descriptionSkeleton}>
                            <Shimmer style={styles.descriptionSkeleton} />
                        </View>
                        <View style={[styles.descriptionSkeleton, { width: '70%', marginTop: 4 }]}>
                            <Shimmer style={[styles.descriptionSkeleton, { width: '100%' }]} />
                        </View>

                        {/* Options Skeleton */}
                        <View style={tableDetailstyles.spicy}>
                            <View style={styles.optionNameSkeleton}>
                                <Shimmer style={styles.optionNameSkeleton} />
                            </View>
                            <View style={styles.choiceRowSkeleton}>
                                <View style={styles.choiceDotSkeleton}>
                                    <Shimmer style={styles.choiceDotSkeleton} />
                                </View>
                                <View style={styles.choiceTextSkeleton}>
                                    <Shimmer style={styles.choiceTextSkeleton} />
                                </View>
                            </View>
                            <View style={styles.choiceRowSkeleton}>
                                <View style={styles.choiceDotSkeleton}>
                                    <Shimmer style={styles.choiceDotSkeleton} />
                                </View>
                                <View style={[styles.choiceTextSkeleton, { width: 120 }]}>
                                    <Shimmer style={[styles.choiceTextSkeleton, { width: '100%' }]} />
                                </View>
                            </View>
                        </View>
                    </View>
                ))}
            </View>

            {/* Totals Section Skeleton */}
            <View style={tableDetailstyles.totals}>
                {/* Items Total */}
                <View style={tableDetailstyles.firstrow}>
                    <View style={styles.totalLabelSkeleton}>
                        <Shimmer style={styles.totalLabelSkeleton} />
                    </View>
                    <View style={styles.totalPriceSkeleton}>
                        <Shimmer style={styles.totalPriceSkeleton} />
                    </View>
                </View>

                {/* Tax & Charge */}
                <View style={tableDetailstyles.secondrow}>
                    <View style={styles.totalLabelSkeleton}>
                        <Shimmer style={styles.totalLabelSkeleton} />
                    </View>
                    <View style={styles.totalPriceSkeleton}>
                        <Shimmer style={styles.totalPriceSkeleton} />
                    </View>
                </View>

                {/* Grand Total */}
                <View style={tableDetailstyles.thirdrow}>
                    <View style={styles.totalLabelSkeleton}>
                        <Shimmer style={styles.totalLabelSkeleton} />
                    </View>
                    <View style={styles.totalPriceSkeleton}>
                        <Shimmer style={styles.totalPriceSkeleton} />
                    </View>
                </View>

                {/* Payment Section Skeleton */}
                <View style={styles.paymentSectionSkeleton}>
                    <View style={styles.paymentLabelSkeleton}>
                        <Shimmer style={styles.paymentLabelSkeleton} />
                    </View>
                    <View style={styles.paymentRowSkeleton}>
                        <View style={styles.paymentTextSkeleton}>
                            <Shimmer style={styles.paymentTextSkeleton} />
                        </View>
                        <View style={styles.radioButtonSkeleton}>
                            <Shimmer style={styles.radioButtonSkeleton} />
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    headerTextSkeleton: {
        width: 150,
        height: 18,
        backgroundColor: '#eee',
        borderRadius: 4,
    },
    headerTextSkeleton2: {
        width: 80,
        height: 18,
        backgroundColor: '#eee',
        borderRadius: 4,
    },
    itemNameSkeleton: {
        width: 120,
        height: 16,
        backgroundColor: '#eee',
        borderRadius: 4,
    },
    itemPriceSkeleton: {
        width: 60,
        height: 16,
        backgroundColor: '#eee',
        borderRadius: 4,
    },
    descriptionSkeleton: {
        width: '100%',
        height: 14,
        backgroundColor: '#eee',
        borderRadius: 4,
        marginTop: 6,
    },
    optionNameSkeleton: {
        width: 100,
        height: 14,
        backgroundColor: '#eee',
        borderRadius: 4,
        marginTop: 8,
    },
    choiceRowSkeleton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        marginTop: 4,
    },
    choiceDotSkeleton: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#eee',
    },
    choiceTextSkeleton: {
        width: 150,
        height: 14,
        backgroundColor: '#eee',
        borderRadius: 4,
    },
    totalLabelSkeleton: {
        width: 100,
        height: 16,
        backgroundColor: '#eee',
        borderRadius: 4,
    },
    totalPriceSkeleton: {
        width: 70,
        height: 16,
        backgroundColor: '#eee',
        borderRadius: 4,
    },
    paymentSectionSkeleton: {
        marginTop: 8,
        gap: 6,
    },
    paymentLabelSkeleton: {
        width: 80,
        height: 16,
        backgroundColor: '#eee',
        borderRadius: 4,
    },
    paymentRowSkeleton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 3,
    },
    paymentTextSkeleton: {
        width: 100,
        height: 16,
        backgroundColor: '#eee',
        borderRadius: 4,
    },
    radioButtonSkeleton: {
        width: 21,
        height: 21,
        borderRadius: 10.5,
        backgroundColor: '#eee',
    },
});

export default TableDetailsSkeleton;

