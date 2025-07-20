
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ClipLoader } from 'react-spinners';
import Input from '../components/login/Input';
import Button1 from '../components/homepage/Button1';
import { Link, useLocation } from 'react-router-dom';
import { BiArrowBack } from 'react-icons/bi';
import toast from 'react-hot-toast';
import { resetPassword } from '../services/authAPIs';

const UpdatePassword = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const [formData,setFormData] = useState({
        newPassword:'',
        confirmNewPassword:''
    });
    const handleChange = (value,name)=>{
        setFormData((prev)=>({
            ...prev,[name]:value
        }));
    }
    const handleClick = ()=>{
        if(!formData.newPassword || formData.newPassword!==formData.confirmNewPassword){
            return toast.error('Passwords do not match, try again!');
        }
        const token = location.pathname.split('/').at(-1);
        dispatch(resetPassword(formData.newPassword,formData.confirmNewPassword,token));
    }
    const loading = useSelector((state)=>state.auth.loading);
  return (
    <div>
        {
            loading ? (<div><ClipLoader color='#e0e0e0'/></div>) :
            (
                <div className='mt-20 flex flex-col gap-5'>
                    <div className='text-3xl' >Choose New Password</div>
                    <div className='text-[#AFB2BF]'>Almost done. Enter your new password and youre all set.</div>
                    <div className='flex flex-col gap-3'>
                        <Input  type='New password' name='newPassword' value={formData.newPassword} setValue={handleChange}/>
                        <Input type='Confirm new password' name='confirmNewPassword' value={formData.confirmNewPassword} setValue={handleChange}/>
                    </div>
                    <div className='mt-3' onClick={()=>{handleClick()}}>
                        <Button1 width='true'>Submit</Button1>
                    </div>
                    <div className='mt-1'>
                        <Link to='/login'> <div className='text-[#F1F2FF] flex items-center gap-1'><BiArrowBack/>  Back to Login</div></Link>
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default UpdatePassword