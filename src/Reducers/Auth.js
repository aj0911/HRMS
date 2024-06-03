import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isAuth: false,
    user: null,
    remember: false,
    remember_token: null
}

export const Auth = createSlice({
    name: 'Auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.isAuth = true
            state.user = action.payload.user;
            state.remember = action.payload.remember;
            state.remember_token = action.payload.remember ? null : (new Date(Date.now() + 1* 60 * 60 * 1000)).getTime();
        },
        logout: (state) => {
            state.isAuth = false
            state.user = null
            state.remember = false
            state.remember_token = null;
        }
    }
})

export const { login, logout } = Auth.actions;