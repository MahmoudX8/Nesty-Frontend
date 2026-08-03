import React from 'react'
import '../../styles/pages/profileverify.css'
import { useState } from 'react'
import { useAuth } from '../../AuthProvider';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
export const ProfileOtpVerify = () => {
    const [loading,setLoading] = useState(false);
    const [msg,setMsg] = useState('');
    const [userOtp,setUserOtp] = useState();
    const {token, isAuthenticated, loading:authLoading} = useAuth();
    const navigate = useNavigate();
    useEffect(()=>{
        if(authLoading) return;
        if(!isAuthenticated || !token){
            navigate('/login');
            return;
        }
    },[isAuthenticated,authLoading,token]);
    const handlesubmit = async(e)=>{
        e.preventDefault();
        try {
            const email = localStorage.getItem('email');
            if(!email){
                setMsg('something wrong, please go back and update your data again');
                return;
            }
            const isNumeric = (str) => /^\d+$/.test(str);
            if(!isNumeric(userOtp)){
                setMsg('invalid code. please try again');
                return;
            }
            setLoading(true)
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/profile/verify-otp`,{email, userotp: userOtp},{withCredentials:true , headers:{'Authorization':`Bearer ${token}`}});
            const {data} = response;
            if(data.success){
                localStorage.removeItem('email');
                navigate('/profile');
            }else{
                setMsg(data.message);
                if (data.expired) {
                    setTimeout(() => {
                        navigate('/profile');
                    }, 1000);
                }
            }
        } catch (error) {
            console.log(error);   
        }finally{
            setLoading(false);
        }
    } 
  return (
    <>
    <div className="profileotp">
        <div className="txt" style={{textAlign:'center'}}>
            <h1>Verify Updates</h1>
            {!loading && <p>{msg}</p>}
        </div>
        <div className="codeArea">
            <form action="" onSubmit={handlesubmit}>
                <input type="text" name="" id="" value={userOtp} onChange={(e)=>{setUserOtp(e.target.value)}} disabled={loading} required/>
                <button disabled={loading} type='submit'>{loading?'...':'Submit'}</button>
                <p style={{color:'grey',fontFamily:'Lucida Sans, Lucida Sans Regular, Lucida Grande, Lucida Sans Unicode, Geneva, Verdana, sans-serif'}}>check your email to get verification code</p>
            </form>
        </div>
    </div>
    </>
  )
}
