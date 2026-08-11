import React from 'react'
import { useEffect } from 'react';
import { FaCheck } from "react-icons/fa";
import { useAuth } from '../AuthProvider';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/pages/successfulpayment.css';
import { PiWarningCircle } from "react-icons/pi";
import { useCart } from '../CartContext';
export const SuccessfulPayment = () => {
    const [status, setStatus] = useState('checking'); // 'checking' | 'success' | 'failed'
    const { token, loading: authLoading, isAuthenticated } = useAuth();
    const {clearCart} = useCart();
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    useEffect(()=>{
        if(authLoading) return;
        if(!token || !isAuthenticated){
            navigate('/login');
            return;
        };
        if(!sessionId){
            navigate('/*');
            return;
        };
        const verify = async()=>{
            try {
              setLoading(true);
                const res = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/payments/verify-payment`,
                    { params: { session_id: sessionId }, headers: { Authorization: `Bearer ${token}` } }
                );
                if (res.data.success) {
                    setStatus('success');
                    setMsg(res.data.message);
                    clearCart();
                    setTimeout(() => navigate('/'), 5000);
                  } else {
                    setMsg(res.data.message);
                    // console.log('there is an error')
                    setTimeout(() => navigate('/'), 3000);
                  }
                } catch (error) {
                  setMsg(error.message);
                  // console.log("Verify error:", error.response?.data || error.message);
                  setTimeout(() => navigate('/'), 3000);
            }finally{
              setLoading(false);
              setTimeout(() => {
                setMsg(null);
              }, 5000);
            }
        };
        verify();
    },[authLoading,token,isAuthenticated,sessionId]);
    if (status !== 'success') return null; // or a loading spinner
  return (
    <>
    <div className="successfulpayment">
        <div className="checkmark">
            <h1><FaCheck /></h1>
        </div>
        <div className="text">
            <h1>Successful Payment</h1>
            <p>thanks for trying our service</p>
        </div>
        {msg &&
        <div className="toastmessage">
          <div className="icon">
            <p><PiWarningCircle /></p>
          </div>
          <div className="message">
            <p>{msg}</p>
          </div>
        </div>}
    </div>
    </>
  )
}
