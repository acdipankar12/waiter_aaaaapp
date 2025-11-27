import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Header from '../../components/header/Header'
import { tableDetailstyles } from './styles'
// import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import SentToKitchen from '../../components/success_modal/SentToKitchen';
// import AntDesign from '@expo/vector-icons/AntDesign';
// import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Completed from '../../components/success_modal/Completed';
import { UserContext } from '../../context/UserContext';



const TableDetails = ({ route }) => {
    // const { order, addfood, fromcart, buttons, table } = route.params;
    // console.log(table)
    const { cart, state } = useContext(UserContext)
    // const tabledetail = cart?.filter(c => c?.table === table)[0]
    // console.log(tabledetail)
    const [sentToKitchen, setSentToKitchen] = useState(true)
    const [completed, setCompleted] = useState(true)
    const insets = useSafeAreaInsets();

    const [buttons, setbuttons] = useState(true)
    const [selectedTableOrderDetails, setSelectedtableDetails] = useState(null)

    const [destructureTableResponse , setTableresponse] = useState([])
    console.log(route?.params?.table_details, 'table details??????????///')
    // async function table_details_ferch() {
    //     let _find_tabledata = await state?.cart_data?.filter(item => item?.table_number == route?.params?.table_number)
    //   console.log(_find_tabledata ,route?.params?.table_number,'filteasd')
    //     setSelectedtableDetails(_find_tabledata)
    // }

    // useEffect(() => {
    //     table_details_ferch()
    // }, [])

    function refineItemOptions(item) {
        const { options, relation } = item;
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

            if (filteredChoices.length > 0) {
                result.push({
                    options_name: option.option_name,
                    filter_option_choices: filteredChoices
                });
            }
        });

        return result;
    }
    function _restructure_dishData(dishInputData) {
        // let _dishData = { ...dishInputData }
        _dishData?.dishdata?.forEach(element => {
            
        });
    }
    return (
        <View style={{ flex: 1 }}>
            <Header inhome={false} page={"Table Details"} />
            <ScrollView style={tableDetailstyles.tableWrapper}>
                <View style={tableDetailstyles.tableBox}>
                    {/* Header */}
                    <View style={tableDetailstyles.header}>
                        <View style={tableDetailstyles.headleft}>
                            <Text style={tableDetailstyles.headtext1}>Table Number: {route?.params?.table_details?.table_number}</Text>
                            {/* {order || fromcart ? null : <MaterialIcons name="edit" size={18} color="#fff" />} */}
                        </View>
                        <Text style={tableDetailstyles.headtext2}>Item: {route?.params?.table_details?.dishdata?.length}</Text>
                    </View>
                    {/* Body Starts */}
                    {
                        route?.params?.table_details?.dishdata?.map((f, i) => (
                            <View key={i} style={tableDetailstyles.fooditem}>
                                <View style={tableDetailstyles.itemhead}>
                                    <View style={tableDetailstyles.itemheadwrap}>
                                        <Text style={tableDetailstyles.itemname}>
                                            {f?.data[0]?.name}
                                        </Text>
                                        {/* {addfood || fromcart ? <MaterialIcons name="edit" size={18} color="#0102FD" /> : null} */}
                                    </View>
                                    <Text style={tableDetailstyles.itemprice}>
                                        ${Number(f?.data[0]?.offerprice)?.toFixed(2)}
                                    </Text>
                                </View>
                                <Text style={tableDetailstyles.itemdesc}>
                                    {f?.data[0]?.description}
                                </Text>
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


                                    (async () => {
                                        function refineItemOptions(item) {
                                            const { options, relation } = item;
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

                                                if (filteredChoices.length > 0) {
                                                    result.push({
                                                        options_name: option.option_name,
                                                        filter_option_choices: filteredChoices
                                                    });
                                                }
                                            });

                                            return result;
                                        }

                                        let _final_result = await refineItemOptions(f?.data[0])

                                        console.log(_final_result, 'final resulttttttt')

                                        _final_result?.map((item) => {
                                            return (
                                                <View style={tableDetailstyles.choose}>
                                                    <Text style={{ fontFamily: "Jost_500Medium", color: "#0102FD" }}>{item?.options_name}</Text>
                                                    {
                                                        _final_result?.filter_option_choices?.map((d, i) => (
                                                            <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                                                                <View style={{ height: 6, width: 6, borderRadius: 3, backgroundColor: "#08D61D" }}></View>
                                                                <Text style={{ fontFmaily: "Jost_500Medium" }}>{d?.choice_name}</Text>
                                                            </View>
                                                        ))
                                                    }
                                                </View>
                                            )
                                        })
                                    })()



                                }

                            </View>
                        ))
                    }
                </View>
                {
                    selectedTableOrderDetails ?? <View style={tableDetailstyles.totals}>
                        <View style={tableDetailstyles.firstrow}>
                            <Text style={tableDetailstyles.textl}>Items Total</Text>
                            <Text style={tableDetailstyles.totalprice}>$79.60</Text>
                        </View>
                        <View style={tableDetailstyles.secondrow}>
                            <Text style={tableDetailstyles.texto}>Tax & Charge</Text>
                            <Text style={tableDetailstyles.totalprice}>$12.60</Text>
                        </View>
                        <View style={tableDetailstyles.thirdrow}>
                            <Text style={tableDetailstyles.textl}>Grand Total</Text>
                            <Text style={tableDetailstyles.totalprice}>$104.60</Text>
                        </View>
                        <Text style={tableDetailstyles.pay}>Payment</Text>
                        <Text style={tableDetailstyles.cash}>Cash</Text>
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
            <View style={{ marginBottom: insets.bottom + 15 }}>
                {
                    buttons ? <View style={tableDetailstyles.buttWrapper}>
                        <TouchableOpacity
                            onPress={() => {
                                setSentToKitchen(true)
                            }}
                            style={tableDetailstyles.buttOne}>
                            <Text style={{ color: "#fff", fontFamily: "Jost_500Medium" }}>Send To Kitchen</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                setCompleted(true)
                            }}
                            style={tableDetailstyles.buttTwo}>

                            <Text style={{ color: "#fff", fontFamily: "Jost_500Medium" }}>Complete Order</Text>
                        </TouchableOpacity>
                    </View> : null
                }


            </View>
            {sentToKitchen ? <SentToKitchen setSentToKitchen={setSentToKitchen} /> : null}
            {completed ? <Completed setCompleted={setCompleted} /> : null}
        </View>
    )
}

export default TableDetails