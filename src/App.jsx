import { createContext, useState } from 'react'
import './App.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { RootLayout } from './components/RootLayout'
import { Home } from './pages/Home'
import { Login } from './pages/auth/login'
import { Signup } from './pages/auth/Signup'
import { Profile } from './pages/Profile'
import { AuthProvider, useAuth } from './AuthProvider'
import { UpdateProfile } from './pages/auth/UpdateProfile'
import { Explore } from './pages/Explore'
import { Product } from './pages/Product'
import { EditProduct } from './pages/EditProduct'
import { AddProduct } from './pages/AddProduct'
import { Test } from './pages/Test'
import { NotFound } from './pages/NotFound'
import { CartProvider } from './CartContext'
import { Cart } from './pages/Cart'
import { SignupOtpVerify } from './pages/auth/SignupOtpVerify'
import { ProfileOtpVerify } from './pages/auth/profileOtpVerify'
import { ForgetPassword } from './pages/auth/ForgetPassword'
import { ChangePassword } from './pages/auth/ChangePassword'
import { ForgetPasswordOtpVerify } from './pages/auth/ForgetPasswordOtpVerify'
import { OrderProvider } from './OrderContext'
import { Orders } from './pages/Orders'
import { DetailedOrder } from './pages/DetailedOrder'


function App() {
  const router = createBrowserRouter(createRoutesFromElements(
    <Route path='/' element={<RootLayout />}>
      <Route index element={<Home/>}/>
      <Route path='/login' element={<Login />}/>
      <Route path='/signup' element={<Signup />}/>
      <Route path='/forget-password' element={<ForgetPassword />}/>
      <Route path='/verify-otp/change-password' element={<ForgetPasswordOtpVerify />}/>
      <Route path='/change-password' element={<ChangePassword />}/>
      <Route path='/verify-otp/signup' element={<SignupOtpVerify />}/>
      <Route path='/profile' element={<Profile />}/>
      <Route path='/verify-otp/profile' element={<ProfileOtpVerify />}/>
      <Route path='/updateprofile' element={<UpdateProfile />}/>
      <Route path='/products/:id' element={<Product />}/>
      <Route path='/products' element={<Explore />}/>
      <Route path='/addproduct' element={<AddProduct />}/>
      <Route path='/editproduct/:id' element={<EditProduct />}/>
      <Route path='/cart' element={<Cart />}/>
      <Route path='/orders' element={<Orders />}/>
      <Route path='/order/:id' element={<DetailedOrder />}/>
      <Route path='/test' element={<Test />}/>
      <Route path='*' element={<NotFound />}/>
    </Route>
  ))
  return(
        <RouterProvider router={router}/>

  )
}

export default App
