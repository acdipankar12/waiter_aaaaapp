import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { use, useContext, useEffect, useState } from 'react'
import Header from '../../components/header/Header'
import { tableDetailstyles } from './styles'
// import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import SentToKitchen from '../../components/success_modal/SentToKitchen';
// import AntDesign from '@expo/vector-icons/AntDesign';
// import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Completed from '../../components/success_modal/Completed';
import { UserContext } from '../../context/UserContext';
import { _retrieveStoreData, _setStoreData } from '../../utils/store';
import { apiRequest } from '../../utils/apiService';
// import Toast from 'react-native-toast-message';
import HTML from 'react-native-render-html';
import Toast from "react-native-simple-toast";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';



const TableDetails = ({ route }) => {
    // const { order, addfood, fromcart, buttons, table } = route.params;
    // console.log(table)
    const { cart, state, dispatch } = useContext(UserContext)
    // const tabledetail = cart?.filter(c => c?.table === table)[0]
    // console.log(tabledetail)
    const [sentToKitchen, setSentToKitchen] = useState(true)
    const [completed, setCompleted] = useState(true)
    const insets = useSafeAreaInsets();

    const [buttons, setbuttons] = useState(true)
    const [selectedTableOrderDetails, setSelectedtableDetails] = useState(null)

    const [destructureTableResponse, setTableresponse] = useState([])
    console.log(route?.params?.table_details, 'table details??????????///')
    const [grandTotalvalue, setGrandtotal] = useState(0)
    const [checkanyitemsAddedaftersendtokitchen, setCheckanyitemsAddedaftersendtokitchen] = useState(false)

    const [mainfilteritemCartTable, setMainfilterditemcartTable] = useState(null)
    const [taxdata, setTaxdata] = useState({
        tax: 0,
        taxtype: 0,
        tax_price: 0
    })

    const [loadingState, setLoadingState] = useState(false)
    const [sendTokitchenModal, setSendToKitchenmodal] = useState(false)
    const [completeModal, setCompleteOrder] = useState(false)
    const [completeLoading, setCompleteLoading] = useState(false)

    const [ordeerDetails, setOrderDetails] = useState(null)
    async function initialiseCartTableData() {
        let _findTableCart = await state?.cart_data?.find(item => item?.table_number === route?.params?.table_details?.table_number)
        await _restructure_dishData(_findTableCart)
        await taxcalculate(_findTableCart)
        setMainfilterditemcartTable(_findTableCart)
    }


    async function fetchOrderDetails(_ORDERID) {
        let _usertoken = await _retrieveStoreData('_waiter_token')

        await apiRequest('waiter/order-view', 'post', {
            id: _ORDERID
        }, {

            "Content-Type": "application/json",
            "Accept": "application/json",
            'Authorization': `Bearer ${_usertoken}`

        }).then(async (res) => {
            console.log(res, 'order details response/////////////////')
            let _disdata = await JSON.parse(res?.data?.dishdata)
            //  setSelectedtableDetails({
            //     table_number:res?.data?.table_no,
            //     // dishcount:JSON.parse(res?.data?.dishdata)?.length
            //  })
            const result = _disdata?.map(item => ({
                data: [item]
            }));
            let _orderDetails = {
                table_number: res?.data?.table_no,
                dishdata: _disdata
            }
            setSelectedtableDetails(_orderDetails)
            await _restructure_dishData(_orderDetails)
            await taxcalculate(_orderDetails)
            console.log(result, 'order details respnse?????????????????')
        })
    }
    useEffect(() => {
        if (route?.params?.order_details?.type != undefined ?? route?.params?.order_details?.type == 'orderdetails') {
            fetchOrderDetails(route?.params?.order_details?.orderID)
        } else {
            initialiseCartTableData()
        }

    }, [state])


    const [paymentMethods, setPaymentmethods] = useState([])
    const [addPaymentMethod, setAddPaymentMethos] = useState(null)
    console.log(state?.user_data, 'busines detals///')
    function refineItemOptions(item) {
        const { options, relation, sets } = item;
        const { options: optionIds, choices: choiceIds } = relation;
        console.log(choiceIds, 'choces id//////')
        const result = [];

        optionIds.forEach(optionId => {
            // find the main option
            const option = options.find(opt => opt.id === optionId);
            if (!option) return;

            // filter its choices
            const filteredChoices = option.choices.filter(choice =>
                choiceIds.includes(choice.id)
            );

            const merged_choices = filteredChoices?.map(item => {
                const match = sets?.find(b => b.id === item.id);
                return match ? { ...item, qty: match.qty } : item;
            });

            if (filteredChoices.length > 0) {
                result.push({
                    options_name: option.option_name,
                    filter_option_choices: merged_choices
                });
            }
        });

        return result;
    }



    function calculateItemTax(item) {
        const offerPrice = parseFloat(item.offerprice) || 0;

        // Calculate total sets price
        const setsTotal = (item.sets || []).reduce((sum, set) => {
            const price = parseFloat(set.price) || 0;
            const qty = parseFloat(set.qty) || 1;
            return sum + price * qty;
        }, 0);

        // Total base price (offerprice + sets price)
        const baseAmount = offerPrice + setsTotal;

        let taxAmount = 0;

        if (item.taxtype === 0) {
            // Percentage tax
            taxAmount = (baseAmount * item.tax) / 100;
        }

        return {
            baseAmount,
            taxAmount,
            totalWithTax: baseAmount + taxAmount
        };
    }

    async function taxcalculate(inpuData) {

        inpuData?.dishdata?.forEach((item) => {
            let _taxData = calculateItemTax(item?.data[0])
            setTaxdata(prev => {
                return {
                    ...prev,
                    tax_price: prev?.tax_price + _taxData?.taxAmount
                }
            })
            console.log(_taxData, 'taxData//////////////>>>>>>>>>')
        })
    }

    // useEffect(() => {
    //     taxcalculate()
    // }, [])

    async function _restructure_dishData(data_input) {
        // let _dishData = { ...dishInputData }
        //  let grandtotal = 0
        let _refiveData = data_input?.dishdata?.map(element => {
            let _optionsFilter = refineItemOptions(element?.data[0])
            // grandTotal += element?.offerprice
            return {
                ...element,
                _optionsFilter: _optionsFilter

            }
        });
        // Calculate the Grand Total including both offerprice and option prices
        const grandtotal = _refiveData.reduce((total, dish) => {

            // 1. Get the dish's base price (offerprice)
            let dishBasePrice = Number(dish?.data[0]?.offerprice) || 0;

            console.log(dishBasePrice, 'dis main price///////////////////')
            // 2. Calculate the total price of all selected options for this dish
            let optionsTotal = 0;

            // Ensure _optionsFilter exists and is an array before mapping/reducing
            if (Array.isArray(dish._optionsFilter)) {

                // Loop through each option group (e.g., 'Size', 'Crust')
                dish._optionsFilter.forEach(optionGroup => {

                    // Loop through the choices in the option group (e.g., 'Large', 'Thin Crust')
                    // Note: The structure implies you should sum up prices of ALL choices, 
                    // which suggests each choice has a price and you may have multiple selected.
                    optionGroup?.filter_option_choices?.forEach(choice => {
                        optionsTotal += Number(choice?.price * choice?.qty) || 0;
                    });
                });
            }

            // 3. The total price for this single dish is its base price plus the options total
            const dishTotalPrice = dishBasePrice + optionsTotal;
            // setGrandtotal(dishTotalPrice)
            // 4. Add the current dish's total price to the running grand total
            return total + dishTotalPrice;

        }, 0); // Start the total at 0
        setGrandtotal(grandtotal)
        setTableresponse(_refiveData)
        console.log(_refiveData, 'refive data//////')
    }
    useEffect(() => {
        _restructure_dishData()
    }, [])

    useEffect(() => {
        const hasNewItem = destructureTableResponse?.some(item => !mainfilteritemCartTable?.track_tableids?.includes(item.id));
        setCheckanyitemsAddedaftersendtokitchen(hasNewItem)
        console.log(hasNewItem, 'check hasnewite///////////')
    }, [destructureTableResponse])


    // complete the order table 
    async function completeOrder(_orderID) {
        console.log(addPaymentMethod, 'payment methos////')
        if (addPaymentMethod == null) {
            Toast.show('Please choose payment method.', Toast.SHORT, Toast.BOTTOM);

            // Toast.show({
            //     type: 'error',
            //     text1: "Please choose payment method."
            // })
            return
        }
        setCompleteLoading(true)
        let _usertoken = await _retrieveStoreData('_waiter_token')

        try {
            await apiRequest('waiter/order-complete', 'post', {
                id: _orderID,
                payment_id: addPaymentMethod[0]?.pid,
                paymentmethod: addPaymentMethod[0],
            }, {

                "Content-Type": "application/json",
                "Accept": "application/json",
                'Authorization': `Bearer ${_usertoken}`

            }).then(async (res) => {
                console.log(res, 'compte responseee')
                if (res?.status) {
                    let _updateStorage = await state?.cart_data?.filter(item => item?.table_number != route?.params?.table_details?.table_number)
                    await _setStoreData('user_cart_data', JSON.stringify(_updateStorage))
                    // await _setStoreData('user_cart_data', JSON.stringify(_updateStorage))
                    // console.log(_updateStorage, 'remove itemd')
                    dispatch({ type: 'REMOVE_CART_DATA', payload: route?.params?.table_details?.table_number })
                    setCompleteLoading(false)
                    setCompleteOrder(true)
                    Toast.show('Order send to kitchen.', Toast.SHORT, Toast.BOTTOM);
                    // Toast.show({
                    //     type: "success",
                    //     text1: "Order send to kitchen."
                    // })
                } else {
                    setCompleteLoading(false)
                }

                // await _setStoreData('user_cart_data', JSON.stringify(_updateStorage))
                // dispatch({ type: 'REMOVE_CART_DATA', payload: route?.params?.table_details?.table_number })


            })
        } catch (error) {
            setCompleteLoading(false)
            console.log(error)

        }

    }
    async function fetchbankdetails() {
        let _usertoken = await _retrieveStoreData('_waiter_token')

        await apiRequest('user/get-business-payment-methods', 'post', {
            business_id: state?.user_data?.business,
            lang_id: '1'
        }, {

            "Content-Type": "application/json",
            "Accept": "application/json",
            'Authorization': `Bearer ${_usertoken}`

        }).then((res) => {
            if (res?.status) {
                // let cashobje = res?.data?.find(item => item?.name == 'cash')
                setPaymentmethods(res?.data)
            }
            console.log(res, 'payment drtailssse/////////////')
        })
    }

    useEffect(() => {
        fetchbankdetails()
    }, [])
    /// SEND TO Kitchen

    async function sendTokitchen() {
        setLoadingState(true)
        let _usertoken = await _retrieveStoreData('_waiter_token')
        const obj = state?.user_data?.name ? JSON.parse(state?.user_data?.name) : {};
        const last_name = state?.user_data?.name ? JSON.parse(state?.user_data?.last_name) : {};
        const addrses = state?.user_data?.name ? JSON.parse(state?.user_data?.address) : {};

        const firstValue = obj[Object.keys(obj)[0]];
        const lastname_obj = last_name[Object.keys(last_name)[0]];
        const addres_obj = addrses[Object.keys(addrses)[0]];

        const singleArray = mainfilteritemCartTable?.dishdata?.flatMap(item => item.data);
        //    const obj = item?.name ? JSON.parse(item.name) : {};

        // const firstValue = obj[Object.keys(obj)[0]];
        let payload_data = {
            estimate_time: "0",
            bid: state?.user_data?.business,
            city: state?.user_data?.city,
            table_no: route?.params?.table_details?.table_number,
            dishdata: mainfilteritemCartTable?.dishdata,
            buyerdata: {
                ...state?.user_data,
                last_name: lastname_obj,
                name: firstValue,
                address: addres_obj

            },
            buyername: firstValue,
            subtotal: grandTotalvalue,
            total: grandTotalvalue + taxdata?.tax_price,
            firstoffer: "",
            extraminimum: "",
            deliverycost: 0,
            deliverydetails: "",
            tax: mainfilteritemCartTable?.dishdata[0]?.data[0]?.tax,
            taxtype: mainfilteritemCartTable?.dishdata[0]?.data[0]?.taxtype,
            tax_price: taxdata?.tax_price,
            buyeremail: state?.user_data?.email,
            buyerphone: state?.user_data?.tel,
            buyercomments: state?.user_data?.comments != undefined ? state?.user_data?.comments : '',
            order_type: "1",
            driverid: "",
            comments: "",
            payment_id: null,
            paymentmethod: null,
            sourcetype: "",
            sourcetype_name: "",
            cartdish: {
                id: state?.user_data?.business,
                details: state?.user_data,
                dish: singleArray
            },
            cartfee: {
                id: state?.user_data?.business,
                name: firstValue,
                subtotal: grandTotalvalue,
                tax: mainfilteritemCartTable?.dishdata[0]?.data[0]?.tax,
                taxtype: mainfilteritemCartTable?.dishdata[0]?.data[0]?.taxtype,
                taxprice: taxdata?.tax_price,
                deliverycost: 0,
                extraminimum: '0',
                firstoffer: 0,
                servicefee: 0,
                servicefeeprice: 0,
                discount: 0, //!!Complete the discount and give here
                tips: 0,
                total: Number(grandTotalvalue + taxdata?.tax_price)?.toFixed(2),
            },
            discount_info: { discounttext: null, discounttype: null, discountid: null },
            search: "",
            pre_order_date: "",
            pre_order_time: "",
            preorder: "",
            txnId: "",
            ordertime: new Date(),
            reward_wallet: "",
            reward_json: "",
            reward_status: "",
            laundryservice: "",
            laundryservicedetails: ""
        }

        console.log(payload_data, 'paylaodatt////')
        try {
            await apiRequest('waiter/order-placed', 'post', payload_data, {

                "Content-Type": "application/json",
                "Accept": "application/json",
                'Authorization': `Bearer ${_usertoken}`

            }).then(async (res) => {
                if (res?.status) {
                    let _active_dishids = destructureTableResponse?.map((_active_dish) => _active_dish?.id)
                    let _updatecartdata = state?.cart_data?.map((item) => {
                        if (item?.table_number == route?.params?.table_details?.table_number) {
                            return {
                                ...item,
                                track_tableids: _active_dishids,
                                orderID: res?.data
                            }
                        }
                        return item
                    })
                    dispatch({ type: 'CART_DATA_UPDATE_SEND_TO_KITCHEN', payload: _updatecartdata })
                    console.log(_updatecartdata, 'modifying datatata////////////////')
                    await _setStoreData('user_cart_data', JSON.stringify(_updatecartdata))
                    setSendToKitchenmodal(true)
                    Toast.show('Order send to kitchen.', Toast.SHORT, Toast.BOTTOM);

                    // Toast.show({
                    //     type: "success",
                    //     text1: "Order send to kitchen."
                    // })
                    setLoadingState(false)

                }
                console.log(res, 'send to kitchen api response/////////////')
            })
        } catch (error) {
            setLoadingState(false)
            console.log(error, 'catch error//////////////')
        }

        let res = false

    }
    async function sendTokitchenUpdate() {
        setLoadingState(true)
        let _usertoken = await _retrieveStoreData('_waiter_token')
        const obj = state?.user_data?.name ? JSON.parse(state?.user_data?.name) : {};
        const last_name = state?.user_data?.last_name ? JSON.parse(state?.user_data?.last_name) : {};

        const addrses = state?.user_data?.address ? JSON.parse(state?.user_data?.address) : {};
        const firstValue = obj[Object.keys(obj)[0]];
        const singleArray = mainfilteritemCartTable?.dishdata?.flatMap(item => item.data);

        const lastname_obj = last_name[Object.keys(last_name)[0]];
        const addres_obj = addrses[Object.keys(addrses)[0]];
        let payload_data = {
            estimate_time: "0",
            id: route?.params?.table_details?.orderID,
            bid: state?.user_data?.business,
            city: state?.user_data?.city,
            table_no: route?.params?.table_details?.table_number,
            dishdata: mainfilteritemCartTable?.dishdata,
            buyerdata: {
                ...state?.user_data,
                last_name: lastname_obj,
                name: firstValue,
                address: addres_obj

            },
            buyername: firstValue,
            subtotal: grandTotalvalue,
            total: grandTotalvalue + taxdata?.tax_price,
            firstoffer: "",
            extraminimum: "",
            deliverycost: 0,
            deliverydetails: "",
            tax: mainfilteritemCartTable?.dishdata[0]?.data[0]?.tax,
            taxtype: mainfilteritemCartTable?.dishdata[0]?.data[0]?.taxtype,
            tax_price: taxdata?.tax_price,
            buyeremail: state?.user_data?.email,
            buyerphone: state?.user_data?.tel,
            buyercomments: state?.user_data?.comments != undefined ? state?.user_data?.comments : '',
            order_type: "1",
            driverid: "",
            comments: "",
            payment_id: paymentMethods?.pid,
            paymentmethod: paymentMethods,
            sourcetype: "",
            sourcetype_name: "",
            cartdish: {
                id: state?.user_data?.business,
                details: state?.user_data,
                dish: singleArray
            },
            cartfee: {
                id: state?.user_data?.business,
                name: firstValue,
                subtotal: grandTotalvalue,
                tax: mainfilteritemCartTable?.dishdata[0]?.data[0]?.tax,
                taxtype: mainfilteritemCartTable?.dishdata[0]?.data[0]?.taxtype,
                taxprice: taxdata?.tax_price,
                deliverycost: 0,
                extraminimum: '0',
                firstoffer: 0,
                servicefee: 0,
                servicefeeprice: 0,
                discount: 0, //!!Complete the discount and give here
                tips: 0,
                total: Number(grandTotalvalue + taxdata?.tax_price)?.toFixed(2),
            },
            discount_info: { discounttext: null, discounttype: null, discountid: null },
            search: "",
            pre_order_date: "",
            pre_order_time: "",
            preorder: "",
            txnId: "",
            ordertime: new Date(),
            reward_wallet: "",
            reward_json: "",
            reward_status: "",
            laundryservice: "",
            laundryservicedetails: ""
        }

        console.log(payload_data, 'paylaodatt////')
        try {
            await apiRequest('waiter/order-update', 'post', payload_data, {

                "Content-Type": "application/json",
                "Accept": "application/json",
                'Authorization': `Bearer ${_usertoken}`

            }).then(async (res) => {
                if (res?.status) {
                    let _active_dishids = destructureTableResponse?.map((_active_dish) => _active_dish?.id)
                    let _updatecartdata = state?.cart_data?.map((item) => {
                        if (item?.table_number == route?.params?.table_details?.table_number) {
                            return {
                                ...item,
                                track_tableids: _active_dishids,
                                orderID: res?.data
                            }
                        }
                        return item
                    })
                    dispatch({ type: 'CART_DATA_UPDATE_SEND_TO_KITCHEN', payload: _updatecartdata })
                    console.log(_updatecartdata, 'modifying datatata////////////////')
                    await _setStoreData('user_cart_data', JSON.stringify(_updatecartdata))
                    Toast.show('Order send to kitchen.', Toast.SHORT, Toast.BOTTOM);

                    // Toast.show({
                    //     type: "success",
                    //     text1: "Order send to kitchen."
                    // })
                    setLoadingState(false)

                } {
                    setLoadingState(false)
                }
                console.log(res, 'send to kitchen api response/////////////')
            })
        } catch (error) {
            setLoadingState(false)
            console.log(error, 'catch error//////////////')
        }

        let res = false

    }
    return (
        <View style={{ flex: 1 }}>
            <Header inhome={false} page={route?.params?.order_details?.type != undefined ? 'Order Details' : "Table Details"} />
            {
                destructureTableResponse?.length == 0 ? <>
                    <ActivityIndicator
                        color='#000000'
                        size={30}
                    />
                </>
                    : (
                        <>
                            <ScrollView style={tableDetailstyles.tableWrapper}>
                                <View style={tableDetailstyles.tableBox}>
                                    {/* Header */}
                                    <View style={tableDetailstyles.header}>
                                        <View style={tableDetailstyles.headleft}>
                                            <Text style={tableDetailstyles.headtext1}>Table Number: {
                                                route?.params?.order_details?.type != undefined ? selectedTableOrderDetails?.table_number : route?.params?.table_details?.table_number}</Text>
                                            {/* {order || fromcart ? null : <MaterialIcons name="edit" size={18} color="#fff" />} */}
                                        </View>
                                        <Text style={tableDetailstyles.headtext2}>Item: {
                                            route?.params?.order_details?.type != undefined ? selectedTableOrderDetails?.dishdata?.length :
                                                mainfilteritemCartTable?.dishdata?.length}</Text>
                                    </View>
                                    {/* Body Starts */}
                                    {
                                        destructureTableResponse?.map((f, i) => (
                                            <View key={i} style={tableDetailstyles.fooditem}>
                                                <View style={tableDetailstyles.itemhead}>
                                                    <View style={tableDetailstyles.itemheadwrap}>
                                                        <Text style={[tableDetailstyles.itemname, {
                                                            fontWeight: '700'
                                                        }]}>
                                                            {f?.data[0]?.name}
                                                        </Text>
                                                        {/* <MaterialIcons name="edit" size={18} color="#0102FD" /> */}
                                                    </View>
                                                    <Text style={tableDetailstyles.itemprice}>
                                                        ${Number(f?.data[0]?.offerprice)?.toFixed(2)}
                                                    </Text>
                                                </View>
                                                {/* <Text style={tableDetailstyles.itemdesc}> */}
                                                {
                                                    f?.data[0]?.description != undefined && f?.data[0]?.description != "" && (
                                                        <HTML html={f?.data[0]?.description}
                                                            containerStyle={{
                                                                color: '#333333',
                                                                fontSize: 13,
                                                                flexShrink: 1,
                                                                fontWeight: "400",
                                                                width: '100%',
                                                            }}
                                                            tagsStyles={{
                                                                body: {
                                                                    paddingTop: 5,
                                                                    margin: 0
                                                                  },
                                                                p: {
                                                                    padding: 0,
                                                                    fontSize: 14,
                                                                    fontFamily: "Jost-Regular",
                                                                    fontWeight: '400'
                                                                }
                                                            }}
                                                        //    imagesMaxWidth={Dimensions.get('window').width}
                                                        />
                                                    )
                                                }

                                                {/* {f?.data[0]?.description} */}
                                                {/* </Text> */}

                                                {
                                                    f?._optionsFilter?.map((options) => {
                                                        return (
                                                            <View style={tableDetailstyles.spicy}>
                                                                <Text style={{ fontFamily: "Jost_500Medium", color: "#0102FD", fontWeight: '700' }}>{options?.options_name}</Text>
                                                                {
                                                                    options?.filter_option_choices?.map((choise) => {
                                                                        return (
                                                                            <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                                                                                <View style={{ height: 6, width: 6, borderRadius: 3, backgroundColor: "#08D61D" }}></View>
                                                                                <Text style={{ fontFamily: "Jost_500Medium", paddingLeft: 4 }}>{choise?.choice_name} {choise?.qty != null ? `x ${choise?.qty}` : ''} <Text
                                                                                    style={{ fontFamily: "Jost_500Medium", color: "#0102FD" }}
                                                                                >$ {choise?.qty != null ? choise?.price * choise?.qty : choise?.price}</Text></Text>
                                                                            </View>
                                                                        )
                                                                    })
                                                                }

                                                            </View>
                                                        )
                                                    })
                                                }
                                                {/* {
                                    f?.spice ? <View style={tableDetailstyles.spicy}>
                                        <Text style={{ fontFamily: "Jost_500Medium", color: "#0102FD" }}>How Spicy?</Text>
                                        <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                                            <View style={{ height: 6, width: 6, borderRadius: 3, backgroundColor: "#08D61D" }}></View>
                                            <Text style={{ fontFamily: "Jost_500Medium" }}>{f.spice}</Text>
                                        </View>
                                    </View> : null
                                } */}
                                                {






                                                }

                                            </View>
                                        ))
                                    }
                                </View>
                                {
                                    <View style={tableDetailstyles.totals}>
                                        <View style={tableDetailstyles.firstrow}>
                                            <Text style={tableDetailstyles.textl}>Items Total</Text>
                                            <Text style={tableDetailstyles.totalprice}>${grandTotalvalue?.toFixed(2)}</Text>
                                        </View>
                                        <View style={tableDetailstyles.secondrow}>
                                            <Text style={tableDetailstyles.texto}>Tax & Charge</Text>
                                            <Text style={tableDetailstyles.totalprice}>${Number(taxdata?.tax_price).toFixed(2)}</Text>
                                        </View>
                                        <View style={tableDetailstyles.thirdrow}>
                                            <Text style={tableDetailstyles.textl}>Grand Total</Text>
                                            <Text style={tableDetailstyles.totalprice}>${Number(grandTotalvalue + taxdata?.tax_price).toFixed(2)}</Text>
                                        </View>

                                        {
                                            route?.params?.order_details?.type != undefined && selectedTableOrderDetails && (
                                                <>
                                                    <Text style={tableDetailstyles.pay}>Payment</Text>
                                                    {/* {
                                                        selectedTableOrderDetails?.payment_id == 1 && ( */}
                                                    <View style={{
                                                        justifyContent: 'space-between',
                                                        flexDirection: 'row'
                                                    }}>
                                                        <Text style={tableDetailstyles.cash}>Cash / Card</Text>
                                                        {/* <TouchableOpacity style={{
                                                            width: 21,
                                                            height: 21,
                                                            borderRadius: 100,
                                                            borderWidth: 1,
                                                            borderColor: '#0102FD',
                                                            padding: 2,
                                                            justifyContent: 'center',
                                                            alignItems: 'center'
                                                            // backgroundColor: addPaymentMethod != null ? '#0102FD' : '#FFFFFF'
                                                        }}

                                                        >
                                                            <TouchableOpacity

                                                                style={{
                                                                    width: 15,
                                                                    height: 15,
                                                                    borderRadius: 100,
                                                                    borderWidth: 1,
                                                                    borderColor: '#0102FD',
                                                                    backgroundColor: '#0102FD'
                                                                }}>

                                                            </TouchableOpacity>


                                                        </TouchableOpacity> */}
                                                    </View>
                                                    {/* )
                                                    } */}

                                                </>
                                            )
                                        }
                                        {
                                            mainfilteritemCartTable?.track_tableids != null || checkanyitemsAddedaftersendtokitchen == false && (
                                                <>
                                                    <Text style={tableDetailstyles.pay}>Payment</Text>
                                                    <View style={{
                                                        justifyContent: 'space-between',
                                                        flexDirection: 'row',
                                                        paddingVertical: 3
                                                        // backgroundColor:'green'
                                                    }}
                                                        onPress={() => {
                                                            let _cashPayment = paymentMethods?.filter(item => item?.name == 'cash')
                                                            if (addPaymentMethod == null) {
                                                                setAddPaymentMethos(_cashPayment)
                                                            } else {
                                                                setAddPaymentMethos(null)
                                                            }

                                                        }}
                                                    >
                                                        <Text style={tableDetailstyles.cash}>Cash / Card</Text>
                                                        {
                                                            addPaymentMethod != null ? (
                                                                <TouchableOpacity style={{
                                                                    width: 21,
                                                                    height: 21,
                                                                    borderRadius: 100,
                                                                    borderWidth: 1,
                                                                    borderColor: '#0102FD',
                                                                    padding: 2,
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center'
                                                                    // backgroundColor: addPaymentMethod != null ? '#0102FD' : '#FFFFFF'
                                                                }}

                                                                >
                                                                    <TouchableOpacity

                                                                        style={{
                                                                            width: 15,
                                                                            height: 15,
                                                                            borderRadius: 100,
                                                                            borderWidth: 1,
                                                                            borderColor: addPaymentMethod != null ? '#0102FD' : '#FFFFFF',
                                                                            backgroundColor: addPaymentMethod != null ? '#0102FD' : '#FFFFFF'
                                                                        }}>

                                                                    </TouchableOpacity>


                                                                </TouchableOpacity>
                                                            )
                                                                : (
                                                                    <TouchableOpacity style={{
                                                                        width: 21,
                                                                        height: 21,
                                                                        borderRadius: 100,
                                                                        borderWidth: 1,
                                                                        borderColor: '#0102FD',
                                                                        padding: 2,
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center'
                                                                        // backgroundColor: addPaymentMethod != null ? '#0102FD' : '#FFFFFF'
                                                                    }}
                                                                        onPress={() => {
                                                                            let _cashPayment = paymentMethods?.filter(item => item?.name == 'cash')
                                                                            if (addPaymentMethod == null) {
                                                                                setAddPaymentMethos(_cashPayment)
                                                                            } else {
                                                                                setAddPaymentMethos(null)
                                                                            }

                                                                        }}
                                                                    ></TouchableOpacity>
                                                                )

                                                        }

                                                    </View>
                                                </>

                                            )
                                        }

                                        {
                                            (!checkanyitemsAddedaftersendtokitchen && mainfilteritemCartTable?.track_tableids != null) && (
                                                <>
                                                    <Text style={tableDetailstyles.cash}>Payment</Text>
                                                    <TouchableOpacity style={{
                                                        justifyContent: 'space-between',
                                                        flexDirection: 'row',
                                                        paddingVertical: 3
                                                        // backgroundColor:'green'
                                                    }}

                                                        onPress={() => {
                                                            let _cashPayment = paymentMethods?.filter(item => item?.name == 'cash')
                                                            if (addPaymentMethod == null) {
                                                                setAddPaymentMethos(_cashPayment)
                                                            } else {
                                                                setAddPaymentMethos(null)
                                                            }

                                                        }}
                                                    >
                                                        <Text style={tableDetailstyles.cash}>Cash / Card</Text>
                                                        {
                                                            addPaymentMethod != null ? (
                                                                <TouchableOpacity style={{
                                                                    width: 21,
                                                                    height: 21,
                                                                    borderRadius: 100,
                                                                    borderWidth: 1,
                                                                    borderColor: '#0102FD',
                                                                    padding: 2,
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center'
                                                                    // backgroundColor: addPaymentMethod != null ? '#0102FD' : '#FFFFFF'
                                                                }}

                                                                >
                                                                    <TouchableOpacity
                                                                        // onPress={() => {
                                                                        //     let _cashPayment = paymentMethods?.find(item => item?.name == 'cash')
                                                                        //     if (addPaymentMethod == null) {
                                                                        //         setAddPaymentMethos(_cashPayment)
                                                                        //     } else {
                                                                        //         setAddPaymentMethos(null)
                                                                        //     }

                                                                        // }}
                                                                        style={{
                                                                            width: 15,
                                                                            height: 15,
                                                                            borderRadius: 100,
                                                                            borderWidth: 1,
                                                                            borderColor: addPaymentMethod != null ? '#0102FD' : '#FFFFFF',
                                                                            backgroundColor: addPaymentMethod != null ? '#0102FD' : '#FFFFFF'
                                                                        }}>

                                                                    </TouchableOpacity>


                                                                </TouchableOpacity>
                                                            )
                                                                : (
                                                                    <TouchableOpacity style={{
                                                                        width: 21,
                                                                        height: 21,
                                                                        borderRadius: 100,
                                                                        borderWidth: 1,
                                                                        borderColor: '#0102FD',
                                                                        padding: 2,
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center'
                                                                        // backgroundColor: addPaymentMethod != null ? '#0102FD' : '#FFFFFF'
                                                                    }}
                                                                    // onPress={() => {
                                                                    //     let _cashPayment = paymentMethods?.find(item => item?.name == 'cash')
                                                                    //     if (addPaymentMethod == null) {
                                                                    //         setAddPaymentMethos(_cashPayment)
                                                                    //     } else {
                                                                    //         setAddPaymentMethos(null)
                                                                    //     }

                                                                    // }}
                                                                    ></TouchableOpacity>
                                                                )

                                                        }

                                                    </TouchableOpacity>
                                                </>

                                            )
                                        }
                                        {/* <View>
                                            <Text style={tableDetailstyles.cash}>Paypal</Text>
                                        </View>
                                        <View>
                                            <Text style={tableDetailstyles.cash}>Stripe</Text>
                                        </View>
                                        <View>
                                            <Text style={tableDetailstyles.cash}>Rozarpay</Text>
                                        </View> */}

                                    </View>
                                }
                                {/* {
                    fromcart ? <View style={tableDetailstyles.payment}>
                        <Text style={tableDetailstyles.paymenttext}>Select Payment</Text>
                        <TouchableOpacity style={tableDetailstyles.payoption}>
                            <AntDesign name="creditcard" size={15} color="#001A72" />
                            <Text style={tableDetailstyles.payoptext}>Credit/Debit Card</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={tableDetailstyles.payoption}>
                            <MaterialCommunityIcons name="cash" size={20} color="#001A72" />
                            <Text style={tableDetailstyles.payoptext}>Cash</Text>
                        </TouchableOpacity>
                    </View> : null
                } */}


                            </ScrollView>
                            {
                                route?.params?.order_details?.type == undefined && (
                                    <View style={{ marginBottom: insets.bottom + 15 }}>

                                        {
                                            (checkanyitemsAddedaftersendtokitchen && mainfilteritemCartTable?.track_tableids != null) && <View style={tableDetailstyles.buttWrapper}>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        sendTokitchenUpdate()

                                                    }}
                                                    disabled={loadingState ? true : false}
                                                    style={tableDetailstyles.buttOne}>
                                                    <Text style={{ color: "#fff", fontFamily: "Jost_500Medium" }}>Send To Kitchen </Text>

                                                    {
                                                        loadingState && <ActivityIndicator
                                                            size={18}
                                                            color='#FFFFFF'
                                                            style={{
                                                                paddingLeft: 5
                                                            }}
                                                        />
                                                    }

                                                </TouchableOpacity>

                                            </View>
                                        }
                                        {
                                            mainfilteritemCartTable?.track_tableids == null ? <View style={tableDetailstyles.buttWrapper}>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        sendTokitchen()
                                                    }}
                                                    disabled={loadingState ? true : false}
                                                    style={tableDetailstyles.buttOne}>
                                                    <Text style={{ color: "#fff", fontFamily: "Jost_500Medium" }}>Send To Kitchen</Text>
                                                    {
                                                        loadingState && <ActivityIndicator
                                                            size={18}
                                                            color='#FFFFFF'
                                                            style={{
                                                                paddingLeft: 5
                                                            }}
                                                        />
                                                    }

                                                </TouchableOpacity>
                                                {/* <TouchableOpacity
                            onPress={() => {
                                setCompleted(true)
                            }}
                            style={tableDetailstyles.buttTwo}>

                            <Text style={{ color: "#fff", fontFamily: "Jost_500Medium" }}>Complete Order</Text>
                        </TouchableOpacity> */}
                                            </View> : null
                                        }

                                        {
                                            (!checkanyitemsAddedaftersendtokitchen && mainfilteritemCartTable?.track_tableids != null) && (
                                                <View style={tableDetailstyles.buttWrapper}>

                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            completeOrder(mainfilteritemCartTable?.orderID)
                                                            // setCompleted(true)
                                                        }}
                                                        style={[tableDetailstyles.buttTwo,

                                                        {
                                                            backgroundColor: addPaymentMethod == null ? 'gray' : '#08D61D'
                                                        }
                                                        ]}>

                                                        <Text style={{ color: "#fff", fontFamily: "Jost_500Medium" }}>Complete Order</Text>
                                                        {
                                                            completeLoading && <ActivityIndicator
                                                                size={18}
                                                                color='#FFFFFF'
                                                                style={{
                                                                    paddingLeft: 5
                                                                }}
                                                            />
                                                        }

                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        }
                                        {
                                            mainfilteritemCartTable?.track_tableids != null || checkanyitemsAddedaftersendtokitchen == false && (
                                                <View style={tableDetailstyles.buttWrapper}>

                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            completeOrder(mainfilteritemCartTable?.orderID)
                                                            // setCompleted(true)
                                                        }}
                                                        style={[tableDetailstyles.buttTwo,

                                                        {
                                                            backgroundColor: addPaymentMethod == null ? 'gray' : '#08D61D'
                                                        }
                                                        ]}>



                                                        <Text style={{ color: "#fff", fontFamily: "Jost_500Medium" }}>Complete Order</Text>
                                                        {
                                                            completeLoading && <ActivityIndicator
                                                                size={18}
                                                                color='#FFFFFF'
                                                                style={{
                                                                    paddingLeft: 5
                                                                }}
                                                            />
                                                        }

                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        }




                                    </View>
                                )
                            }
                        </>
                    )
            }


            {sendTokitchenModal ? <SentToKitchen setSentToKitchen={setSendToKitchenmodal} /> : null}
            {completeModal ? <Completed setCompleted={setCompleteOrder} /> : null}
        </View>
    )
}

export default TableDetails