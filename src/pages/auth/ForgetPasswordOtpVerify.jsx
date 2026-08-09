import React from 'react'
import { useState } from 'react'
import '../../styles/pages/signupverify.css'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthProvider';
import axios from 'axios';
export const ForgetPasswordOtpVerify = () => {
    const [userOtp, setUserOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();
    const {login , loading: signupLoading} = useAuth();
    const handlesubmit = async (e)=>{
        e.preventDefault();
        try {
            setLoading(true);
            const email = localStorage.getItem('email');
            if(!email){
                setMsg('there is an error please go back and login again');
                return;
            }
            const isNumeric = (str) => /^\d+$/.test(str);
            if(!isNumeric(userOtp)){
                setMsg('invalid code. please try again');
                return;
            }
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/verify-otp/forgetpassword`,{email, userotp: userOtp},{withCredentials:true});
            const {data} = response;
            if(data.success){
                setMsg(data.message);
                login(data.accessToken ,data.member_role, data.id);
                setTimeout(() => {
                    navigate('/change-password');
                }, 1000);
            }else{
                setMsg(data.message);
                if(data.expired){
                    setTimeout(() => {
                        navigate('/forget-password');
                    }, 1000);
                }
            }
        } catch (error) {
            // console.log(error);
            setMsg(error.message);
        }finally{
            setLoading(false);
        }
    }
  return (
    <>
    <div className="verifyotp">
        <div className="txt" style={{textAlign:'center'}}>
            <h1>Verify Email</h1>
            {!loading && <p>{msg}</p>}
            
        </div>
        <div className="codeArea">
            <form action="" onSubmit={handlesubmit}>
                <input type="text" name="" id="" value={userOtp} onChange={(e)=>{setUserOtp(e.target.value)}} disabled={loading} required/>
                <button disabled={loading} type='submit'>{loading ? '...' : 'Submit'}</button>
                <p style={{color:'grey',fontFamily:'Lucida Sans, Lucida Sans Regular, Lucida Grande, Lucida Sans Unicode, Geneva, Verdana, sans-serif'}}>check your email to get verification code</p>
            </form>
        </div>
    </div>
    </>
  )
}
