import { createContext, useReducer, useState } from "react";
import { _setStoreData } from "../utils/store";

export const UserContext = createContext();


export const ContextProvider = ({ children }) => {

    let initial_state = {
        user_data: null,
        is_login: false,
        cart_data: [],
        choise: [],
        option: [],
        sets: []
    }

    function state_reducer(state, action) {
        switch (action.type) {
            case 'SET_USER_DATA':
                console.log('action.payload', action.payload);
                return { ...state, user_data: action.payload };
            case 'SET_IS_LOGIN':
                return { ...state, is_login: action.payload };
            case 'ADD_CART': {
                // const payload = action.payload;
                // const newItems = Array.isArray(payload)
                //     ? payload
                //     : (payload != null ? [payload] : []);
                // console.log('added item to cart context///////////////' ,newItems)
                return {
                    ...state,
                    cart_data: [...state.cart_data, action.payload]
                };
                // console.log(state, 'sfsfsf')
            }
            case 'initilize_contestcart': {
                // const payload = action.payload;
                // const newItems = Array.isArray(payload)
                //     ? payload
                //     : (payload != null ? [payload] : []);
                // console.log('added item to cart context///////////////' ,newItems)
                console.log(action.payload, 'niiioioioioi')
                return {
                    ...state,
                    cart_data: action?.payload != null ? action.payload : []
                };
                // console.log(state, 'sfsfsf')
            }
            case 'UPDATE_CART_DATA': {
                // const payload = action.payload;
                // const newItems = Array.isArray(payload)
                //     ? payload
                //     : (payload != null ? [payload] : []);
                // console.log('added item to cart context///////////////' ,newItems)
                let updatedCartData = state.cart_data.map(item => {
                    if (item.table_number === action.payload.table_number) {
                        return {
                            ...item,
                            dishdata: [
                                ...(item.dishdata || []),          // existing dishdata
                                action.payload.dishdata[0]         // new dish
                            ]
                        };
                    }
                    return item; // unchanged items
                });


                // await _setStoreData('user_cart_data', JSON.stringify(updatedCartData))
                return {
                    ...state,
                    cart_data: updatedCartData
                };
                // console.log(state, 'sfsfsf')
            }
            case 'REMOVE_CART_DATA':
                return {
                    ...state,
                    cart_data: state.cart_data.filter(
                        item => item.id !== action.payload?.id
                    )
                };
            case 'SET_CHOICE_DATA':
                return {
                    ...state,
                    choise: [...state?.choise, ...action?.payload]
                };
            default:
                return state;
        }
    }

    const [state, dispatch] = useReducer(state_reducer, initial_state);

    return (
        <UserContext.Provider value={{ state, dispatch }}>
            {children}
        </UserContext.Provider>
    )
}