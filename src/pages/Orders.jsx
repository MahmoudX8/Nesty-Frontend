import React from 'react'
import { useAuth } from '../AuthProvider'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import '../styles/pages/orders.css';
import { FaCheck } from "react-icons/fa";
import '../styles/components/loading.css';
import { VscLoading } from "react-icons/vsc";
export const Orders = () => {
     const {token , isAuthenticated, loading:authloading, memberRole, roleloading} = useAuth();
     const [msg,setMsg] = useState('');
     const [loading,setLoading] = useState(false);
     const [orders,setOrders] = useState([]);
     const [currentPage,setCurrentPage] = useState(1);
     const navigate = useNavigate();
     const ordersperpage = 8;
     const totalPages = Math.ceil(orders.length/ordersperpage);
     const startIndex = (currentPage-1) * ordersperpage;
     const endIndex = startIndex + ordersperpage;
     const pendingorders = orders.slice(startIndex, endIndex);
     const goToPage = (page)=>{
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
     };
     const getAllOrders = async()=>{
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/payments/`,{withCredentials:true, headers:{'Authorization': `Bearer ${token}`}});
            const {data} = response;
            if (data.ok) {
                setOrders(data.pendingorders);
            } else {
                setMsg(data.msg);
            }
        } catch (error) {
            setMsg(error.msg);
        }finally{
            setLoading(false);
        }
     };
     useEffect(()=>{
        if (authloading || roleloading) return;
        if(!isAuthenticated ||!token){
            navigate('/login');
            return;
        }if(memberRole == 'user'){
            navigate('/*');
            return;
        }
        getAllOrders();
     },[authloading,roleloading,isAuthenticated, memberRole,token]);
     const handleConfirmOrder = async(id)=>{
        console.log(id)
        try {
            setLoading(true);
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/payments/confirm-order`,{id},{withCredentials:true, headers:{'Authorization': `Bearer ${token}`}});
            const {data} = response;
            if (data.ok) {
                setMsg(data.msg);
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                setMsg(data.msg);
            }
        } catch (error) {
            setMsg(error.msg)
        }finally{
            setLoading(false);
        }
     }
  return (
    <>
    {loading && <div className='loadingpage'>
        <h1>Loading</h1>
        <VscLoading className='loadingicon'/>
        </div>
    }
    {!loading &&
    <div className="orderspage">
        <div className="title">
            <h1>Orders</h1>
            {!orders && <p style={{color:'grey'}}>There is no any orders yet</p>}
            {orders && <p style={{color:'grey'}}>{msg}</p>}
        </div>
        <div className="orderssection">
            {orders && pendingorders.map((order)=>(
                <div className='order' key={order.id} onClick={()=>{navigate(`/order/${order.id}`)}}>
                    <div className="orderdata">
                        <p>Click to get details</p>
                        <p>User: <span>{order.fname} {order.lname}</span></p>
                        <p>Email: <span>{order.email}</span></p>
                        <p>Total cost: <span>{order.total_cost}$</span></p>
                        <p>Time: <span>{order.order_date.split('T')[1].split(':')[0]}:{order.order_date.split('T')[1].split(':')[1]}</span></p>
                        <p>Date: <span>{order.order_date.split('T')[0]}</span></p>
                    </div>
                    <div className="orderchecked">
                        <button onClick={(e)=>{e.stopPropagation(); handleConfirmOrder(order.id)}}>{loading? '...' : <FaCheck className='checkedicon'/>}</button>
                    </div>
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
    </div>}
    </>
  )
}
