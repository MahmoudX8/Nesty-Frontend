import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import '../styles/pages/products.css'
import { useCart } from '../CartContext';
import { MdAddShoppingCart } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import { FaCartPlus } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import '../styles/components/loading.css';
import { VscLoading } from "react-icons/vsc";
export const Explore = () => {
    const [products,setProducts] = useState([]);
    const [query,setQuery] = useState("");
    const [loading,setLoading] = useState(false);
    const {memberRole , isAuthenticated} = useAuth();
    const {addToCart, cartCount} = useCart();
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 6;
    const navigate = useNavigate();
        // Pagination logic
    const filteredProducts = products.filter((prod) => prod.title.toLowerCase().includes(query.toLowerCase())).slice().reverse();
    const totalPages = Math.ceil(products.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, endIndex);
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    const getproducts = async()=>{
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/products`);
            const {data} = response;
            if(data.success){
                setProducts(data.result);
            }
        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false);
        }
    }
    useEffect(()=>{
        console.log(memberRole);
        getproducts();
    },[]);
    const handleclick = ()=>{
        if(memberRole == 'admin'){
            navigate('/edit');
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
    <div className="explore">
        <h1>All Products</h1>
        <input type="search" name="" id="" placeholder='search for title of any item...' onChange={(e)=>{setQuery(e.target.value)}}/>
        {!loading && <div className='productsfield'>
            {currentProducts.map((prod)=>(
            <div className='product' key={prod.id} onClick={()=>navigate(`/products/${prod.id}`)}>
                <div className="prodphoto">
                    <img src={prod.image} alt="" />
                </div>
                <div className="productinfo" >
                    <div className="producttxt">
                        <p style={{fontWeight:'bold'}}>{prod.title}</p>
                        <p>{prod.description}</p>
                        <p style={{fontWeight:'bolder'}}>{prod.price} $</p>
                    </div>
                    <div className="productbtn">
                        {isAuthenticated && (memberRole == 'admin' ? <button style={{zIndex:99}} onClick={(e)=>{e.stopPropagation(); navigate(`/editproduct/${prod.id}`)}}><FaEdit /></button> : <button onClick={(e)=>{e.stopPropagation(); addToCart(prod)}}><FaCartPlus style={{height:"16px",width:"16px"}}/></button>)}
                    </div>
                </div>
            </div>
        ))}
       </div> 
        }
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
        {memberRole == 'user' && (<div className='carticon' onClick={()=>{navigate('/cart')}}>
            <span><FaShoppingCart style={{color:"var(--btns)",height:"25px",width:"25px"}}/><span style={{color:"var(--btns)",fontSize:"15px",fontWeight:"bold"}}>{cartCount}</span></span>
        </div>)}
    </div>}
    </>
  )
}
