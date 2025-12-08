import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, SectionList, Image } from 'react-native'
import React, { useContext, useEffect, useRef, useState, useTransition } from 'react'
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
// import React, { useContext, useEffect, useRef, useState } from 'react
import { UserContext } from '../../context/UserContext'
import { apiRequest } from '../../utils/apiService'
import { _retrieveStoreData, navigationRef } from '../../utils/store'
import FoodCardSkeleton from '../../components/foodcard/foodskelaton'
import CategoriesSkeleton from '../../components/categories/CategoriesSkelatomn'
import Modal from "react-native-modal";
import SubCategories from '../../components/categories/subCategory'
import { useNavigation } from '@react-navigation/native'
const PER_PAGE = 10

const Home = () => {
    const [openModal, setOpenModal] = useState(false)
    const [selectedfood, setSelectedFood] = useState(null)
    const { tempFood, state, dispatch } = useContext(UserContext)
    const [openModaltable, setOpenModaltable] = useState(false)
    const menuOptions = [
        'Tuesday Deal',
        'Weekend Special',
        'Evening Bites',
        'Sizzlers',
        'Sweet Tooth',
    ];

    const navigation = useNavigation()
    const [categoriesData, setCategoriesData] = useState([])
    const [loading, setloading] = useState(false)
    const [subcategoryListData, setSubcategorylistData] = useState([])
    const [selected, setSelected] = useState(null);
    const [categoriesLoaDING, setCategoriesLoading] = useState(false)

    // currentChildren holds the list being shown in the subcategory row
    const [currentChildren, setCurrentChildren] = useState([])
    // stack to track previous children arrays for back navigation
    const [childrenStack, setChildrenStack] = useState([])
    // top-level selected category (whose children we're drilling)
    const [activeCategory, setActiveCategory] = useState(null)

    const [optionData, setOptionData] = useState([])
    const [dishesListData, setDishListData] = useState([])
    const [dishloading, setDishloading] = useState(false)
    const [selectedCateActive, setSelectedCategoryactive] = useState([])
    const [checkboxIdData, setCheckboxidData] = useState([])

    // search state
    const [searchTerm, setSearchTerm] = useState('')
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

    const [loadingMore, setLoadingMore] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [pageNo, setPageNo] = useState(1)
    const [hasMore, setHasMore] = useState(true)

    const [selectedTablenumber, setselectedTablenumber] = useState(0)
    // ref to access AddFood's imperative handle (exposed sanitize function)
    const addFoodRef = useRef(null)
    const AddFoodModal = async (f) => {
        console.log("Add Food Modal")
        // open modal immediately so UI isn't blocked by the network request
        setSelectedFood(f)
        setOpenModal(true)
        try {
            await fetchDishOptionData(f?.id)
        } catch (e) {
            console.log('Failed fetching dish options, showing modal anyway', e)
            // ensure optionData is cleared so AddFood can render safely
            setOptionData([])
        }
    }

    useEffect(async () => {
        let _usertoken = await _retrieveStoreData('_waiter_token')
        console.log(_usertoken, 'omekk')

    }, [])
    async function fetchDishOptionData(dishid) {
        try {
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
        } catch (err) {
            console.log('fetchDishOptionData error', err)
            setOptionData([])
            throw err
        }
    }


    const autoScrollCategories = (index) => {
        const thresholdIndex = (categoriesData?.length ?? 0) - 3;
        if (index >= thresholdIndex && categoriesRef.current && categoriesRef.current.scrollToIndex) {
            categoriesRef.current.scrollToIndex({
                index: Math.min(index + 1, Math.max(0, (categoriesData?.length ?? 1) - 1)),
                animated: true,
            });
        }
    };

    const autoScrollSubcategories = (index) => {
        const thresholdIndex = (currentChildren?.length ?? 0) - 3;
        if (index >= thresholdIndex && subcategoriesRef.current && subcategoriesRef.current.scrollToIndex) {
            subcategoriesRef.current.scrollToIndex({
                index: Math.min(index + 1, Math.max(0, (currentChildren?.length ?? 1) - 1)),
                animated: true,
            });
        }
    };

    const categoriesRef = useRef(null);
    const subcategoriesRef = useRef(null);

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


            if (api_res?.status == true) {
                setCategoriesData(api_res?.data)
                // set default selected to first category
                const firstCat = api_res?.data[0]
                if (firstCat) {
                    setActiveCategory(firstCat)
                    setSelected(firstCat)
                    // set the current children for the first category (handle both keys)
                    const rawChildren = firstCat?.childrenCategories ?? firstCat?.children_categories ?? []
                    const children =
                        rawChildren.length > 0
                            ? [
                                { id: 0, name: "{\"1\":\"All\",\"5\":\"All\",\"6\":\"ALL\"}" },
                                ...rawChildren
                            ]
                            : []
                    setChildrenStack([])
                    setCurrentChildren(children)
                    await fetchsubCategoryData(firstCat.id, _userData?.business, debouncedSearchTerm)

                    const obj = firstCat?.name ? JSON.parse(firstCat.name) : {}
                    const firstValue = obj[Object.keys(obj)[0]]
                    setSelectedCategoryactive([firstValue])
                }
            }
            setCategoriesLoading(false)
        } catch (error) {
            console.log('catch error ', error)
        }
    }

    async function retrive_savecart() {
        let _data = await _retrieveStoreData('user_cart_data')
        console.log(JSON.parse(_data), 'local dartatatt')
        await dispatch({ type: 'initilize_contestcart', payload: JSON.parse(_data) ?? JSON.parse(_data) })
        // console.log(_data, 'cart darta stoet/////')
    }
    // return cart dish data from local storage
    useEffect(() => {
        retrive_savecart()
    }, [])
    // fetch  subcategory list data
    async function fetchsubCategoryData(cat_id, business_id, search_keyword = '', page = 1, append = false, showLoader = true) {
        setDishloading(true)

        setloading(true)
        ///
        if (append) {
            setLoadingMore(true)
        } else if (showLoader) {
            setDishloading(true)
        }

        //
        setSubcategorylistData([])
        setDishListData([])
        console.log('api der')

        let _usertoken = await _retrieveStoreData('_waiter_token')

        try {
            let api_res = await apiRequest('waiter/get-business-dishes', 'post', {
                category_id: cat_id,
                lang_id: '1',
                type: '2',
                business_id: business_id,
                search_keyword: search_keyword ?? '',
                perPage: PER_PAGE,
                pageNo: page

            }, {
                "Content-Type": "application/json",
                "Accept": "application/json",
                'Authorization': `Bearer ${_usertoken}`
            })



            if (api_res?.status == true) {
                const incomingOrders = Array.isArray(api_res?.data) ? api_res?.data : []
                setDishListData(prev => append ? [...prev, ...incomingOrders] : incomingOrders)
                setPageNo(page)
                setHasMore(incomingOrders.length === PER_PAGE)

                // if (typeof api_res?.data == 'undefined') {
                console.log(api_res?.data, 'sub catetlfkdf')
                // setDishListData([...api_res?.data, {}, {}])
                setDishloading(false)

                // }
            }
            // console.log()
            setloading(false)
        } catch (error) {
            setDishloading(false)

            console.log('catch error ', error)
        } finally {
            if (append) {
                setLoadingMore(false)
            } else if (showLoader) {
                setDishloading(false)
            }
        }
    }

    useEffect(() => {
        // Whenever `selected` or debounced search changes, fetch dishes for that category/subcategory
        if (selected?.id) fetchsubCategoryData(selected.id, state?.user_data?.business, debouncedSearchTerm)
    }, [selected, debouncedSearchTerm])

    // debounce search term to avoid spamming API
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm)
        }, 400) // 400ms debounce

        return () => clearTimeout(timer)
    }, [searchTerm])

    const handleBack = () => {
        if (childrenStack.length > 0) {
            const prev = childrenStack[childrenStack.length - 1]
            setChildrenStack(prevStack => prevStack.slice(0, -1))
            setCurrentChildren(prev)
            setSelectedCategoryactive(prevArr => prevArr.slice(0, -1))
            // reset selected to activeCategory so dish list shows category items
            if (activeCategory) setSelected(activeCategory)
            return
        }
        // if no more stack, reset to active category top-level children
        if (activeCategory) {
            const rawChildren = activeCategory?.childrenCategories ?? activeCategory?.children_categories ?? []
            const children =
                rawChildren.length > 0
                    ? [
                        { id: 0, name: "{\"1\":\"All\",\"5\":\"All\",\"6\":\"ALL\"}" },
                        ...rawChildren
                    ]
                    : []
            setCurrentChildren(children)
            const obj = activeCategory?.name ? JSON.parse(activeCategory.name) : {}
            const firstValue = obj[Object.keys(obj)[0]]
            setSelectedCategoryactive([firstValue])
            setSelected(activeCategory)
        }
    }

    // check box update data
    const selectCheckboxData = () => {

    }

    // paginatin product list 
    const handleLoadMore = () => {
        if (loadingMore || !hasMore) {
            return
        }

        fetchsubCategoryData(selected.id, state?.user_data?.business, debouncedSearchTerm, pageNo + 1, true)
    }

    const handleRefresh = () => {
        setRefreshing(true)
        setHasMore(true)
        fetchsubCategoryData(selected.id, state?.user_data?.business, debouncedSearchTerm, 1, false, false).finally(() => setRefreshing(false))
    }

    return (
        <>

            {/* {
                openModal ? <AddFood
                    setOpenModal={setOpenModal}
                    food={selectedfood}
                    openModal={openModal}

                /> : null
            } */}

            {/* <ScrollView style={{ flex: 1, paddingBottom: 70, backgroundColor: "#fff", }}> */}
            <SafeAreaView style={{
                flex: 1, paddingBottom: 70, backgroundColor: "#fff",
                paddingTop: StatusBar?.currentHeight - StatusBar.currentHeight * .50

            }}>


                <Header
                    inhome={true}
                    searchValue={searchTerm}
                    onSearchChange={setSearchTerm}
                />
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
                            ref={categoriesRef}
                            data={categoriesData}
                            renderItem={({ item, index }) => (
                                <Categories
                                    item={item}
                                    isSelected={


                                        selected?.id == item?.id}
                                    onPress={() => {
                                        // select category and display its children (reset drill stack)
                                        setActiveCategory(item)
                                        setSelected(item)
                                        const rawChildren = item?.childrenCategories ?? item?.children_categories ?? []
                                        const children =
                                            rawChildren.length > 0
                                                ? [
                                                    { id: 0, name: "{\"1\":\"All\",\"5\":\"All\",\"6\":\"ALL\"}" },
                                                    ...rawChildren
                                                ]
                                                : []
                                        setChildrenStack([])
                                        setCurrentChildren(children)
                                        const obj = item?.name ? JSON.parse(item.name) : {}
                                        const catLabel = obj[Object.keys(obj)[0]]
                                        setSelectedCategoryactive([catLabel])
                                        // auto scroll categories list when needed
                                        autoScrollCategories(index)
                                    }}
                                />
                            )}
                            keyExtractor={(item) => item?.id?.toString()}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{
                                paddingBottom: 10,
                                // backgroundColor: 'green'
                                // flexGrow:1
                                // paddingVertical:20
                                // backgroundColor:'red'
                            }}
                        />
                    )}

                     <View style={{
                        marginTop: 8,
                        // backgroundColor:'green',
                        // position:'relative' 
                    }}>
                        {
                            !categoriesLoaDING && (
                                <FlatList
                                    horizontal
                                    ref={subcategoriesRef}
                                    data={currentChildren?.length != 0 ? currentChildren : []}
                                    renderItem={({ item, index }) => {
                                        const isAll = item?.id === 0
                                        const isSelected = isAll
                                            ? (selected?.id === activeCategory?.id)
                                            : (selected?.id === item?.id)
                                        return (
                                            <SubCategories
                                                item={item}
                                                isSelected={isSelected}
                                                onPress={() => {
                                                    // determine actual children from API shape
                                                    const children = item?.childrenCategories ?? item?.children_categories ?? []
                                                    const obj = item?.name ? JSON.parse(item.name) : {}
                                                    const label = obj[Object.keys(obj)[0]]
                                                    const isAll = item?.id === 0

                                                    if (children && children.length > 0) {
                                                        // push current children to stack so Back can restore
                                                        setChildrenStack(prev => [...prev, currentChildren])
                                                        // add an "All" option at this nested level as first item
                                                        const nextChildren = [
                                                            { id: 0, name: "{\"1\":\"All\",\"5\":\"All\",\"6\":\"ALL\"}" },
                                                            ...children
                                                        ]
                                                        setCurrentChildren(nextChildren)
                                                        if (selectedCateActive.includes(label) == false) {
                                                            setSelectedCategoryactive(prev => [...prev, label])
                                                        }

                                                        setSelected(item)
                                                        autoScrollSubcategories(index)
                                                    } else {
                                                        // leaf selected: if it's the "All" placeholder, use activeCategory to fetch
                                                        if (isAll && activeCategory) {
                                                            setSelected(activeCategory)
                                                        } else {
                                                            setSelected(item)
                                                            if (selectedCateActive.includes(label) == false) {
                                                                setSelectedCategoryactive(prev => [...prev, label])
                                                            }
                                                        }
                                                        autoScrollSubcategories(index)
                                                    }
                                                }}
                                            />
                                        )
                                    }}
                                    keyExtractor={(item) => item?.id?.toString()}
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{
                                        // paddingBottom: 10,
                                        // paddingTop: 6,
                                        // flexGrow:0
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


                    <View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        //    paddingHorizontal:20
                    }}>
                        <View></View>
                        {/* <View style={{
                            maxWidth: '80%'
                        }} >
                            <Text style={{
                                color: '#0000ff',
                                fontFamily: "Jost_400Regular",
                                fontSize: 18,
                                fontWeight: '700'
                            }}>{

                                    !categoriesLoaDING && (Array.isArray(selectedCateActive) ? selectedCateActive.join('  >  ') : selectedCateActive)
                                    // selected == null ? selectedCateActive : JSON.parse(selected?.name)[Object.keys(JSON.parse(selected?.name))[0]]

                                } </Text>
                        </View> */}

                        {
                            childrenStack?.length > 0 && (
                                <TouchableOpacity onPress={handleBack}>
                                    <Text style={{
                                        backgroundColor: '#0000ff',
                                        padding: 4,
                                        paddingHorizontal: 12,
                                        borderRadius: 5,
                                        color: '#FFFFFF',
                                        // position:'absolute'
                                    }}>Back</Text>
                                </TouchableOpacity>
                            )
                        }

                    </View>
                    {loading && (
                        // Show 4 skeletons as placeholder
                        Array.from({ length: 4 }).map((_, idx) => (
                            <FoodCardSkeleton key={idx} />
                        ))
                    )
                    }
                    {
                        !loading && (
                            <>

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
                                        showsVerticalScrollIndicator={false}
                                        contentContainerStyle={[
                                            homeStyles.foodSection,
                                            {
                                                paddingBottom: 130,
                                                // backgroundColor: 'red',
                                                paddingTop: 10
                                                // backgroundColor
                                            }
                                        ]}
                                        ListEmptyComponent={() => {
                                            return (
                                                <>
                                                    {
                                                        !categoriesLoaDING && (
                                                            <View style={{
                                                                // justifyContent:'center',
                                                                alignItems: 'center',
                                                                height: '100%'
                                                            }}>

                                                                <Image
                                                                    source={require('../../../assets/emptydish.jpg')}
                                                                    style={{
                                                                        width: 120,
                                                                        height: 110,
                                                                        marginTop: 70
                                                                    }}
                                                                    resizeMethod='auto'
                                                                    resizeMode='contain'
                                                                />
                                                                <Text style={{
                                                                    fontSize: 19,
                                                                    color: '#000000',
                                                                    fontWeight: '600'
                                                                }}> No Dish Found !</Text>
                                                            </View>
                                                        )
                                                    }

                                                </>
                                            )

                                        }}
                                        // style={{
                                        //     flexGrow: 0
                                        // }}
                                        onEndReached={() => { handleLoadMore() }}
                                        onEndReachedThreshold={0.2}
                                        refreshing={refreshing}
                                        onRefresh={() => { handleRefresh() }}

                                    />
                                </>


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
                        ref={addFoodRef}
                        setOpenModal={setOpenModal}
                        food={optionData}
                        openModal={openModal}
                        selectedPrice={selectedfood?.offerprice}
                        selectedItemName={selectedfood?.name}

                        updateOptionData={setOptionData}
                        selectedFood={selectedfood}
                        table_modalopen={setOpenModaltable}
                        selectedTablenumber={selectedTablenumber}
                        setselectedTablenumber={setselectedTablenumber}
                        disloading={dishloading}

                    />
                </Modal>
                {openModaltable && (
                    <>
                        <Modal
                            isVisible={openModaltable}
                        // onBackButtonPress={() => setOpenModal(false)}
                        // onBackdropPress={() => setOpenModal(false)}
                        >
                            <BookTable
                                setOpenModal={setOpenModal}
                                setselectedTablenumber={setselectedTablenumber}
                                selectedtablenumber={selectedTablenumber}
                                setOpenModaltable={setOpenModaltable}
                                // pass a safe wrapper that calls AddFood's sanitize function exposed via ref
                                sanitize_dishData={() => addFoodRef.current?.sanitize_dishData?.()}
                            />
                        </Modal>
                    </>
                )}
            </SafeAreaView>
            {/* </ScrollView> */}
            <TouchableOpacity onPress={() => navigation.navigate('my-cart')} style={homeStyles.cartFloat}>
                {tempFood?.length === 0 ? null : <View style={homeStyles.cartcount}><Text>{state?.cart_data?.length}</Text></View>}
                <FontAwesomeIcon name="shopping-cart" size={34} color="#fff" />
            </TouchableOpacity>

        </>
    )
}

export default Home