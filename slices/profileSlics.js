import { createSlice } from "@reduxjs/toolkit";


const initialState = {
        user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) :  null,
        loading:false,
}

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setLoading(state,value){
            state.loading = value.payload;
        },
        setUser(state,value){
            state.user = value.payload;
            localStorage.setItem('user',JSON.stringify(state.user));
        }

    }
})

export const {setUser,setLoading} = profileSlice.actions
export default profileSlice.reducer