import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);
export const CartProvider = ({children}) =>{
    const [cart, setCart] = useState(()=>{
        try {
            const stored = localStorage.getItem('cart');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            // console.log(error);
            return [];
        }
    });
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);
    const addToCart = (product, qty = 1)=>{
        setCart((prev)=>{
            const existing = prev.find((item) => item.id === product.id);
            if(existing){
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + qty }
                        : item
                );
            }
            const {id,title,image,description,price} = product;
            return [...prev , {id, title, image, description, price, quantity: qty }];
        });
    };
    const removeFromCart = (productId) => {
        setCart((prev) => prev.filter((item) => item.id !== productId));
    };
    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCart((prev) =>
            prev.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };
    const clearCart = () => setCart([]);
    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount}}>
            {children}
        </CartContext.Provider>
    );
}