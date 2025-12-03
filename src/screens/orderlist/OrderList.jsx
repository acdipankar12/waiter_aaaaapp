import { View, Text, TouchableOpacity, ActivityIndicator, Modal, ScrollView, FlatList } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Header from '../../components/header/Header'
import { orderListstyles } from './styles'
// import Ionicons from '@expo/vector-icons/Ionicons';
// import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../../context/UserContext';
import { apiRequest } from '../../utils/apiService';
import { _retrieveStoreData } from '../../utils/store';
import moment from 'moment';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import Ionicons from "react-native-vector-icons/Ionicons";
import FoodCardSkeleton from '../../components/foodcard/foodskelaton';

const PER_PAGE = 10

const OrderList = () => {
    const navigation = useNavigation()
    const { cart } = useContext(UserContext)

    const [orderListData, setOrdeData] = useState([])
    const [loadingState, setLoadingState] = useState(false)
    const [loadingMore, setLoadingMore] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [pageNo, setPageNo] = useState(1)
    const [hasMore, setHasMore] = useState(true)

    async function fetchOrderlist({ page = 1, append = false, showLoader = true } = {}) {
        console.log(PER_PAGE, page, 'on reached end///////')
        if (append) {
            setLoadingMore(true)
        } else if (showLoader) {
            setLoadingState(true)
        }
        let _usertoken = await _retrieveStoreData('_waiter_token')

        try {
            const res = await apiRequest('waiter/order-list', 'post', {
                lang_id: '1',
                perPage: PER_PAGE,
                pageNo: page
            }, {

                "Content-Type": "application/json",
                "Accept": "application/json",
                'Authorization': `Bearer ${_usertoken}`

            })

            const incomingOrders = Array.isArray(res?.data) ? res?.data : []

            setOrdeData(prev => append ? [...prev, ...incomingOrders] : incomingOrders)
            setPageNo(page)
            setHasMore(incomingOrders.length === PER_PAGE)
            console.log(res, 'api response order list..>>>>>>>>>>>')
        } catch (error) {
            console.log(error)

        } finally {
            if (append) {
                setLoadingMore(false)
            } else if (showLoader) {
                setLoadingState(false)
            }
        }
    }

    const handleLoadMore = () => {
        if (loadingMore || !hasMore) {
            return
        }

        fetchOrderlist({ page: pageNo + 1, append: true })
    }

    const handleRefresh = () => {
        setRefreshing(true)
        setHasMore(true)
        fetchOrderlist({ page: 1, append: false, showLoader: false }).finally(() => setRefreshing(false))
    }

    useEffect(() => {
        fetchOrderlist()
    }, [])
    return (
        <View style={{ flex: 1 }}>
            <Header
                inhome={false}
                page={"Order List"}
            />
            {/* <Modal style={{
                flex: 1
            }}
                transparent={true}
            > */}

            {/* </Modal> */}
            {

            }
            <View style={orderListstyles.orderWrapper}>
                {
                    loadingState ? (
                        // Show 4 skeletons as placeholder
                        Array.from({ length: 4 }).map((_, idx) => (
                            <FoodCardSkeleton key={idx} />
                        ))
                    )

                        :
                        (
                            <FlatList
                                // horizontal
                                // ref={flatListRef}
                                data={orderListData}
                                renderItem={({ item }) => {

                                    return (
                                        <View style={{
                                            // top
                                        }}>
                                            <View style={orderListstyles.orderBox}>
                                                <View style={orderListstyles.head}>
                                                    <Text style={{ fontFamily: "Jost_600SemiBold", fontSize: 17 }}>{item?.resturant}</Text>
                                                    <View style={orderListstyles.headtiming}>
                                                        <View style={orderListstyles.flexRow}>
                                                            <Ionicons name="time-outline" size={16} color="#0102FD" />
                                                            <Text
                                                                style={{ fontFamily: "Jost_400Regular", color: "#888888" }}
                                                            >
                                                                {moment(item?.date).format('LT')}
                                                            </Text>
                                                        </View>
                                                        <View style={orderListstyles.flexRow}>
                                                            <AntDesignIcon name="calendar" size={16} color="#0102FD" />
                                                            <Text style={{ fontFamily: "Jost_400Regular", color: "#888888" }}>
                                                                {moment(item?.date).format('DD/MM/YYYY')}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={orderListstyles.second}>
                                                    <View
                                                        style={orderListstyles.flexRow}
                                                    >
                                                        <Text style={{ fontFamily: "Jost_600SemiBold", fontSize: 15 }}>
                                                            Order Id
                                                        </Text>
                                                        <Text style={{ fontFamily: "Jost_400Regular", fontSize: 15, color: "#888888" }}>
                                                            #{item?.id}
                                                        </Text>
                                                    </View>
                                                    <Text style={{ fontFamily: "Jost_600SemiBold", fontSize: 14, color: "#0102FD" }}>${Number(item?.total)?.toFixed(2)}</Text>
                                                </View>
                                                <TouchableOpacity onPress={() => {
                                                    navigation.navigate("table-details", {
                                                        order_details: {
                                                            type: 'orderdetails',
                                                            orderID: item?.id
                                                        }
                                                    })
                                                }} style={orderListstyles.butt}>
                                                    <Text style={orderListstyles.butttext}>View Order</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{
                                                borderWidth: .5,
                                                borderColor: '#D9D9D9',
                                                top: 10
                                            }}>
                                            </View>
                                        </View>
                                    )


                                }}
                                keyExtractor={(item) => item?.id?.toString()}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                onEndReached={handleLoadMore}
                                onEndReachedThreshold={0.2}
                                refreshing={refreshing}
                                onRefresh={handleRefresh}
                                contentContainerStyle={
                                    {
                                        paddingBottom: 170,
                                        marginVertical: 12,
                                        gap: 18
                                    }
                                }
                                ListFooterComponent={
                                    loadingMore ? (
                                        <View style={{ paddingVertical: 20 }}>
                                            <ActivityIndicator color='#000000' size={24} />
                                        </View>
                                    ) : null
                                }
                                ListEmptyComponent={() => {
                                    return (
                                        <View style={{
                                            alignItems: 'center',
                                            marginTop: 50
                                        }}>

                                            <Text style={{ fontFamily: "Jost_600SemiBold", fontSize: 16, textAlign: "center" }}>No booking has been completed yet.</Text>
                                        </View>
                                    )
                                }}



                            />

                            //                 {
                            //     orderListData?.length == 0 ? <Text style={{ fontFamily: "Jost_600SemiBold", fontSize: 16, textAlign: "center" }}>No Past Order yet</Text> :
                            //         orderListData?.map((c) => (
                            //             <View style={orderListstyles.orderBox}>
                            //                 <View style={orderListstyles.head}>
                            //                     <Text style={{ fontFamily: "Jost_600SemiBold", fontSize: 17 }}>{c?.resturant}</Text>
                            //                     <View style={orderListstyles.headtiming}>
                            //                         <View style={orderListstyles.flexRow}>
                            //                             {/* <Ionicons name="time-outline" size={16} color="#0102FD" /> */}
                            //                             <Text
                            //                                 style={{ fontFamily: "Jost_400Regular", color: "#888888" }}
                            //                             >
                            //                                 {moment(c?.date).format('LT')}
                            //                             </Text>
                            //                         </View>
                            //                         <View style={orderListstyles.flexRow}>
                            //                             {/* <AntDesign name="calendar" size={16} color="#0102FD" /> */}
                            //                             <Text style={{ fontFamily: "Jost_400Regular", color: "#888888" }}>
                            //                                 {moment(c?.date).format('DD/MM/YYYY')}
                            //                             </Text>
                            //                         </View>
                            //                     </View>
                            //                 </View>
                            //                 <View style={orderListstyles.second}>
                            //                     <View
                            //                         style={orderListstyles.flexRow}
                            //                     >
                            //                         <Text style={{ fontFamily: "Jost_600SemiBold", fontSize: 15 }}>
                            //                             Order Id
                            //                         </Text>
                            //                         <Text style={{ fontFamily: "Jost_400Regular", fontSize: 15, color: "#888888" }}>
                            //                             #{c?.id}
                            //                         </Text>
                            //                     </View>
                            //                     <Text style={{ fontFamily: "Jost_600SemiBold", fontSize: 14, color: "#0102FD" }}>${Number(c?.total)?.toFixed(2)}</Text>
                            //                 </View>
                            //                 <TouchableOpacity onPress={() => {
                            //                     navigation.navigate("table-details", {
                            //                         order_details: {
                            //                             type: 'orderdetails',
                            //                             orderID: c?.id
                            //                         }
                            //                     })
                            //                 }} style={orderListstyles.butt}>
                            //                     <Text style={orderListstyles.butttext}>View Order</Text>
                            //                 </TouchableOpacity>
                            //             </View>
                            //         ))
                            // }

                        )

                }
            </View>
        </View>
    )
}

export default OrderList