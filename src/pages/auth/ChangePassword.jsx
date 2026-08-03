import React, { useEffect, useState } from 'react'
import { useAuth } from '../../AuthProvider';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/pages/changepass.css'
export const ChangePassword = () => {
    const[pass,setPass] = useState('');
    const [msg,setMsg] = useState('');
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();
    const {token, isAuthenticated, loading:authLoading, logout} = useAuth();
    useEffect(()=>{
        if(authLoading) return;
        if(!token || !isAuthenticated){
            navigate('/login');
            return;
        }
    },[authLoading,token,isAuthenticated]);
    const handlesubmit = async(e)=>{
        e.preventDefault();
        try {
            setLoading(true);
            const email = localStorage.getItem('email');
            if(!email){
                setMsg('there is an error please go back and login again');
                return;
            }
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/changepassword`,{email:email ,pass: pass},{withCredentials:true,headers:{'Authorization':`Bearer ${token}`}});
            const {data} = response;
            if(data.success){
                setMsg(data.message);
                localStorage.removeItem('email');
                logout();
                setTimeout(() => {
                    navigate('/login');
                    return;
                }, 1000);
            }else{
                setMsg(data.message);
            }
        } catch (error) {
            console.log(error.message);
        } finally{
            setLoading(false);
        }
    }
  return (
    <>
    <div className="changepasspage">
        <div className="form">
            <form action="" onSubmit={handlesubmit}>
                <div className="formdata">
                    <h1>Change Your Password</h1>
                    {!loading && <p>{msg}</p>}
                </div>
                <div className="inputdiv">
                    <input type="password" required placeholder='New Password' value={pass} onChange={(e)=>{setPass(e.target.value)}}/>
                    <button type="submit" disabled={loading}>{loading?"...":"Submit"}</button>
                </div>
            </form>
        </div>
    </div>
    </>
  )
}
