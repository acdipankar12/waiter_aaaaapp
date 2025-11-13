import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { addFoodStyles } from './styles'
import Toast from 'react-native-toast-message'
import { useNavigation } from '@react-navigation/native'
// import { AntDesign } from '@expo/vector-icons';
import IconAntDesign from 'react-native-vector-icons/AntDesign'
import IconFontisto from 'react-native-vector-icons/Fontisto'
import { UserContext } from '../../context/UserContext'

const AddFood = ({ setOpenModal, food, selectedPrice, selectedItemName, updateOptionData }) => {
    const navigation = useNavigation()
    const [spiceLevel, setSpiceLevel] = useState(null); // "Mild", "Med", or "Hot"
    const [selectedRices, setSelectedRices] = useState([]); // array of strings
    const { setTempFood, tempFood } = useContext(UserContext)

    const addTempFood = (foodItem) => {
        setTempFood(prev => [...prev, foodItem]);
    };

    console.log(food, 'optimndararar')
    useEffect(() => {
        console.log(selectedPrice, 'pice?????????????')
    }, [selectedPrice])

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

    function food_item_choice_update(_cID, qty, type) {


    }
    return (
        <View style={addFoodStyles.modalWrapper}>
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
                                                                {
                                                                    choiceItem?.type == '1' && (
                                                                        <IconFontisto

                                                                            name='checkbox-passive'

                                                                        />
                                                                    )
                                                                }

                                                                <Text style={addFoodStyles?.checkboxname2}> {choiceItem?.choice_name} {`($${choiceItem?.price})`}</Text>


                                                            </View>

                                                            {
                                                                choiceItem?.type == 1 ? (
                                                                    <IncrementItem
                                                                        item={choiceItem}

                                                                        changeFunction={updateChoiceData}
                                                                    />
                                                                )
                                                                    :
                                                                    (
                                                                        <View style={addFoodStyles.spicyCheckBox}>

                                                                            <View key={_index} style={addFoodStyles.checkBoxitems}>
                                                                                <TouchableOpacity
                                                                                    style={
                                                                                        // spiceLevel === level ? 
                                                                                        // addFoodStyles.checkboxselect : 
                                                                                        addFoodStyles.checkbox}
                                                                                    onPress={() => setSpiceLevel(level)}
                                                                                >
                                                                                    {/* {spiceLevel === level &&  */}
                                                                                    <IconAntDesign name="check" size={14} color="#fff" />
                                                                                    {/* } */}
                                                                                </TouchableOpacity>
                                                                                {/* <Text style={addFoodStyles.checkboxname}>{level}</Text> */}
                                                                            </View>

                                                                        </View>
                                                                    )
                                                            }

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

                />
                <View style={addFoodStyles.footer}>
                    <Text style={{ fontSize: 16, fontWeight: 700 }}>Total $11.90</Text>
                    <TouchableOpacity onPress={() => {
                        addTempFood({
                            name: food.foodname,
                            price: food.price,
                            desc: food.desc,
                            spice: spiceLevel,
                            dish: selectedRices
                        })
                        Toast.show({
                            type: "success",
                            text1: "Successfully Added in table"
                        }),
                            setOpenModal(false)
                        console.log(tempFood)

                    }} style={addFoodStyles.add}>
                        <Text style={{ color: "#fff", fontSize: 18 }}>Add</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default AddFood