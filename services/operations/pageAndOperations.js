import toast from "react-hot-toast"
import { catalogData } from "../apis";
import { apiConnector } from "../apiConnector";


export const getCatalogPageData = async (categoryId) =>{
    const toastId = toast.loading('Loading ');
    let result = [];
    try{
        const url = catalogData.CATALOG_PAGE_DETAILS_API;
        const response = await apiConnector('POST',url,{categoryId:categoryId});
        if(!response?.data?.success){
            throw new Error('Could not fetch category data');
        }


         result = response?.data?.data;

    } catch(err){
        console.log('Catalog page error',err);
        result = err?.response?.data;
    }
    toast.dismiss(toastId);
    return result;
}