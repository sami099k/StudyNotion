import toast from "react-hot-toast";
import { apiConnector } from "./apiConnector";
import { courseAPIS, sectionAPIS, subSectionAPIS } from "./apis";
import { data } from "react-router-dom";

//edit Course 
export const editCourseDetails = async (data,token)=>{
    const toastId = toast.loading('Updating the course');
    try{

        const url = courseAPIS.UPDATE_COURSE_API;

        const response = await apiConnector('PUT',url,data,{
            Authorization : `Bearer ${token}`
        });
        
        if(!response?.data?.success){
            throw new Error('Request to update course failed');
        }
        toast.dismiss(toastId);
        toast.success('Course Updated Successfully');
        return response?.data?.course;

    }catch(err){

        console.log(err);
        toast.dismiss(toastId);
        toast.error('Error in Editing Course');

    }
}


export const fetchAllCategories = async ()=>{
    try{
        const response = await apiConnector('GET',courseAPIS.COURSE_CATEGORIES_API);
        return response.data.data;
    
    }catch(err){
        console.log(err);
        return [];
    }
}


export const addCourseDetails = async(formData,token)=>{
    try{
        const url = courseAPIS.COURSE_ADD_API;
        const toast_id = toast.loading('Creating a Course');
        const response = await apiConnector(
            'POST',
            url,
            formData,
            {
            Authorization : `Bearer ${token}`
            }
    )

        toast.dismiss(toast_id);
        toast.success('course added successfully');
        return response.data.course;
        

    }catch(err){
        toast.error('cannot create a course');
        console.log(err);

    }
}

export const fetchAllCourses = async (token)=>{
    try{
        const url = courseAPIS.FETCH_ALL_COURSES_API;
        const response = await apiConnector('GET',url,{},{
            Authorization : `Bearer ${token}`
        })
        return response?.data?.course;

    }catch(err){
        console.log(err);
    }
}

export const deleteCourse = async (data,token)=>{
    try{
        const url = courseAPIS.DELETE_COURSE_API;
        const response = await apiConnector('DELETE',url,data,{
            Authorization :`Bearer ${token}`
        })

        console.log(response);

    }catch(err){
        console.log(err);
    }
}

export const CourseDetailsCont = async (data, token)=>{
    try{
        const res = await apiConnector('POST',courseAPIS.COURSE_DETAILS_API,data,{
            Authorization : `Bearer ${token}`
        });
        console.log(res);
        
        if (!res?.data?.success) {
            throw new Error(res?.data?.message || 'Failed to fetch course details');
        }
        
        return res?.data?.course_details;

    }catch(err){
        console.error("Error in CourseDetailsCont:", err);
        throw err;
    }
}

export const updateSection = async(data,token)=>{

    try{
        const url = sectionAPIS.EDIT_SECTION_API;
        const response = await apiConnector('PUT',url,data,{
            Authorization : `Bearer ${token}`
        });
        if(!response?.data?.success){
            toast.error('Unable to update section')
            return;
        }

        toast.success('Section edited successfully')

        return response.data.course;
    
    return     
    }catch(err){
        console.log(err);
        toast.error('Unable to update section name');
    }


}

export const addSection = async (data , token)=>{
    try{

        const url = sectionAPIS.ADD_SECTION_API;
        const response = await apiConnector('POST',url,data,{
            Authorization : `Bearer ${token}`
        })
        toast.success('Section added Successfully');
        return response.data.course;
    }catch(err){
        console.log(err);
        toast.error('Could not add Section');
    }
}

export const deleteSection = async (data,token)=>{
    try{

        const url = sectionAPIS.DELETE_SECTION_API ;
        console.log(url);
        const response = await apiConnector('DELETE',url,data,{
            Authorization:`Bearer ${token}`
        })
        console.log(response);
        if(! response?.data?.success){
            toast.error('error in deleting the section');
            return;
        }
        toast.success('course deleted successfully');
        return response.data.course;

    }catch(err){
        console.log(err);
        toast.error('unable to delete the section');
    }
}

//seubSection 

export const addSubSection = async (data,token)=>{
    const toast_id = toast.loading('Adding Lecture');
    try{
        const url = subSectionAPIS.ADD_SUBSECTION_API;
        
        const response = await apiConnector('POST',url,data,{
            Authorization : `Bearer ${token}`
        });
        toast.dismiss(toast_id);
        if(!response?.data?.success){
            toast.error('error in adding lecture')
            return;
        }
        toast.success('Lecture Added Successfully');
        return response.data.course;
    }catch(err){
         toast.dismiss(toast_id);
        console.log(err);   
        toast.error('unable to add sub section');
    }
}


export const updateSubSection = async (data,token)=>{
    const toast_id = toast.loading('Updating Sub Section');
    try{
        const url = subSectionAPIS.EDIT_SUBSECTION_API;
        const response = await apiConnector('PUT',url,data,{
            Authorization : `Bearer ${token}`
         })

        if(! response.data.success){
            toast.dismiss(toast_id);
            toast.error('cannot edit lecture');
            return;
        }
            toast.dismiss(toast_id);
        toast.success('updated successfully');
        return response.data.course;

    }catch(err){
        toast.dismiss(toast_id);
        console.log(err);
        toast.error('unable to update lecture');
    }
}

export const deleteSubSection = async (data,token)=>{
    const toast_id = toast.loading('Deleting Sub Section');
    try{
        const url = subSectionAPIS.DELETE_SUBSECTION_API;
        const response = await apiConnector('DELETE',url,data,{
            Authorization : `Bearer ${token}`
         })

        if(! response.data.success){
            toast.dismiss(toast_id);
            toast.error('cannot Delete lecture');
            return;
        }
            toast.dismiss(toast_id);
        toast.success('Deleted successfully');
        return response.data.course;

    }catch(err){
        toast.dismiss(toast_id);
        console.log(err);
        toast.error('unable to delete lecture');
    }
}

export const updateStatus = async (data,token)=>{
    const toast_id = toast.loading('Updating Status');

    try{
        const url = courseAPIS.UPDATE_STATUS_API;
        const response = await apiConnector('PUT',url,data,{
            Authorization : `Bearer ${token}`
        });

        if(! response?.data?.success){
            toast.dismiss(toast_id);
            toast.error('unable to update status');
            return;
        }
        toast.dismiss(toast_id);
        toast.success('Course Published Successfully');

        return response.data.course;

    }catch(err){
        toast.dismiss(toast_id);
        console.log(err);
        toast.error('unable to update status');
    }
}