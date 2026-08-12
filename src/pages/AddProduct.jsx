import React, { useEffect, useState } from 'react'
import '../styles/pages/addproduct.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import '../styles/components/loading.css';
import { VscLoading } from "react-icons/vsc";
export const AddProduct = () => {
    const [title,setTitle] = useState('');
    const [description,setDescription] = useState('');
    const [soldout,setSoldout] = useState(true);
    const [quantity,setQuantity] = useState('');
    const [price,setPrice] = useState('');
    const [image,setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading,setLoading] = useState(false);
    const {memberRole , isAuthenticated , loading: authLoading , roleloading} = useAuth();
    const navigate = useNavigate();
    const handleChange = (e)=>{
        const {type,files} = e.target;
        if(type == 'file'){
            const file = files[0];
            if(file){
                setImage(file);
                const reader = new FileReader();
                reader.onloadend = ()=>{
                    setImagePreview(reader.result);
                };
                reader.readAsDataURL(file);
            }else{
                console.log('this is not file')
            }
        }
    }
    const handleSubmit = async(e)=>{
        e.preventDefault();
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('image', image);        // must match multer's field name
            formData.append('title', title);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('quantity', quantity);
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/products`, formData ,{withCredentials: true, headers: {'Content-Type': 'multipart/form-data', // required for file uploads
            },});
            const {data} = response;
            if(data.success){
                console.log(data.message);
                navigate('/products');
                return;
            }
        } catch (error) {
            // console.log(error)
        }finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        if(authLoading || roleloading) return;
        const checkRole = memberRole;
        if(!isAuthenticated){
            navigate('/login');
            return;
        }
        if(checkRole == 'user'){
            navigate('/*');
            return;
        }
        
    },[authLoading,isAuthenticated , memberRole])
  return (
    <>
    {loading && <div className='loadingpage'>
        <h1>Loading</h1>
        <VscLoading className='loadingicon'/>
        </div>
    }
    {!loading && 
    <div className="addproductpage">
        <form action="" onSubmit={handleSubmit}>
            <h1>Add New Product</h1>
            <label htmlFor="image">
                <div className="imagediv">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                ) : (
                  <div className="image-placeholder">
                    <p>Click to upload product image</p>
                  </div>
                )}
                <input type="file" name="image" id="imageinput"
                onChange={handleChange} required/>
                </div>
            </label>

            <label htmlFor="title">
                <input type="text" placeholder='title'
                id='title' required onChange={(e)=>{setTitle(e.target.value)}}/>
            </label>
            <label htmlFor="description">
                <textarea name="" id="desc" placeholder='description' rows={4} style={{resize:"none"}} required onChange={(e)=>{setDescription(e.target.value)}}></textarea>
            </label>
            <label htmlFor="checkbox">
                <span htmlFor='check'>still available: </span><input type="checkbox"
                onChange={(e)=>{setSoldout(!(e.target.checked))}}
                name="check" id="check" />
            </label>
            <label htmlFor="price">
                <span>Price: </span>
                <input type="number" name="price" id="price" min={0} required  placeholder='0' onChange={(e)=>{setPrice(e.target.value)}}/>
            </label>
            {!soldout && <label htmlFor="quantity">
                <span>Quantity: </span>
                <input type="number" name="quantity" id="quantity" min={1} required  placeholder='1'onChange={(e)=>{setQuantity(e.target.value)}}/>
            </label>}
            <button type='submit' disabled={loading}>{!loading? 'Post Product': '...'}</button>
        </form>
    </div>}
    </>
  )
}
