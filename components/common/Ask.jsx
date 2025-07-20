import React from 'react'
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import { setCourse, setEditCourse } from '../../slices/courseSlice';

const Ask = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const newHandler = ()=>{
        dispatch(setCourse(null));
        dispatch(setEditCourse(false));
        navigate('/dashboard/add-course');
    }
    const continueHandler= ()=>{
        navigate('/dashboard/add-course');
    }
  return (
    <div className='flex items-center justify-center w-[60vw] h-[80vh] gap-10'>
        <button onClick={()=>{newHandler()}} className='bg-[#161D29] font-semibold rounded-md px-3 py-2 text-2xl'>
            Adding a new Course 
        </button>
        <p className='text-2xl'>
            or
        </p>
        <button onClick={()=>{continueHandler()}} className='bg-amber-300 text-black px-3 py-2 rounded-md font-semibold text-2xl'>
            Continuing where you left off
        </button>
    </div>
  )
}

export default Ask