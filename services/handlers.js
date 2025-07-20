import toast from "react-hot-toast";
import { setUser } from "../slices/profileSlics";
import { setToken } from "../slices/authSlice";


export const logouthandler = (navigate)=>{
        
    return (dispatch)=>{
        
        dispatch(setToken(null));
        dispatch(setUser(null));
        localStorage.removeItem('token');
        toast.success('Logged Out')
        navigate('/login')
    }

}