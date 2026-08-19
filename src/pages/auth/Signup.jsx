import axios from 'axios';
import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthProvider';
import '../../styles/pages/signup.css';
import { FaEyeSlash } from "react-icons/fa";
export const Signup = () => {
    const [loading,setloading] = useState(false);
    const [fname,setfname] = useState("");
    const [lname,setlname] = useState("");
    const [email,setemail] = useState("");
    const [pass,setpass] = useState("");
    const [err,seterr] = useState("");
    const [success,setsuccess] = useState("");
    const [token,settoken] = useState("");
    const [showPass, setShowPass] = useState(false);
    const navigate = useNavigate();
    const {login} = useAuth();
    const handlesubmit = async (e)=>{
        e.preventDefault();
        setloading(true);
        const trimmedFname = fname.trim();
        const trimmedLname = lname.trim();
        const trimmedEmail = email.trim();
        if (trimmedFname.includes(" ") || trimmedLname.includes(" ") || trimmedEmail.includes(" ") || pass.includes(" ")) {
            seterr("Spaces are not allowed");
            setloading(false);
            return;
        }
        const nameRegex = /^[\p{L}'-]+$/u;
        if (!nameRegex.test(trimmedFname) || !nameRegex.test(trimmedLname)) {
            seterr("Names can only contain letters");
            setloading(false);
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
            seterr("Please enter a valid email address");
            setloading(false);
            return;
        }
        const passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\W_]{8,}$/;
        if (!passRegex.test(pass)) {
            seterr("Password must be at least 8 characters and include a letter and a number");
            setloading(false);
            return;
        }
        seterr("");
        try {
            const ipResponse = await axios.get('https://api.ipify.org?format=json' ,{
                withCredentials: false
            });
            const ip = ipResponse.data.ip;

            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/signup`,{
                first_name: fname,
                last_name: lname,
                email: email,
                pass: pass,
                ip: ip
            },{withCredentials: true})
            const {data} = response;
            if(data.success){
                localStorage.setItem("email", data.email);
                localStorage.setItem("name", fname);
                setsuccess(data.message);
                setTimeout(() => {
                    navigate('/verify-otp/signup');
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
    <div className="signuppage">
        <form onSubmit={handlesubmit}>
            <h1 className='titleofform'>Signup</h1>
            {err && <div className='errdiv'><p style={{color:"rgb(255, 0, 0)"}}>{err}</p></div>}
            {success && <div className='successdiv'><p style={{color: 'green'}} >{success}</p></div>}
            <input type="text" required placeholder='First Name' value={fname} disabled={loading} onChange={(e)=>{setfname(e.target.value)}} />
            <input type="text" required placeholder='Last Name' value={lname} disabled={loading} onChange={(e)=>{setlname(e.target.value)}} />
            <input type="email" required placeholder='Email' value={email} disabled={loading} onChange={(e)=>{setemail(e.target.value)}} />
            <div className="passdiv">
                <input type={showPass?"text":"password"} className='password' required placeholder='Password' value={pass} disabled={loading} onChange={(e)=>{setpass(e.target.value)}} />
                <span><FaEyeSlash className='eye' style={showPass?{color:'#50624e'}:{color:'gray'}} onClick={(e)=>{e.stopPropagation(); setShowPass(!showPass)}}/></span>
            </div>
            <button type="submit" disabled={loading}>{loading ? "..." : "submit"}</button>
            <br />
            <p className='question' onClick={()=>{navigate('/login')}}>already have account?</p>
            <p className='terms' style={{color:"grey"}}>By joining, you agree to the Nesty Terms of Service and to occasionally receive emails from us. Please read our Privacy Policy to learn how we use your personal data.</p>
        </form>
    </div>
    </>
  )
}
