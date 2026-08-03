import React, { useEffect, useState } from 'react'
import { useAuth } from '../../AuthProvider';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/updateprofile.css'
export const UpdateProfile = () => {
    const[loading,setloading] = useState(false);
    const[info,setinfo]= useState({fname:'',lname:'',email:'',role:''});
    const[inputData,setInputData] = useState({fname:'',lname:'',pass:''});
    const [msg,setMsg] = useState('');
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
                    setMsg('You should input at least one field');
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
                    setTimeout(() => {
                        navigate('/verify-otp/profile');
                    }, 1000);
                }else{
                    setMsg(data.message);
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
            {!loading && <p style={{color:'var(--text)'}}>{msg}</p>}
            <p>Email can't be changed</p>
            <input type="email" value={info.email} disabled readOnly style={{border:'solid grey 1px'}}/>
            <input type="text" placeholder="New first name" value={inputData.fname} onChange={(e)=>{setInputData(prev => ({...prev, fname:e.target.value}))}}/>
            <input type="text" placeholder="New last name" value={inputData.lname} onChange={(e)=>{setInputData(prev => ({...prev,lname: e.target.value}))}}/>
            <input type="password" placeholder="New password" value={inputData.pass} onChange={(e)=>{setInputData(prev => ({...prev,pass: e.target.value}))}}/>
            <button type='submit' disabled={loading}>{loading? '...':'Update'}</button>
            {/* <h1>{info.email}</h1>
            <h1>{info.fname}</h1> */}
        </form>
    </div>
    </>
  )
}
