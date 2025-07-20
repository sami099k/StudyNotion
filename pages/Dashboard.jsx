import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ClipLoader } from 'react-spinners';
import SideBar from '../components/common/SideBar';
import { Outlet } from 'react-router-dom';
import { setCourse } from '../slices/courseSlice';

const Dashboard = () => {
    const { loading: authLoading ,token} = useSelector((state) => state.auth);
    const { loading: profileLoading, user } = useSelector((state) => state.profile);
    const dispatch = useDispatch();

    console.log('Dashboard - token:', token);
    console.log('Dashboard - user:', user);
    console.log('Dashboard - authLoading:', authLoading);
    console.log('Dashboard - profileLoading:', profileLoading);

    useEffect(()=>{
        if(!token){
            dispatch(setCourse(null));
        }
    },[])

    if (authLoading || profileLoading) {
        return (
            <div className='grid min-h-[calc(100vh-3.5rem)] place-items-center'>
                <ClipLoader color='#FFD60A' />
            </div>
        )
    }

    return (
        <div className='relative flex min-h-[calc(100vh-3.5rem)] bg-[#000814] w-[100vw]'>
            <SideBar />
            <div className='h-[calc(100vh-3.5rem)] flex-1 overflow-auto'>
                <div className='mx-auto w-11/12 max-w-[1000px] py-10'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Dashboard