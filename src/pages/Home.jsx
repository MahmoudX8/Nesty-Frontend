import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import '../styles/pages/home.css'
import { useCart } from '../CartContext';
import bg from '../assets/nestly-home-page-bg.jpg';
import {MdOutlineAccountCircle, MdLogin}  from "react-icons/md";
import { FaShoppingCart , FaGithub , FaLinkedin, FaArrowRight} from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";
import { BiLogoGmail } from "react-icons/bi";
import { IoAdd } from "react-icons/io5";
export const Home = () => {
    // test
    // const arr = [{title: 'product 1' , desc: 'slkn glfg dfkgld fgldk', price: 34},{title: 'product 2' , desc: 'slkn glfg dfkgld fgldk', price: 58}];
    const [err,seterr] = useState('');
    const [loading,setloading] = useState(false);
    const [products,setproducts] = useState([]);
    const [numproducts,setnumproducts] = useState();
    const [numusers,setnumusers] = useState();
    const [numpurchases,setnumpurchases] = useState();
    const [pendingorders,setPendingOrders] = useState();
    const navigate = useNavigate();
    const {token , memberRole} = useAuth();
    const {cartTotal , cartCount} = useCart();
    const fetchProducts = async()=>{
    try {
        setloading(true);
        seterr('');
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/`);
        const {data} = response;
        if(data.success){
            // console.log(data.success);
            // console.log(data.result);
            setproducts(data.result);
        }
    } catch (error) {
        console.log(error);
        seterr(error.message);
    }finally{
        setloading(false);
    }}
    const productStats = async()=>{
        try {
            setloading(true);
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/products/stats`);
            const {data} = response;
            if(data.success){
                setnumusers(data.result.total_users);
                setnumproducts(data.result.total_products);
                setnumpurchases(data.result.total_purchases);
                setPendingOrders(data.result.total_pending_orders);
            }
        } catch (error) {
            
        }finally{
            setloading(false);
        }
    }
    useEffect( ()=>{
        fetchProducts();
        productStats();
    },[]);
  return (
    <>
    <div className='homepage'>
    {/* section 1 */}
    <div className='navbar'>
            <h1>Nesty</h1>
            <div className="middlenav">
                <li><a href="#topproducts">Top</a></li>
                <li><a href="#stats">Stats</a></li>
                <li><a href="#about">About</a></li>
            </div>
            <div className="leftnav">
                {token && memberRole == 'user' && <li onClick={()=>{navigate('/cart')}} style={{}}><FaShoppingCart id='icon' className='carticon' style={{height:'20px',width:'20px',paddingTop:"3px"}}/><span className='cartcount' style={{paddingLeft:"1px"}}> {cartCount}</span></li>}
                {token && memberRole == 'admin' && <li onClick={()=>{navigate('/orders')}} style={{}}><IoMdNotifications id='icon' className='carticon' style={{height:'25px',width:'25px'}}/><span className='cartcount' style={{}}>{pendingorders}</span></li>}
                {token && memberRole == 'admin' && <li onClick={()=>{navigate('/addproduct')}}><IoAdd id='icon' style={{height:'25px',width:'25px'}}/></li>}
                {!token && <li onClick={()=>{navigate('/login')}}><MdLogin id='icon' style={{width:"25px",height:"25px"}}/></li>}
                {token && <li onClick={()=>{navigate('/profile')}}><MdOutlineAccountCircle id='icon' style={{width:"25px",height:"25px"}}/></li>}
                {/* {token && <li onClick={()=>{navigate('/profile')}}></li>} */}
            </div>
    </div>
    {/* section 2 */}
    <div className='homecontent'>
        <div className="subtitle">
            <h1>Nesty, Simple spaces <span style={{color:'var(--primary)'}}>&</span> well lived<span style={{color:'var(--primary)'}}>.</span></h1>
            <div className="browsebtn">
                <button onClick={()=>{navigate('/products')}} disabled={loading}>Browse <span><FaArrowRight /></span></button>

            </div>
        </div>
        <div className="homephoto">
            <img src={bg} alt="photo" />
        </div>
    </div>
    {/* section 3 */}
    <div className="topproducts" id='topproducts'>
        <h1><span style={{color:'var(--primary)'}}>Top</span> Products</h1>
        {!loading && <div className='productslider'>
            {products.map((prod)=>(
                <div key={prod.id} className='product-card' onClick={()=>{navigate(`/products/${prod.id}`)}}>
                    <img src={prod.image} alt="photo" />
                    <div className='product-info'>
                    <h4>{prod.title}</h4>
                    <p>{prod.description}</p>
                    <p style={{marginTop:'1rem',fontWeight:'bolder'}}>{prod.price} $</p>
                    </div>
                </div>
            ))}
            <div className='product-card' id='seemore'
             onClick={()=>navigate('/products')}> <p style={{justifySelf:'center'}}>See more</p></div>
        </div>
        }   
    </div>
    <hr />
    {/* section 4 */}
    <div className="numbers" id='stats'>
        <div className="numusers">
            <h1>Users</h1>
            <p><span style={{    color: 'var(--btns)'}}>+</span>{numusers}</p>
        </div>
        <div className="numproducts">
            <h1>Products</h1>
            <p><span style={{    color: 'var(--btns)'}}>+</span>{numproducts}</p>
        </div>
        <div className="numpurchases">
            <h1>Orders</h1>
            <p><span style={{    color: 'var(--btns)'}}>+</span>{numpurchases}</p>
        </div>
    </div>
    <hr />
    {/* section 5 */}
    <div className="about" id='about'>
        <h1>About Us</h1>
        <p>At Nestly, we believe home isn't just a place. It's a feeling you build, piece by piece. We started this journey with a simple idea: everyday living deserves thoughtful design, without unnecessary clutter or noise. Every product in our collection is chosen with intention. Clean lines, honest materials, and a quiet kind of beauty that fits effortlessly into modern life. Whether you're furnishing your first apartment or reimagining a space you've lived in for years, Nestly is here to help you create rooms that feel calm, considered, and unmistakably yours. We're not just selling home goods. We're helping you build a nest worth coming home to.</p>
    </div>
    {/* section 6 */}
    <div className="footer">
        <div className="developer">
        <p>©developed & designed by Mahmoud Alaa </p>
        </div>
        <div className="media">
        <a href="https://github.com/MahmoudX8" target="_blank"><FaGithub id='icon' style={{height:"20px",width:"20px"}}/></a>
        <a href="https://www.linkedin.com/in/mahmoud-alaa-1324b31bb/" target="_blank"><FaLinkedin id='icon' style={{height:"20px",width:"20px"}}/></a>
        <a href="mailto:mahmoudaalaa68@gmail.com" target="_blank"><BiLogoGmail id='icon' style={{height:"20px",width:"20px"}}/></a>
        </div>
    </div>
    </div>
    {/* {loading && <div><p>loading...</p></div>}
    {err && <p>{err}</p>} */}
    </>
  )
}
