import React from 'react';
import '../styles/pages/notfound.css';
import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
export const NotFound = () => {
  const navigate = useNavigate();
  return (
    <>
        <div className="notfound">
          <div className="text">
              <h1>404 Page</h1>
              <h1>Not Found </h1>
          </div>
            <div className="btn">
              <button onClick={()=>{navigate('/'); return;}}>Go Back To Home <IoMdArrowRoundBack className='backarrow'/></button>
            </div>
        </div>
    </>
  )
}
