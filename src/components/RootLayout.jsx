import { Outlet } from 'react-router-dom'
import { AuthProvider } from '../AuthProvider'
import { CartProvider } from '../CartContext'
export const RootLayout = () => {
  return( 
    <AuthProvider>
      <CartProvider>
          <Outlet />
      </CartProvider>
    </AuthProvider>
)
}
