import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    signupData:null,
    loading:false,  
    token: localStorage.getItem('token') ? localStorage.getItem('token') : null,

}

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        setSignupData(state,value)   {
            state.signupData = value.payload;
        },
        setToken(state,value){
            state.token = value.payload
        },
        setLoading(state,value){
            state.loading = value.payload;
        }
    }
})

export const { setSignupData,setToken,setLoading } = authSlice.actions;
export default authSlice.reducer