import React, { useState } from 'react'
import ResetPass from '../components/forgotpass/ResetPass'
import EmailSent from '../components/forgotpass/EmailSent'
import { useSelector } from 'react-redux';
import { ClipLoader } from 'react-spinners';

const ForgotPassword = () => {
    const [emailSent,setEmailSent] = useState(false);
    const [email,setEmail] = useState('');
    const {loading} = useSelector((state)=>state.auth)
  return (
    <div>
        {
           loading ? (<div className='w-[100%] h-[100%] flex items-center justify-center mt-60'><ClipLoader color='#e0e0e0'/></div>) : (<div>{
             emailSent ? (<EmailSent email={email} />) : (<ResetPass email={email} setEmail={setEmail} emailSent={emailSent} set={setEmailSent}/>)
           }</div>)
        }

    </div>
  )
}

export default ForgotPassword