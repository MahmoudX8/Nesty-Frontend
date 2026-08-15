import React, { useEffect, useState } from 'react'
import { useAuth } from '../../AuthProvider';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/updateprofile.css';
import { FaEyeSlash } from "react-icons/fa";
export const UpdateProfile = () => {
    const[loading,setloading] = useState(false);
    const[info,setinfo]= useState({fname:'',lname:'',email:'',role:''});
    const[inputData,setInputData] = useState({fname:'',lname:'',pass:''});
    const [msg,setMsg] = useState('');
    const [errMsg,setErrMsg] = useState('');
    const [showPass, setShowPass] = useState(false);
    const navigate = useNavigate();
    const {token , isAuthenticated , loading: authLoading} = useAuth();
        const getprofile = async()=>{
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/profile`,{withCredentials: true , headers:{'Authorization':`Bearer ${token}`}});
                const {data} = response;
                if(data.success){
                setinfo({fname:data.foundUser.fname,
                        lname:data.foundUser.lname,
                        email:data.foundUser.email,
                        role:data.foundUser.member_role
                    });
                }
            } catch (error) {
                console.log(error)
            }finally{
                setloading(false);
            }
        };
        useEffect(()=>{
            if(authLoading) return;
            if(!token || !isAuthenticated){
                navigate('/login');
                // console.log("there is not token ",token)
                return;
            }
            getprofile();
        },[token , isAuthenticated, authLoading]);
        const handlesubmit = async(e)=>{
            e.preventDefault();
            try {
                setloading(true);
                if(!inputData.fname && !inputData.lname && !inputData.pass){
                    setErrMsg('You should input at least one field');
                    setMsg(null);
                    return;
                }
                const finalFname = inputData.fname || info.fname;
                const finalLname = inputData.lname || info.lname;
                const payload = {
                    first_name: finalFname,
                    last_name: finalLname,
                    email: info.email
                }
                if(inputData.pass){
                    payload.password = inputData.pass;
                }
                const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/profile`,payload,{withCredentials:true, headers:{'Authorization':`Bearer ${token}`}});
                const {data} = response;
                if (data.success) {
                    localStorage.setItem('email',info.email);
                    setMsg(data.message);
                    setErrMsg(null);
                    setTimeout(() => {
                        navigate('/verify-otp/profile');
                    }, 1000);
                }else{
                    setErrMsg(data.message);
                    setMsg(null);
                }
            } catch (error) {
                console.log(error);   
            }finally{
                setloading(false);
            }
        }
  return (
    <>
    {/* {loading && <p>Loading...</p>} */}
    <div className="updateprofile">
        <form action="" onSubmit={handlesubmit}>
            <h1>Update Your Personal Data</h1>
            {msg && <div className='successdiv'><p style={{color:'green'}}>{msg}</p></div>}
            {errMsg && <div className='errdiv'><p style={{color:"rgb(255, 0, 0)"}}>{errMsg}</p></div>}
            <p>Email can't be changed</p>
            <input type="email" value={info.email} disabled readOnly style={{border:'solid grey 1px'}}/>
            <input type="text" placeholder="New first name" value={inputData.fname} onChange={(e)=>{setInputData(prev => ({...prev, fname:e.target.value}))}}/>
            <input type="text" placeholder="New last name" value={inputData.lname} onChange={(e)=>{setInputData(prev => ({...prev,lname: e.target.value}))}}/>
            <div className="passdiv">
                <input type={showPass?"text":"password"} className='password' placeholder="New password" value={inputData.pass} onChange={(e)=>{setInputData(prev => ({...prev,pass: e.target.value}))}}/>
                <span><FaEyeSlash className='eye' style={showPass?{color:'#50624e'}:{color:'gray'}} onClick={(e)=>{e.stopPropagation(); setShowPass(!showPass)}}/></span>
            </div>
            <button type='submit' disabled={loading}>{loading? '...':'Update'}</button>
            {/* <h1>{info.email}</h1>
            <h1>{info.fname}</h1> */}
        </form>
    </div>
    </>
  )
}
