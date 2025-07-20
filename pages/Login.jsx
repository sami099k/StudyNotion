
import React, { useState } from 'react'
import Input from '../components/login/Input'
import Button1 from '../components/homepage/Button1'
import Image from '../Images/login.webp'
import Frame from '../Images/frame.png'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { ClipLoader } from 'react-spinners'
import { login } from '../services/authAPIs'

const Login = () => {
    const [form,setForm] = useState({
        email:'',
        password:''
    });

    const changeHandler = (value,name)=>{
        setForm({...form,[name]:value});
    }

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {loading} = useSelector((state)=>state.auth);
    const handleSubmit = ()=>{
        if(!form.email || !form.password){
            toast.error('All fields are required');
            return ;
        }
        dispatch(login(form.email,form.password,navigate));
    }

    return (
        <div className='flex flex-col-reverse items-center justify-between p-5 mt-3 md:flex-row w-[85%]'>
           {
                loading ? (<div className='w-[100vw] h-[80vh] flex items-center justify-center'><ClipLoader color='#e0e0e0'/></div>) :( <><div className='flex flex-col items-center justify-center  gap-5 w-[35%] md:items-start'>
                    <div className='text-[#f1f2ff] font-semibold text-3xl'>Welcome Back</div>
                    <div className='text-[#b0b2bf] text-lg flex flex-col'>
                        Build skills for today, tomorrow, and beyond.
                        <i className='text-[#48a5c5] font-semibold '>Education to future-proof your career.</i>
                    </div>
                    <div className='w-[100%] flex flex-col gap-5'>
                        <Input type='Email Address' name='email' value={form.email} setValue={changeHandler} />
                        <Input type='Password' 
                        onKeyDown = {(e)=>{
                            console.log('hello')
                            if(e.code === 'Enter' || e.code ==='NumpadEnter'){
                                e.preventDefault();
                                handleSubmit();
                            }
                            }} 
                            name='password' text='password' value={form.password} setValue={changeHandler} />
                        <div className='w-[100%] flex items-center justify-center'>
                            <Link to='/forgotPassword'>
                                <p className='text-center  mt-3 text-[#48a5c5] cursor-pointer transition-all hover:text-[#5a8c9d]'> Forgot Password? </p>
                            </Link>
                        </div>
                    </div>
                    <div className='w-[100%]' onClick={handleSubmit}>
                        <Button1 width='true'>Sign In</Button1>
                    </div>
                    <div className='w-[100%] flex items-center justify-center'>
                        <Link to='/signup'>  <p className='text-center  mt-3 text-[#48a5c5] cursor-pointer transition-all hover:text-[#5a8c9d]'> Dont have an account? </p></Link>
                    </div>
                </div><div>
                        <img src={Image} alt="" />
                    </div></>)
           }
        </div>
    )
}

export default Login