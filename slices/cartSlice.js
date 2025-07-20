import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState = {
    cart : localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [],
    total: localStorage.getItem('total') ? JSON.parse(localStorage.getItem('total')) : 0,
    totalItems : localStorage.getItem('totalItems') ? JSON.parse(localStorage.getItem('totalItems')) : 0,
}

const cartSlice = createSlice({
    name:'cart',
    initialState,
    reducers:{
        addToCart : (state,action)=>{
            const course = action.payload;
            const index = state.cart.findIndex((item)=>item._id===course._id);
            if(index>=0){
                toast.error('Item already exists in the cart');
                return
            }
            state.cart.push(course);
            state.totalItems++;
            //Update the total cost
            state.total+=course.price;
            // Update localStorage
            localStorage.setItem('cart', JSON.stringify(state.cart));
            localStorage.setItem('total', JSON.stringify(state.total));
            localStorage.setItem('totalItems', JSON.stringify(state.totalItems));
            toast.success('Course added to cart'); // Added toast for success
        },
        // setTotalItems reducer body was empty, assumed it would directly set the value
        setTotalItems(state, action){
            state.totalItems = action.payload;
            localStorage.setItem('totalItems', JSON.stringify(state.totalItems));
        },
        // Add other cart operations as needed (e.g., removeFromCart, clearCart)
        removeFromCart: (state, action) => {
            const courseId = action.payload;
            const index = state.cart.findIndex((item) => item._id === courseId);

            if (index >= 0) {
                state.totalItems--;
                state.total -= state.cart[index].price;
                state.cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(state.cart));
                localStorage.setItem('total', JSON.stringify(state.total));
                localStorage.setItem('totalItems', JSON.stringify(state.totalItems));
                toast.success('Course removed from cart');
            }
        },
        clearCart: (state) => {
            state.cart = [];
            state.total = 0;
            state.totalItems = 0;
            localStorage.removeItem('cart');
            localStorage.removeItem('total');
            localStorage.removeItem('totalItems');
            toast.success('Cart cleared');
        }
    }
})

// Corrected export statement to include all defined actions
export const { addToCart, setTotalItems, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;