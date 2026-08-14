import axios from 'axios';
import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthProvider';
import '../../styles/pages/login.css';
import { FaEyeSlash } from "react-icons/fa";
export const Login = () => {
    const [loading,setloading] = useState(false);
    const [email,setemail] = useState("");
    const [pass,setpass] = useState("");
    const [err,seterr] = useState("");
    const [success,setsuccess] = useState("");
    const [showPass, setShowPass] = useState(false);
    const navigate = useNavigate();
    const {login} = useAuth();

    const handlesubmit = async (e)=>{
        e.preventDefault();
        setloading(true);
        seterr("");
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/login`,{
                email: email,
                pass: pass
            },{withCredentials: true})
            const {data} = response;
            if(data.success){
                localStorage.setItem("email", email);
                localStorage.setItem("name", data.first_name);
                login(data.accessToken , data.member_role , data.id);
                setsuccess(data.message);
                setTimeout(() => {
                    navigate('/');
                }, 1000);
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
    <div className="loginpage">
        <form onSubmit={handlesubmit}>
            <h1 className='titleofform'>Login</h1>
            {err && <div className='errdiv'><p style={{color:""}}>{err}</p></div>}
            {success && <div className='successdiv'><p style={{color: 'green'}} >{success}</p></div>}
            <input type="email" required placeholder='Email' value={email} disabled={loading} onChange={(e)=>{setemail(e.target.value)}} />
            <div className="passdiv">
                <input type={showPass?"text":"password"} className='password' required placeholder='Password' value={pass} disabled={loading} onChange={(e)=>{setpass(e.target.value)}} />
                <span><FaEyeSlash className='eye' style={showPass?{color:'#50624e'}:{color:'gray'}} onClick={(e)=>{e.stopPropagation(); setShowPass(!showPass)}}/></span>
            </div>
            <button type="submit" disabled={loading}>{loading ? "..." : "submit"}</button>
            <br />
            <p className='question' onClick={()=>{navigate('/signup')}}>don't have account?</p>
            <p className='question' onClick={()=>{navigate('/forget-password')}}>Forget Password</p>
            <p className='terms' style={{color:"grey"}}>By joining, you agree to the Nesty Terms of Service and to occasionally receive emails from us. Please read our Privacy Policy to learn how we use your personal data.</p>
        </form>
    </div>
    </>
  )
}
