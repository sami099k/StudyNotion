import toast from "react-hot-toast";
import { setUser } from "../slices/profileSlics";
import { apiConnector } from "./apiConnector";
import { profileAPIS } from "./apis"

export const updateDisplayPicture =  (token , formData)=>{

    return async (dispatch)=>{
        try{
            const toastID = toast.loading('Updating Profile Picture');
            const url = profileAPIS.UPDATE_DISPLAY_PICTURE_API;
            const response = await apiConnector('PUT',url,formData,
                            {
                                Authorization: `Bearer ${token}`
                            }
            );

        dispatch(setUser(response?.data?.user));
        toast.dismiss(toastID);
        toast.success('Profile picture updated')
        }catch(err){
            console.log(err);
            toast.error('Error in Changing in DP')
        }
    }

}