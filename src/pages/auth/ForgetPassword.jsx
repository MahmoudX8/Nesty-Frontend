import React from 'react'
import axios from 'axios';
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthProvider';
import '../../styles/pages/forget.css'

export const ForgetPassword = () => {
    const [loading,setloading] = useState(false);
    const [email,setemail] = useState("");
    const [err,seterr] = useState("");
    const [success,setsuccess] = useState("");
    const navigate = useNavigate();

    const handlesubmit = async (e)=>{
        e.preventDefault();
        setloading(true);
        seterr("");
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/forgetpassword`,{
                email: email
            },{withCredentials: true})
            const {data} = response;
            if(data.success){
                localStorage.setItem("email", data.email);
                setsuccess(data.message);
                setTimeout(() => {
                    navigate('/verify-otp/change-password');
                    return;
                }, 1000);
            }else{
                seterr(data.message);
            }
        } catch (error) {
            console.log(error);
             if (error.response) {
                seterr(error.response.data?.message || `Error: ${error.response.status}`);
            } else if (error.request) {
                seterr('No response from server. Please check your connection.');
            } else {
                seterr('An unexpected error occurred.');
            }
        }finally{
            setloading(false);
        }
    }
  return (
    <>
    <div className="forgetpage">
        <form onSubmit={handlesubmit}>
            <h1 className='titleofform'>Forget Password</h1>
            {err && <p style={{color:"red"}}>{err}</p>}
            {success && <p style={{color: 'green'}} >{success}</p>}
            <input type="email" required placeholder='Email' value={email} disabled={loading} onChange={(e)=>{setemail(e.target.value)}} />
            <button type="submit">{loading ? "..." : "submit"}</button>
            <br />
            <p className='terms' style={{color:"grey"}}>Enter your email and receive code.</p>
        </form>
    </div>
    </>
  )
}
