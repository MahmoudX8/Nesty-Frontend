import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthProvider'
import '../styles/pages/profile.css'
import { useCart } from '../CartContext'
import { FaEdit } from "react-icons/fa";
import { IoAdd } from "react-icons/io5";
export const Profile = () => {
    const [Loading,setLoading] = useState(false);
    const [success,setsuccess] = useState("");
    const [role,setRole] = useState("");
    const [fname,setFname] = useState("");
    const [lname,setLname] = useState("");
    const [email,setEmail] = useState("");
    const [created,setCreated] = useState("");
    const [updated,setUpdated] = useState("");
    const navigate = useNavigate();
    // const {token} = useAuth();
    const {logout} = useAuth();
    // const {loading} = useAuth();
    const { token, isAuthenticated, loading: authLoading , memberRole , userId} = useAuth();
    const {clearCart} = useCart();
    const getData = async () => {
        try {
            setLoading(true);      
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/profile`, {
                withCredentials: true, headers: { 'Authorization': `Bearer ${token}`}
            });
            const { data } = response;
            if (data.success) {
                setFname(data.foundUser.fname);
                setLname(data.foundUser.lname);
                setEmail(data.foundUser.email);
                setRole(data.foundUser.member_role);
                setCreated(data.foundUser.created_at?.split('T')[0] || '');
                setUpdated(data.foundUser.modified_at?.split('T')[0] || '');
            }
        } catch (error) {
          // console.log(error)
            // if (error.response?.status === 401 || error.response?.status === 403) {
            //     setTimeout(() => {
            //         logout();
            //         navigate('/login');
            //     }, 2000);
            // } else {
            //     setError(error.response?.data?.message || "Failed to load profile");
            // }
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (authLoading) {
            return;
        }
        if (!isAuthenticated || !token) {
            navigate('/login');
            return;
        }
        getData();
    }, [token, isAuthenticated, authLoading]);

    const tologout = async ()=>{
      try {
        await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/logout`,{},{withCredentials:true});
        localStorage.clear();
      } catch (error) {
        console.log(error);
      }finally{
        logout();
        navigate('/');
        window.location.reload();
      }
    }
  return (
    <>
        <div className="profile">
          <div className="profilecard">
            {success && <p>{success}</p>}
            <div className="profileinfo">
              <h1>{fname} {lname}</h1>
              <p style={{color: 'grey'}}>{role}</p>
              <h4>{email}</h4>
              <p style={{color: 'grey'}}>Created at: {created}</p>
              {updated && <p style={{color: 'grey'}}>Modified at: {updated}</p>}
            </div>
            <div className="profileactions">
              <button className='updatedatabtn' disabled={Loading} onClick={()=>{navigate('/updateprofile')}}><FaEdit style={{height:"16px",width:"16px"}}/></button>
              {memberRole === 'admin'? <button className='addproductbtn' disabled={Loading} onClick={()=>{navigate('/addproduct')}}><IoAdd style={{height:"16px",width:"16px"}}/></button>: <></>}
              <button className='logoutbtn' disabled={Loading} onClick={()=>{tologout(); clearCart();}}>{Loading?'...':'Logout'}</button>
            </div>
            </div>
        </div>
    </>
  )
}
