import axios from 'axios'
import React from 'react'

export const Test = () => {
    const handleClick = async()=>{
        try {
            const response = await axios.get('https://api.ipify.org/?format=json', {
                withCredentials: false
            });
            const {data} = response;
            console.log(data);
            console.log(data.ip)
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <>
    <div className="test">
        <h1>Test Page</h1>
        <button onClick={handleClick}>Click</button>
    </div>
    </>
  )
}
