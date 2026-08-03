import React, { useEffect, useState } from 'react'
import { useCart } from '../CartContext'
import '../styles/pages/cart.css'
import { useAuth } from '../AuthProvider';
import { useNavigate } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import axios from 'axios';
export const Cart = () => {
    const {cart, removeFromCart, cartTotal, cartCount, updateQuantity, clearCart} = useCart();
    const {token, isAuthenticated, loading:authLoading , memberRole, roleloading} = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const numberPerPage = 4;
    const totalPages = Math.ceil(cart.length / numberPerPage);
    const startIndex = (currentPage - 1) * numberPerPage;
    const endIndex = startIndex + numberPerPage;
    const selectedProducts = cart.slice(startIndex,endIndex);
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    const navigate = useNavigate();
    useEffect(()=>{
        if(authLoading || roleloading) return;
        const checkRole = memberRole;
        if(!token || !isAuthenticated){
            navigate('/login');
            return;
        }
        if(checkRole == 'admin'){
            navigate('/*');
            return;
        }
    },[token,isAuthenticated,authLoading,roleloading,memberRole]);
    const handlepurchase = async(e)=>{
        e.preventDefault();
        try {
            setLoading(true);
            if(cart.length==0){
                setMsg('You did not pick any thing');
                return;
            } 
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/payments/create-order`,{cartproducts:cart, cost:cartTotal},{withCredentials:true,headers:{
                'Authorization': `Bearer ${token}`
            }});
            const {data} = response;
            if(data.success){
                setMsg(data.message);
                clearCart();
                setTimeout(() => {
                    navigate('/');
                }, 1000);
            }
        } catch (error) {
            setMsg(error.message);
            console.log(error.message);
        }finally{
            setLoading(false);
        }
    }; 
  return (
    <>
    <div className="cartpage">
        <div className="cartproducts">
            {cart.length == 0 && <p>There is no product in cart yet.</p>}
            {!loading && <p>{msg}</p>}
            {selectedProducts.map((prod)=>(
                <div key={prod.id} className='product'>
                    <div className="prodimg">
                        <img src={prod.image} alt="photo" />
                    </div>
                    <div className="prodinfo">
                        <h1 className='title'>{prod.title}</h1>
                        <p className='desc'>{prod.description}</p>
                        <div className="pricing">
                            <p>{prod.price} $</p>
                        </div>
                    </div>
                    <div className="prodbtns">
                        <div className="quantitycontrol">
                            <button
                                onClick={() => updateQuantity(prod.id, prod.quantity - 1)}
                                disabled={prod.quantity <= 1}
                            >
                                -
                            </button>
                            <span>{prod.quantity}</span>
                            <button onClick={() => updateQuantity(prod.id, prod.quantity + 1)}>
                                +
                            </button>
                        </div>
                        <div className="removebtndiv">
                            <button className='removebtn' onClick={()=>{removeFromCart(prod.id)}}><MdDeleteForever /></button>
                        </div>
                    </div>
                </div>
            ))}
        {/* Pagination Controls */}
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
        <div className="cartdetails">
            <h1>Cart Details</h1>
            <p>Quantity {cartCount}</p>
            <p>Total {cartTotal}$</p>
            <button onClick={handlepurchase} disabled={loading}>{!loading? 'Purchase': '...'}</button>
        </div>
    </div>
    </>
  )
}
