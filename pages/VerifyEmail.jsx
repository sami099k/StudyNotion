import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ClipLoader } from 'react-spinners';
import Button1 from '../components/homepage/Button1';
import { Link, useNavigate } from 'react-router-dom';
import { BiArrowBack } from 'react-icons/bi';
import { FaClockRotateLeft } from "react-icons/fa6";
import OTPInput from 'react-otp-input';
import { sendOTP, signUP } from '../services/authAPIs';

const VerifyEmail = () => {
    

     let {signupData,loading} = useSelector((state)=>state.auth);
     const [otp,setotp]= useState('');
     const dispatch = useDispatch();
     const navigate = useNavigate();

     useEffect(()=>{
        if(!signupData){
            navigate('/signup')
        }
     },[])

     const handleSubmit = (e)=>{
        const {firstName,lastName,password,confirmPassword,email,accountType,phNo} = signupData;
        dispatch(signUP(firstName,lastName,password,confirmPassword,email,accountType,phNo,otp,navigate));
     }
    
  return (
    <div className='h-[90vh] w-[100%] flex items-center justify-center'>
        {
            loading ? 
            (<div className='w-[100%] h-[100%] flex items-center justify-center'>
                <ClipLoader color='#e0e0e0'/>
            </div>) : 
            (
            <div className='flex flex-col padding-5 gap-3'>
                <div className='text-3xl font-semibold'>Verify Email</div>
                <div className='text-[#AFB2BF] mb-10'>A verification code has been sent to you. Enter the code below</div>
                <div className='flex items-center justify-center gap-4 max-w-screen md:max-w-2xl md:w-[100%] p-4'>
                    <OTPInput
                        value={otp}
                        onChange={setotp}
                        numInputs={6}
                        renderSeparator={<span className='w-5'></span>}
                        inputStyle={{
                            width:'4vw',
                            borderRadius:'5px'
                        }}
                        renderInput={(props)=><input {...props} placeholder='-' className='bg-[#161D29] h-13 w-20 max-w-2xs md:max-w-2xl'/>}
                    />
                </div>
                <div className='mt-10' onClick={(e)=>handleSubmit(e)}>
                    <Button1 width = 'true'> Verify and Register</Button1>
                </div>
                <div className='w-[100%] flex justify-between p-1'>
                    <div><Link to='/login'> <div className='text-[#F1F2FF] flex items-center gap-1'><BiArrowBack/>  Back to Login</div></Link></div>
                    <div className='flex items-center gap-1 text-[#47A5C5] cursor-pointer' 
                    onClick={
                        ()=>{ dispatch(sendOTP(signupData.email,navigate))}} ><FaClockRotateLeft/> Resend it</div>
                </div>

            </div>
            )
        }
    </div>
  )
}

export default VerifyEmail