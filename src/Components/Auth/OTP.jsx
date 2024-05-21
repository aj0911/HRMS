import React, { useEffect, useRef, useState } from 'react'
import { Constants } from '../../Helper/Helper'
import { AiOutlineLeft } from 'react-icons/ai'
import {toast} from 'react-hot-toast'

const OTP = ({setComponent,trueOTP}) => {
    //States
    const length = 5;
    const onOtpSubmit = (combinesOtp)=>{
        if(combinesOtp===trueOTP){
            toast.success('Email Verified')
            setComponent(Constants.UPDATE_PASSWORD)
        }
        else{
            toast.error('Incorrect OTP')
        }
    };
    const [otp,setOtp] = useState(new Array(length).fill(''))
    const inputRefs = useRef([]);
    
    const handleChange = (index,e)=>{
        const value = e.target.value;
        
        if(isNaN(value))return
        if(value === '') e.target.classList.remove('active')
        else e.target.classList.add('active')
        const newOtp  = [...otp];
        newOtp[index] = value.substring(value.length-1);
        setOtp(newOtp)
        
        const combinesOtp = newOtp.join('');
        console.log(combinesOtp)
        if(combinesOtp.length === length) onOtpSubmit(combinesOtp);
        if(value && index<length-1 && inputRefs.current[index+1]){
            inputRefs.current[index+1].focus()
        }
    }
    const handleClick = (index)=>{
        inputRefs.current[index].setSelectionRange(1,1);
        if(index>0 && !otp[index-1]){
            inputRefs.current[otp.indexOf('')].focus()
        }
    }
    const handleKeyDown = (index,e)=>{
        if(e.key==='Backspace' && !otp[index] && index>0 && inputRefs.current[index-1]){
            inputRefs.current[index-1].focus()
        }
    }
    useEffect(()=>{
        if(inputRefs.current[0]){
            inputRefs.current[0].focus();
        }
    },[])

  return (
    <div className="login">
        <span onClick={()=>setComponent(Constants.FORGOT)} className="back">
            <AiOutlineLeft/>
            Back
        </span>
        <div className="head">
            <h3>Enter OTP</h3>
            <h5>We have share a code of your registered email address
            robertallen@example.com</h5>
        </div>
        <form onSubmit={(e)=>{e.preventDefault();onOtpSubmit();}}>
            <div className="otpControl">
                {
                    otp.map((value,index)=>(
                        <input key={index} type='text' ref={input=>inputRefs.current[index]=input} value={value} onChange={(e)=>handleChange(index,e)} onClick={()=>handleClick(index)} onKeyDown={(e)=>handleKeyDown(index,e)}/>
                    ))
                }
            </div>
            {
                <input type="submit" value="Verify" />
            }
        </form>
    </div>
  )
}

export default OTP