import React from 'react'
import { useState } from 'react'
import '../../styles/pages/signupverify.css'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthProvider';
import axios from 'axios';
export const SignupOtpVerify = () => {
    const [userOtp, setUserOtp] = useState();
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
                setMsg('there is an error please go back and signup again');
                return;
            }
            const isNumeric = (str) => /^\d+$/.test(str);
            if(!isNumeric(userOtp)){
                setMsg('invalid code. please try again');
                return;
            }
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/verify-otp/signup`,{email, userotp: userOtp},{withCredentials:true});
            const {data} = response;
            if(data.success){
                setMsg(data.message);
                const firName = data.first_name;
                localStorage.setItem("name", firName);
                localStorage.removeItem("email");
                login(data.accessToken ,data.member_role, data.id);
                setTimeout(() => {
                    navigate('/');
                    window.location.reload();
                }, 1000);
            }else{
                setMsg(data.message);
                if (data.expired) {
                    setTimeout(() => {
                        navigate('/signup');
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
    <div className="verifyotp">
        <div className="txt" style={{textAlign:'center'}}>
            <h1>Verify Signup</h1>
            {!loading && <p>{msg}</p>}
        </div>
        <div className="codeArea">
            <form action="" onSubmit={handlesubmit}>
                <input type="text" name="" id="" value={userOtp} onChange={(e)=>{setUserOtp(e.target.value)}} disabled={loading} required/>
                <button disabled={loading} type='submit'>{loading? '...' : 'Submit'}</button>
                <p style={{color:'grey',fontFamily:'Lucida Sans, Lucida Sans Regular, Lucida Grande, Lucida Sans Unicode, Geneva, Verdana, sans-serif'}}>check your email to get verification code</p>
            </form>
        </div>
    </div>
    </>
  )
}
