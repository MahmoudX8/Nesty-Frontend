import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import { useEffect } from 'react';
import '../styles/pages/detailedorder.css'
export const DetailedOrder = () => {
    const {token, isAuthenticated, loading:authloading, member_role, roleloading} = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const [payments, setPayments]= useState([]);
    const {id} = useParams();
    const [currentPage,setCurrentPage] = useState(1);
    const ordersperpage = 8;
    const totalPages = Math.ceil(payments.length/ordersperpage);
    const startIndex = (currentPage-1) * ordersperpage;
    const endIndex = startIndex + ordersperpage;
    const detailedOrder = payments.slice(startIndex, endIndex);
    const goToPage = (page)=>{
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
     };
     useEffect(()=>{
        if (authloading || roleloading) return;
        if(!isAuthenticated ||!token){
            navigate('/login');
            return;
        }if(member_role == 'user'){
            navigate('/*');
            return;
        }
        getDetailedOrder();
     },[authloading,roleloading,isAuthenticated, member_role,token]);
    const getDetailedOrder = async()=>{
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/payments/${id}`,{withCredentials:true, headers:{'Authorization': `Bearer ${token}`}});
            const {data} = response;
            if (data.ok) {
                setPayments(data.detailedOrder);
            }else{
                setMsg(data.msg);
            }
        } catch (error) {
            setMsg(error.msg);
        }finally{
            setLoading(false);
        }
     }
  return (
    <>
    <div className="detailedorderpage">
        <div className="title">
            <h1>Detailed Order</h1>
        </div>
        <div className="ordersection">
            {payments && detailedOrder.map((order)=>(
                <div className='order'>
                    <img src={order.image} alt="photo" />
                    <p>Title: <span>{order.product_title}</span></p>
                    <p>Quantity: <span>{order.quantity}</span></p>
                    <p>price: <span>{order.price}</span></p>
                </div>
            ))}
        </div>
        {totalPages > 1 && (
                    <div className="pagination-controls">
                        <button 
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="pagination-arrow"
                        >
                            ◀
                        </button>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => goToPage(page)}
                                className={currentPage === page ? 'active' : ''}
                            >
                                {page}
                            </button>
                        ))}
                        
                        <button 
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="pagination-arrow"
                        >
                            ▶
                        </button>
                    </div>
        )}
    </div>
    </>
  )
}
