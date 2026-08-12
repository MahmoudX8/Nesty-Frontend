import React, { useEffect, useState } from 'react'
import { useAuth } from '../AuthProvider'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/pages/product.css'
import { FaCartPlus } from "react-icons/fa";
import { useCart } from '../CartContext';
import '../styles/components/loading.css';
import { VscLoading } from "react-icons/vsc";

export const Product = () => {
    const {token , isAuthenticated , loading: authLoading , memberRole, roleloading} = useAuth();
    const {addToCart} = useCart();
    const [item,setItem] = useState();
    const [loading,setLoading] = useState(false);
    const {id} = useParams();
    const navigate = useNavigate();

    const getProduct = async ()=>{
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/products/${id}`,{withCredentials: true , headers:{'Authorization': `Bearer ${token}`}});
            const {data} = response;
            if(data.success){
                setItem(data.result);
            }
        } catch (error) {
            console.log(error);
            navigate('/products');
        }finally{
            setLoading(false);
        }
    }
    useEffect(()=>{
    if(authLoading || roleloading){
            return;
        }
    if (!token || !isAuthenticated) {
        navigate('/login');
        return;
    }
    getProduct();
    },[token,isAuthenticated,authLoading,roleloading])
  return (
    <>
    {loading && <div className='loadingpage'>
        <h1>Loading</h1>
        <VscLoading className='loadingicon'/>
        </div>
    }
    {!loading && 
    <div className="productpage">
        {item && <div className='product' key={item.id}>
            <div className="prodimg">
                <img src={item.image} alt="photo" />
            </div>
            <div className="prodinfo">
                <h1 className='title'>{item.title}</h1>
                <p className='desc'>{item.description}</p>
                <div className="pricing">
                    <p>{item.price} $</p>
                    {memberRole=='admin'? <button disabled={loading} onClick={()=>navigate(`/editproduct/${item.id}`)}>{loading? '...' :'edit'}</button>:<button disabled={loading} onClick={()=>{addToCart(item)}}><FaCartPlus style={{width:'20px',height:'20px'}}/></button>}
                </div>
            </div>
        </div>}
    </div>}
    </>
  )
}
