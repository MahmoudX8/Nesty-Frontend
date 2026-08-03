import { Outlet } from 'react-router-dom'
import { AuthProvider } from '../AuthProvider'
import { CartProvider } from '../CartContext'
import { OrderProvider } from '../OrderContext'
export const RootLayout = () => {
  return( 
    <AuthProvider>
      <CartProvider>
        {/* <OrderProvider>
        </OrderProvider> */}
          <Outlet />
      </CartProvider>
    </AuthProvider>
)
}
