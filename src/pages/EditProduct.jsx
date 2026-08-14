import React, { use, useEffect, useState } from 'react'
import { useAuth } from '../AuthProvider'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/pages/editproduct.css';
import { MdDeleteForever } from "react-icons/md";
import '../styles/components/loading.css';
import { VscLoading } from "react-icons/vsc";
export const EditProduct = () => {
    const {isAuthenticated , token , memberRole , loading:authLoading, roleloading} = useAuth();
    const [title, setTitle] = useState(null);
    const [description,setDescription] = useState(null);
    const [price,setPrice] = useState(null);
    const [quantity,setQuantity] = useState(null);
    const [soldout,setSoldout] = useState(false);
    const [defaultForm, setDefaultForm] = useState({});
    const [loading,setLoading] = useState(false);
    const [msg,setMsg] = useState("");
    const [toast, setToast] = useState(false);
    const {id} = useParams();
    const navigate = useNavigate();
    const getData = async()=>{
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/products/${id}`,{
                withCredentials:true,
                headers:{'Authorization': `Bearer ${token}`}
            });
            const {data} = response;
            if(data.success){
                setDefaultForm(data.result);
            }else{
                navigate('/products');
            }
        } catch (error) {
            console.log(error);
            navigate('/products');
        }finally{
            setLoading(false);
        }
    }
    const handleSubmit = async(e)=>{
        e.preventDefault();
        if(!title && !description && !price && !quantity && (soldout == false)){
            setMsg('You have to change something');
            return;
        }
        const finalTitle = title || defaultForm.title;
        const finalDescription = description || defaultForm.description;
        const finalPrice = price || defaultForm.price;
        const finalQuantity = quantity || defaultForm.quantity;
        try {
            setLoading(true);
            console.log(finalTitle, finalDescription, finalPrice, finalQuantity, soldout);
            const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/products/${id}`, {title: finalTitle, description: finalDescription, price: finalPrice, quantity: finalQuantity, soldout}, {withCredentials: true , headers:{'Authorization': `Bearer ${token}`}});
            const {data} = response;
            if(data.success){
                console.log(data.message);
                navigate('/products');
            }
        } catch (error) {
            console.log(error);
            setMsg(error);
        }finally{
            setLoading(false);
        }
    }
    const handleDeleteItem = async(e)=>{
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/products/${id}`,{withCredentials:true , headers: {'Authorization': `Bearer ${token}`}});
            const {data} = response;
            if(data.success){
                navigate('/products');
            }
        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false);
        }
    }
    useEffect(()=>{
        if(authLoading || roleloading) return;
        const checkRole = memberRole;
        if(!token || !isAuthenticated){
            navigate('/login');
            return;
        }
        if(checkRole != "admin"){
            navigate('/*');
            return;
        }
        getData();
    },[token,isAuthenticated,authLoading,memberRole,roleloading]);
  return (
    <>
    {roleloading && <div className='loadingpage'>
        <h1>Loading</h1>
        <VscLoading className='loadingicon'/>
        </div>
    }
    {!roleloading && 
    <div className="editprodpage">
        <form action="" onSubmit={handleSubmit}>
            <h1>Edit Product</h1>
            <p>{msg}</p>
            <label htmlFor="image">
                <div className="imagediv">
                {<img src={defaultForm.image} alt="Preview" className="image-preview"/>}
                <p>image can't be changed</p>
                </div>
            </label>

            <label htmlFor="title">
                <input type="text" placeholder={defaultForm.title}
                id='title' onChange={(e)=>{setTitle(e.target.value)}}/>
            </label>
            <label htmlFor="description">
                <textarea name="" id="desc" placeholder={defaultForm.description} rows={4} style={{resize:"none"}} onChange={(e)=>{setDescription(e.target.value)}}></textarea>
            </label>
            <label htmlFor="checkbox">
                <span htmlFor='check'>still available </span><input type="checkbox" checked={!soldout}
                onChange={(e)=>{setSoldout(!(e.target.checked)); console.log(!soldout)}}
                name="check" id="check" />
            </label>
            <label htmlFor="price">
                <span>Price: </span>
                <input type="number" name="price" id="price" min={0}  placeholder={defaultForm.price} onChange={(e)=>{setPrice(e.target.value)}}/>
            </label>
            {!soldout && <label htmlFor="quantity">
                <span>Quantity: </span>
                <input type="number" name="quantity" id="quantity" min={1}  placeholder={defaultForm.quantity} onChange={(e)=>{setQuantity(e.target.value)}}/>
            </label>}
            <div className="formbtns">
                <button type='submit' disabled={loading}>{!loading? 'Edit': '...'}</button>
                <button type='button' disabled={loading} onClick={()=>{setToast(true)}}>{!loading ? <MdDeleteForever style={{height:'18px',width:'18px'}}/> : '...'}</button>
            </div>
        </form>
    {toast && (<div className="toast">
        <p>This item will be deleted permanently. Are you sure?</p>
        <div className="btns">
            <button className='no' onClick={()=>{setToast(false)}} disabled={loading}>{loading ? '...' : 'No'}</button>
            <button className='yes' onClick={handleDeleteItem} disabled={loading}>{loading ? '...' : 'Yes'}</button>
        </div>
    </div>)}
    {toast && <div className='shade' onClick={()=>{setToast(false)}}></div>}
    </div>}
    </>
  )
}
