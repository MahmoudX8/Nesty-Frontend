import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const OrderContext = createContext();
export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
    const { memberRole, isAuthenticated, loading: authLoading, roleloading } = useAuth();
    const navigate = useNavigate();

    const isAuthorized = isAuthenticated && memberRole === "admin";

    const [orders, setOrders] = useState(() => {
        try {
            const store = localStorage.getItem("orders");
            return store ? JSON.parse(store) : [];
        } catch (error) {
            console.log(error);
            return [];
        }
    });

    // Auth/role guard — redirect and stop here if unauthorized
    // useEffect(() => {
    //     if (authLoading || roleloading) return;
    //     if (!isAuthenticated) {
    //         navigate("/login");
    //         return;
    //     }
    //     if (memberRole !== "admin") {
    //         navigate("/*");
    //         return;
    //     }
    // }, [authLoading, roleloading, isAuthenticated, memberRole, navigate]);

    // Persist orders — only if authorized, so localStorage never gets touched otherwise
    // useEffect(() => {
    //     if (authLoading || roleloading || !isAuthorized) return;
    //     localStorage.setItem("orders", JSON.stringify(orders));
    // }, [orders, authLoading, roleloading, isAuthorized]);
    useEffect(() => {
        localStorage.setItem("orders", JSON.stringify(orders));
    }, []);

    const addToOrders = (product, qty = 1) => {
        if (!isAuthorized) return;
        setOrders((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + qty }
                        : item
                );
            }
            const { id, title, image, description, price } = product;
            return [...prev, { id, title, image, description, price, quantity: qty }];
        });
    };

    const removeFromOrders = (productId) => {
        if (!isAuthorized) return;
        setOrders((prev) => prev.filter((item) => item.id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (!isAuthorized) return;
        if (quantity <= 0) {
            removeFromOrders(productId);
            return;
        }
        setOrders((prev) =>
            prev.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearOrders = () => {
        if (!isAuthorized) return;
        setOrders([]);
    };

    const orderTotal = orders.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderCount = orders.reduce((sum, item) => sum + item.quantity, 0);

    // Don't render provider children at all until auth state is resolved
    if (authLoading || roleloading) return null;

    // Not authorized — redirect effect above handles navigation; render nothing here
    if (!isAuthorized) return null;

    return (
        <OrderContext.Provider value={{ orders, addToOrders, removeFromOrders, updateQuantity, clearOrders, orderTotal, orderCount }}>
            {children}
        </OrderContext.Provider>
    );
};