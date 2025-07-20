import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    loading : localStorage.getItem('paymentLoading') ?? false,
}

const paymentSlice = createSlice({
    name:'payment',
    initialState,
    reducers:{
        setPaymentLoading(state,value){
            state.loading = value.payload
        }
    }
})


export const {setPaymentLoading} = paymentSlice.actions;

export default paymentSlice.reducer;