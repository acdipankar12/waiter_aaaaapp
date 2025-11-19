import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, SectionList } from 'react-native'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { ScrollView } from 'react-native'
import Header from '../../components/header/Header'
import { homeStyles } from './styles'
import { FlatList } from 'react-native'
import Categories from '../../components/categories/Categories'
import FoodCard from '../../components/foodcard/FoodCard'
import AddFood from '../../components/addfood/AddFood'
// import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import EntypoIcon from 'react-native-vector-icons/Entypo';

import BookTable from '../../components/booktable/BookTable'
import { foodsdata } from '../../data/foods'
import { UserContext } from '../../context/UserContext'
import { apiRequest } from '../../utils/apiService'
import { _retrieveStoreData } from '../../utils/store'
import FoodCardSkeleton from '../../components/foodcard/foodskelaton'
import CategoriesSkeleton from '../../components/categories/CategoriesSkelatomn'
import Modal from "react-native-modal";
import SubCategories from '../../components/categories/subCategory'

const Home = () => {
    const [openModal, setOpenModal] = useState(false)
    const [selectedfood, setSelectedFood] = useState(null)
    const { tempFood, state } = useContext(UserContext)
    const [openModaltable, setOpenModaltable] = useState(false)
    const menuOptions = [
        'Tuesday Deal',
        'Weekend Special',
        'Evening Bites',
        'Sizzlers',
        'Sweet Tooth',
    ];

    const [categoriesData, setCategoriesData] = useState([])
    const [loading, setloading] = useState(false)
    const [subcategoryListData, setSubcategorylistData] = useState([])
    const [selected, setSelected] = useState(null);
    const [categoriesLoaDING, setCategoriesLoading] = useState(false)

    const [optionData, setOptionData] = useState([])
    const [dishesListData, setDishListData] = useState([])

    const [selectedCateActive, setSelectedCategoryactive] = useState([])
    const [checkboxIdData, setCheckboxidData] = useState([])
    const AddFoodModal = async (f) => {
        console.log("Add Food Modal")
        await fetchDishOptionData(f?.id)
        setOpenModal(true)
        setSelectedFood(f)
    }

    async function fetchDishOptionData(dishid) {
        let _usertoken = await _retrieveStoreData('_waiter_token')

        let apiRes = await apiRequest('waiter/get-business-dish-details', 'post', {
            lang_id: '1',
            dish_id: dishid
        }, {
            "Content-Type": "application/json",
            "Accept": "application/json",
            'Authorization': `Bearer ${_usertoken}`
        })

        setOptionData(apiRes?.data?.options)
        console.log(apiRes, 'dish option data/???')
    }


    const autoScrollIfNeeded = (index) => {
        const thresholdIndex = categoriesData?.length - 3;

        if (index >= thresholdIndex && flatListRef.current) {
            flatListRef.current.scrollToIndex({
                index: Math.min(index + 1, categoriesData?.length - 1),
                animated: true,
            });
        }
    };

    const flatListRef = useRef(null);

    useEffect(() => {
        fetchCategoryData()

    }, [])
    // fetch category list data
    async function fetchCategoryData() {
        console.log('api der')
        setCategoriesLoading(true)
        let _usertoken = await _retrieveStoreData('_waiter_token')
        let _userData = await _retrieveStoreData('userSession_waiter')

        try {
            let api_res = await apiRequest('waiter/get-business-categories', 'post', {
                lang_id: '1',
                type: '2',
                business_id: _userData?.business
            }, {
                "Content-Type": "application/json",
                "Accept": "application/json",
                'Authorization': `Bearer ${_usertoken}`
            })
            console.log(api_res, 'api response>>>>>')


            if (api_res?.status == true) setCategoriesData(api_res?.data)
            await fetchsubCategoryData(api_res?.data[0]?.id, _userData?.business)
            // console.log()
            const obj = JSON.parse(api_res?.data[0]?.name);

            const firstValue = obj[Object.keys(obj)[0]];
            setSelectedCategoryactive([firstValue])
            setCategoriesLoading(false)
        } catch (error) {
            console.log('catch error ', error)
        }
    }

    // fetch  subcategory list data
    async function fetchsubCategoryData(cat_id, business_id) {
        setSubcategorylistData([])
        setDishListData([])
        console.log('api der')
        setloading(true)
        let _usertoken = await _retrieveStoreData('_waiter_token')

        try {
            let api_res = await apiRequest('waiter/get-business-dishes', 'post', {
                category_id: cat_id,
                lang_id: '1',
                type: '2',
                business_id: business_id
            }, {
                "Content-Type": "application/json",
                "Accept": "application/json",
                'Authorization': `Bearer ${_usertoken}`
            })


            console.log(api_res, 'item data////////////////////')
            if (api_res?.status == true) {
                // if (typeof api_res?.data == 'undefined') {
                console.log(api_res?.data, 'sub catetlfkdf')
                setDishListData(api_res?.data)

                // }
            }
            // console.log()
            setloading(false)
        } catch (error) {
            console.log('catch error ', error)
        }
    }

    useMemo(() => {
        fetchsubCategoryData(selected?.id, state?.user_data?.business)
    }, [selected])

    // check box update data
    const selectCheckboxData = () => {

    }
    return (
        <>

            {
                openModal ? <AddFood
                    setOpenModal={setOpenModal}
                    food={selectedfood}
                    openModal={openModal}

                /> : null
            }
            {openModaltable ? <BookTable setOpenModaltable={setOpenModaltable} /> : null}
            {/* <ScrollView style={{ flex: 1, paddingBottom: 70, backgroundColor: "#fff", }}> */}
            <SafeAreaView style={{
                flex: 1, paddingBottom: 70, backgroundColor: "#fff",
                paddingTop: StatusBar?.currentHeight - StatusBar.currentHeight * .50

            }}>

                <Header inhome={true} />
                <View style={{ paddingHorizontal: 20, marginBottom: 70 }}>
                    {categoriesLoaDING ? (
                        <FlatList
                            horizontal
                            data={Array.from({ length: 5 })}
                            renderItem={({ item, index }) => <CategoriesSkeleton key={index} />}
                            keyExtractor={(_, index) => index.toString()}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{
                                paddingBottom: 10
                            }}
                        />
                    ) : (
                        <FlatList
                            horizontal
                            ref={flatListRef}
                            data={categoriesData}
                            renderItem={({ item, index }) => (
                                <Categories
                                    item={item}
                                    isSelected={selected?.id == item?.id}
                                    onPress={() => {
                                        setSelected(item);
                                        autoScrollIfNeeded(index);
                                    }}
                                />
                            )}
                            keyExtractor={(item) => item?.id?.toString()}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{
                                paddingBottom: 10
                            }}
                        />
                    )}

                    <View>
                        {
                            !categoriesLoaDING && (
                                <FlatList
                                    horizontal
                                    ref={flatListRef}
                                    data={categoriesData[0]?.childrenCategories}
                                    renderItem={({ item, index }) => (
                                        <SubCategories
                                            item={item}
                                            isSelected={selected?.id == item?.id}
                                            onPress={() => {
                                                setSelected(item);
                                                autoScrollIfNeeded(index);
                                            }}
                                        />
                                    )}
                                    keyExtractor={(item) => item?.id?.toString()}
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{
                                        paddingBottom: 10,
                                        // borderBottomColor:'gray',
                                        // borderBottomWidth:1.5
                                    }}
                                />
                            )
                        }
                    </View>
                    {/* {
                        foodsdata?.map((food) => (
                            <View key={food?.id} style={homeStyles.foodSection}>
                                <Text style={{ fontWeight: "500", fontSize: 15, }}>{food.title}</Text>
                                <View style={homeStyles.foodsbox}>
                                    {
                                        food.food?.map((f) => (
                                            <FoodCard
                                                key={f.id}
                                                onPress={() => AddFoodModal(f)}
                                                food={f}
                                            />

                                        ))
                                    }

                                </View>
                            </View>
                        ))
                    } */}

                    {/* section list data.../// */}

                    {loading && (
                        // Show 4 skeletons as placeholder
                        Array.from({ length: 4 }).map((_, idx) => (
                            <FoodCardSkeleton key={idx} />
                        ))
                    )
                    }
                    <View>
                        <Text style={{
                            color: '#0000ff',
                            fontFamily: "Jost_400Regular",
                            fontSize: 18,
                            fontWeight: '700'
                        }}>{
                                !categoriesLoaDING && selectedCateActive
                                // selected == null ? selectedCateActive : JSON.parse(selected?.name)[Object.keys(JSON.parse(selected?.name))[0]]

                            } </Text>
                    </View>
                    {
                        !loading && (
                            <>
                                {
                                    dishesListData?.length > 0 ? (
                                        <>
                                            <FlatList
                                                // horizontal
                                                // ref={flatListRef}
                                                data={dishesListData}
                                                renderItem={({ item }) => (

                                                    <FoodCard
                                                        key={item.id}
                                                        onPress={() => AddFoodModal(item)}
                                                        food={item}
                                                    />
                                                )}
                                                keyExtractor={(item) => item?.id?.toString()}
                                                showsHorizontalScrollIndicator={false}
                                                contentContainerStyle={homeStyles.foodSection}
                                                ListEmptyComponent={() => {
                                                    <View>
                                                        <Text style={{
                                                            fontSize: 25,
                                                            color: '#000000',
                                                            fontWeight: '600'
                                                        }}> No Dish Found !</Text>
                                                    </View>
                                                }}

                                            />
                                        </>
                                    )
                                        :
                                        (
                                            <> </>
                                            // <SectionList
                                            //     sections={subcategoryListData.map(food => ({
                                            //         title: food.name,
                                            //         data: food.dishes || []
                                            //     }))}
                                            //     keyExtractor={(item) => item.id?.toString()}
                                            //     renderSectionHeader={({ section: { title } }) => (
                                            //         <Text style={{ fontWeight: "500", fontSize: 15 }}>{title}</Text>
                                            //     )}
                                            //     renderItem={({ item }) => (

                                            //         <FoodCard
                                            //             key={item.id}
                                            //             onPress={() => AddFoodModal(item)}
                                            //             food={item}
                                            //         />
                                            //     )}
                                            //     contentContainerStyle={homeStyles.foodSection}
                                            //     stickySectionHeadersEnabled={false}
                                            //     showsVerticalScrollIndicator={false}
                                            // />
                                        )
                                }

                            </>

                        )
                    }

                </View>
                <Modal
                    isVisible={openModal}
                    onBackButtonPress={() => setOpenModal(false)}
                    onBackdropPress={() => setOpenModal(false)}
                >
                    <AddFood
                        setOpenModal={setOpenModal}
                        food={optionData}
                        openModal={openModal}
                        selectedPrice={selectedfood?.offerprice}
                        selectedItemName={selectedfood?.name}

                        updateOptionData={setOptionData}

                    />
                </Modal>
            </SafeAreaView>
            {/* </ScrollView> */}
            <TouchableOpacity onPress={() => setOpenModaltable(true)} style={homeStyles.cartFloat}>
                {tempFood?.length === 0 ? null : <View style={homeStyles.cartcount}><Text>{tempFood?.length}</Text></View>}
                <FontAwesomeIcon name="shopping-cart" size={34} color="#fff" />
            </TouchableOpacity>

        </>
    )
}

export default Home