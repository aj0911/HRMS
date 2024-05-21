import { createSlice} from '@reduxjs/toolkit'

const initialState = {
    isAuth:false,
    user:null,
    remember:false
}

export const Auth = createSlice({
    name:'Auth',
    initialState,
    reducers:{
        login:(state,action)=>{
            state.isAuth = true
            state.user = action.payload.user;
            state.remember = action.payload.remember;
        },
        logout:(state)=>{
            state.isAuth = false
            state.user = null
            state.remember=false
        }
    }
})

export const {login,logout} = Auth.actions;