import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import React, { useContext, useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import { addFoodStyles } from './styles'
import Toast from 'react-native-toast-message'
import { useNavigation } from '@react-navigation/native'
// import { AntDesign } from '@expo/vector-icons';
import IconAntDesign from 'react-native-vector-icons/AntDesign'
import IconFontisto from 'react-native-vector-icons/Fontisto'
import { UserContext } from '../../context/UserContext'
import { _removeStoreData, _retrieveStoreData, _setStoreData } from '../../utils/store'
import { FullWindowOverlay } from 'react-native-screens'

const AddFood = ({ setOpenModal, food, selectedPrice, selectedItemName, updateOptionData, selectedFood, table_modalopen, selectedTablenumber }, ref) => {
    const navigation = useNavigation()
    const [spiceLevel, setSpiceLevel] = useState(null); // "Mild", "Med", or "Hot"
    const [selectedRices, setSelectedRices] = useState([]); // array of strings
    const [checkedChoices, setCheckedChoices] = useState({}); // map of choiceId -> bool (checked)
    const [selectedChoiceIds, setSelectedChoiceIds] = useState([]); // array of selected choice ids
    const { setTempFood, tempFood, dispatch, state } = useContext(UserContext)

    const [comment, setComment] = useState('')
    const [toatlAmount, setTotalAmount] = useState(0)
    const addTempFood = (foodItem) => {
        setTempFood(prev => [...prev, foodItem]);
    };


    // async function calculateTotalAmount() {
    //     let _filterchoice = await food?.flatMap(item => item?.choices)
    //     const result = _filterchoice.filter(item => selectedChoiceIds.includes(item.id));
    //     const totalPrice = result.reduce((sum, item) => {
    //         const q = item.qty ?? 1;     // if qty is null → treat as 1
    //         return sum + item.price * q;
    //     }, 0);
    //     setTotalAmount(totalPrice)
    //     console.log(result, totalPrice + selectedPrice, 'choices filtet////////////')
    // }
    async function calculateTotalAmount() {
        try {
            // ensure selected ids set for O(1) lookup
            const idSet = new Set(selectedChoiceIds);

            // collect all possible choices from common locations
            const allChoices = (Array.isArray(food) ? food : []).flatMap(item => {
                // choices directly on item
                const direct = Array.isArray(item?.choices) ? item.choices : [];

                // choices inside options -> e.g. item.options = [{ choices: [...] }, ...]
                const fromOptions = Array.isArray(item?.options)
                    ? item.options.flatMap(opt => Array.isArray(opt?.choices) ? opt.choices : [])
                    : [];

                // sets (sometimes choices are stored in sets)
                const fromSets = Array.isArray(item?.sets) ? item.sets : [];

                // combine
                return [...direct, ...fromOptions, ...fromSets];
            });

            // filter only the chosen ones
            const filtered = allChoices.filter(ch => ch && idSet.has(ch.id));

            // compute total: price * qty (qty default 1 if null/undefined)
            const totalPrice = filtered.reduce((sum, ch) => {
                // parse price and qty to numbers; fallback to 0 for price
                const price = Number(ch?.price) || 0;
                // If qty is null/undefined -> default to 1. If it's 0 or numeric string, preserve it.
                const qty = (ch?.qty === null || ch?.qty === undefined) ? 1 : Number(ch.qty) || 0;
                return sum + price * qty;
            }, 0);

            // if you want to include selectedPrice in the final amount:
            const grandTotal = totalPrice + (Number(selectedPrice) || 0);

            // update state (you can change to setTotalAmount(grandTotal) if you don't want selectedPrice included)
            setTotalAmount(grandTotal);

            console.log('filtered choices:', filtered);
            console.log('totalPrice:', totalPrice, 'selectedPrice:', selectedPrice, 'grandTotal:', grandTotal);
            return { filtered, totalPrice, grandTotal };
        } catch (err) {
            console.error('calculateTotalAmount error', err);
            setTotalAmount(0);
            return { filtered: [], totalPrice: 0, grandTotal: 0 };
        }
    }

    useEffect(() => {
        calculateTotalAmount()
    }, [food])
    console.log(food, 'optimndararar')
    useEffect(() => {
        console.log(selectedPrice, 'pice?????????????')
    }, [selectedPrice])

    // Initialize checked state from incoming food data (choices with qty > 0 are considered checked)
    useEffect(() => {
        const initial = {};
        // food can be an array of sections or a single section object depending on how it's passed
        if (Array.isArray(food)) {
            food.forEach(section => {
                section?.choices?.forEach(choice => {
                    if (choice?.qty && Number(choice.qty) > 0) initial[choice.id] = true;
                });
            });
        } else if (food && Array.isArray(food.choices)) {
            // single section object with choices
            food.choices.forEach(choice => {
                if (choice?.qty && Number(choice.qty) > 0) initial[choice.id] = true;
            });
        }
        setCheckedChoices(initial);
    }, [food]);

    const toggleRice = (name) => {
        setSelectedRices((prev) =>
            prev.includes(name)
                ? prev.filter((item) => item !== name)
                : prev.length < 5
                    ? [...prev, name]
                    : prev
        );
    };

    const IncrementItem = ({ item, changeFunction }) => {
        return (
            <>
                <View style={{
                    width: 70,
                    height: 30,
                    // paddingHorizontal:12,
                    justifyContent: 'space-between',
                    flexDirection: 'row'
                }}>
                    <IconAntDesign
                        name='minus'
                        color='red'
                        size={15}
                        onPress={() => {
                            changeFunction(item?.id, item?.qty, 'decrease')
                        }}
                    />
                    <Text> {item?.qty}</Text>
                    <IconAntDesign

                        onPress={() => {
                            changeFunction(item?.id, item?.qty, 'increase')
                        }}
                        name='plus'
                        color='red'
                        size={15}
                    />

                </View>
            </>
        )
    }



    const updateChoiceData = (_cID, qty, type) => {
        //         let choice_main = food?.flatMap((_food) => _food?.choices)
        //         console.log(_cID, qty, 'optionm chooce')
        //         // let _cpoyChoice = [...food]
        //         let _selectedChoice = choice_main?.filter((_ch) => _ch?.id == _cID)
        //         if (type == 'increase') {
        //             _selectedChoice[0]['qty'] = qty + 1

        //  updateOptionData(prev => {

        //  })
        //         }  
        if (type == 'increase') {
            updateOptionData(prevData =>
                prevData.map(item => ({
                    ...item,
                    choices: item.choices.map(choice =>
                        choice.id === _cID ? { ...choice, qty: qty + 1 } : choice
                    )
                }))
            );
        } else {
            updateOptionData(prevData =>
                prevData.map(item => ({
                    ...item,
                    choices: item.choices.map(choice =>
                        choice.id === _cID ? { ...choice, qty: qty - 1 } : choice
                    )
                }))
            );
        }

        // console.log(_selectedChoice, choice_main, 'increerererere')
    }

    const toggleChoiceSelect = (choice) => {
        setCheckedChoices(prev => {
            const wasChecked = !!prev[choice.id];
            const nowChecked = !wasChecked;

            // Update qty in option data: when checked, ensure qty at least 1; when unchecked, reset to 0
            if (nowChecked) {
                updateOptionData(prevData =>
                    prevData.map(item => ({
                        ...item,
                        choices: item.choices.map(c =>
                            c.id === choice.id ? { ...c, qty: (c.qty && c.qty > 0) ? c.qty : 1 } : c
                        )
                    }))
                );
                setSelectedChoiceIds(prev => Array.from(new Set([...prev, choice.id])));
            } else {
                updateOptionData(prevData =>
                    prevData.map(item => ({
                        ...item,
                        choices: item.choices.map(c =>
                            c.id === choice.id ? { ...c, qty: 0 } : c
                        )
                    }))
                );
                setSelectedChoiceIds(prev => prev.filter(id => id !== choice.id));
            }

            return { ...prev, [choice.id]: nowChecked };
        });
    }

    function food_item_choice_update(_cID, qty, type) {


    }



    async function sanitize_dishData() {
        // table_modalopen(true)
        const parentOptionIds = food
            .filter(option =>
                option.choices.some(choice => selectedChoiceIds.includes(choice.id))
            )
            .map(option => option.id);

        let filteraddedchoices = food.flatMap(option => option.choices)         // merge all choices into one list
            .filter(choice => selectedChoiceIds.includes(choice.id));
        console.log(filteraddedchoices, 'chocefds')
        let dish_obj = {
            ...selectedFood,
            relation: {
                choices: selectedChoiceIds,
                options: parentOptionIds
            },
            sets: filteraddedchoices,
            comment: comment
        }
        let _finalDataformat = {
            category: '',
            data: [dish_obj],
            extraminimum: '',
            id: selectedFood?.id,
            quantity: 1

        }

        let _save_storageData = {
            table_number: selectedTablenumber,
            dishdata: [_finalDataformat],
            track_tableids: null,
            orderID: null

        }
        // await _removeStoreData('user_cart_data')
        // return;
        // console.log(await _retrieveStoreData('user_cart_data'), 'local store dish data aray context data..........>?????')
        // console.log(storage_cart_data, 'added storage data................>>')
        // await _setStoreData('user_cart_data', JSON.stringify([state?.cart_data, _save_storageData]))

        // check table number is present on current insert item
        let CHECK_TABLE_NUMBER_PRESERNT = state?.cart_data?.some(dish => dish?.table_number == selectedTablenumber);
        console.log(CHECK_TABLE_NUMBER_PRESERNT, 'table number>>>>>>>>>>>>>>>>>>')
        if (CHECK_TABLE_NUMBER_PRESERNT) {
            console.log('exit table numebra', state?.cart_data)
            // let _filtered_dish_by_table_number = state?.cart_data?.find(dish_item => dish_item?.table_number == selectedTablenumber);
            // _filtered_dish_by_table_number ?? _filtered_dish_by_table_number['dishdata']?.push(_finalDataformat)
            let updatedCartData = state.cart_data.map(item => {
                if (item.table_number === selectedTablenumber) {
                    return {
                        ...item,
                        dishdata: [
                            ...(item.dishdata || []),          // existing dishdata
                            _finalDataformat      // new dish
                        ]
                    };
                }
                return item; // unchanged items
            });
            console.log('modyfy the itemm', updatedCartData)
            await _setStoreData('user_cart_data', JSON.stringify(updatedCartData))

            dispatch({ type: 'UPDATE_CART_DATA', payload: _save_storageData })

        } else {

            console.log('not exit table number', _save_storageData)
            let _stateData = [
                ...(state?.cart_data || []), // <- ensure we spread an array
                _save_storageData             // make sure this is an object, not undefined
            ];
            // await _setStoreData('user_cart_data', JSON.stringify(updatedCartData))

            await _setStoreData('user_cart_data', JSON.stringify([_save_storageData]))
            dispatch({ type: 'ADD_CART', payload: _save_storageData })

        }
        // if()
        // let storage_cart_data = await _retrieveStoreData('user_cartdata')
        // console.log(storage_cart_data, 'storage cart_data//////////////////')
        // await _setStoreData('user_cartdata', JSON.stringify([_finalDataformat]))
        // dispatch({ type: 'ADD_CART', payload: _finalDataformat })

        // console.log(state, 'final data submit....')

    }

    // expose sanitize function to parent via ref so parent (and siblings) can call it
    useImperativeHandle(ref, () => ({
        sanitize_dishData
    }), [food, selectedChoiceIds, selectedFood, selectedTablenumber])

    return (
        <View style={addFoodStyles.modalWrapper} key={selectedFood?.id}>
            <View style={addFoodStyles.addbox}>
                <View style={addFoodStyles.head}>
                    <Text style={addFoodStyles.headname}>{selectedItemName}</Text>
                    <Text style={addFoodStyles.price}>{
                        selectedPrice && !isNaN(Number(selectedPrice))
                            ? `$${Number(selectedPrice).toFixed(2)}`
                            : ''
                    }</Text>
                </View>
                <View>

                    {
                        food?.length > 0 && food.map(element => {
                            return (
                                <>
                                    <Text style={addFoodStyles.spicytext}>{element?.option_name}</Text>
                                    <View style={{
                                        width: '100%'
                                    }}>
                                        {
                                            element?.choices?.length > 0 && element?.choices?.map((choiceItem, _index) => {
                                                return (
                                                    <>
                                                        <View style={{
                                                            width: '100%',
                                                            justifyContent: 'space-between',
                                                            flexDirection: 'row',
                                                            margin: 0,
                                                            padding: 0
                                                        }}>

                                                            <View style={{
                                                                alignItems: 'center',
                                                                flexDirection: 'row'
                                                            }}>
                                                                {/* For type 1 show a tappable Fontisto checkbox (passive/active). For other types don't render this icon here. */}
                                                                {Number(choiceItem?.type) === 1 ? (
                                                                    <TouchableOpacity onPress={() => toggleChoiceSelect(choiceItem)}>
                                                                        {selectedChoiceIds.includes(choiceItem?.id) ? (
                                                                            <IconFontisto name="checkbox-active" size={16} color="#000" />
                                                                        ) : (
                                                                            <IconFontisto name="checkbox-passive" size={16} color="#000" />
                                                                        )}
                                                                    </TouchableOpacity>
                                                                ) : null}

                                                                <Text style={addFoodStyles?.checkboxname2}> {choiceItem?.choice_name} {`($${choiceItem?.price})`}</Text>

                                                            </View>

                                                            {/* Show increment controls only when this is a type-1 choice AND the user has selected (toggled) it. */}
                                                            {Number(choiceItem?.type) === 1 && selectedChoiceIds.includes(choiceItem?.id) ? (
                                                                <IncrementItem
                                                                    item={choiceItem}
                                                                    changeFunction={updateChoiceData}
                                                                />
                                                            ) : Number(choiceItem?.type) !== 1 ? (
                                                                /* Non-type-1 items use the spicyCheckBox / radio-style UI. Pressing it will toggle selection similarly. */
                                                                <View style={addFoodStyles.spicyCheckBox}>
                                                                    <View key={_index} style={addFoodStyles.checkBoxitems}>
                                                                        <TouchableOpacity
                                                                            style={selectedChoiceIds.includes(choiceItem?.id) ? addFoodStyles.checkboxselect : addFoodStyles.checkbox}
                                                                            onPress={() => toggleChoiceSelect(choiceItem)}
                                                                        >
                                                                            {selectedChoiceIds.includes(choiceItem?.id) && <IconAntDesign name="check" size={14} color="#fff" />}
                                                                        </TouchableOpacity>
                                                                    </View>
                                                                </View>
                                                            ) : (
                                                                /* type 1 but not selected -> render nothing on the right */
                                                                <View style={{ width: 70, height: 30 }} />
                                                            )}

                                                        </View>
                                                    </>
                                                )
                                            })
                                        }
                                        {/* <Text> {ele}</Text> */}
                                    </View>

                                </>
                            )
                        })
                    }
                </View>
                {/* <Text style={addFoodStyles.spicytext}>How Spicy?</Text>
                <View style={addFoodStyles.spicyCheckBox}>
                    {['Mild', 'Med', 'Hot'].map((level) => (
                        <View key={level} style={addFoodStyles.checkBoxitems}>
                            <TouchableOpacity
                                style={spiceLevel === level ? addFoodStyles.checkboxselect : addFoodStyles.checkbox}
                                onPress={() => setSpiceLevel(level)}
                            >
                                {spiceLevel === level && <AntDesign name="check" size={14} color="#fff" />}
                            </TouchableOpacity>
                            <Text style={addFoodStyles.checkboxname}>{level}</Text>
                        </View>
                    ))}
                </View> */}
                {/* <Text style={addFoodStyles.choose}>Choose Rice Dishes</Text>
                <Text style={addFoodStyles.choosebrac}>(Min: 0 & Max:5)</Text>
                <View style={addFoodStyles.itemCheckBox}>
                    {[
                        { name: 'Safron Rice $3' },
                        { name: 'Rice Dishes $3' },
                        { name: 'Coconut Rice $4.00' },
                    ].map((item) => (
                        <View key={item.name} style={addFoodStyles.checkBoxitems2}>
                            <TouchableOpacity
                                style={selectedRices.includes(item.name) ? addFoodStyles.checkboxselect2 : addFoodStyles.checkbox2}
                                onPress={() => toggleRice(item.name)}
                            >
                                
                            </TouchableOpacity>
                            <Text style={addFoodStyles.checkboxname2}>{item.name}</Text>
                        </View>
                    ))} 
                </View> */}
                <TextInput
                    style={addFoodStyles.addcomment}
                    placeholder='Special Comment'
                    multiline={true}
                    numberOfLines={8}
                    value={comment}
                    onChangeText={(text) => setComment(text)}

                />
                <View style={addFoodStyles.footer}>
                    <Text style={{ fontSize: 16, fontWeight: 700 }}>Total ${Number(toatlAmount)?.toFixed(2)}</Text>
                    <TouchableOpacity onPress={() => {
                        table_modalopen(true)
                        // addTempFood({
                        //     name: food.foodname,
                        //     price: food.price,
                        //     desc: food.desc,
                        //     spice: spiceLevel,
                        //     dish: selectedRices
                        // })
                        Toast.show({
                            type: "success",
                            text1: "Successfully Added in table"
                        }),
                            // setOpenModal(false)
                            console.log(tempFood)

                    }} style={addFoodStyles.add}>
                        <Text style={{ color: "#fff", fontSize: 18 }}>Add</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default forwardRef(AddFood)