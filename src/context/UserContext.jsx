import { createContext, useReducer, useState } from "react";

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
            case 'ADD_CART':
                return {
                    ...state,
                    cart_data: [...state?.actioncart_data, ...action.payload]

                };
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