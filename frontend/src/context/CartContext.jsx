import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const handleAddToCart = (event) => {
            addToCart(event.detail);
        };
        window.addEventListener('addToCart', handleAddToCart);
        return () => window.removeEventListener('addToCart', handleAddToCart);
    }, []);

    const addToCart = (item) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((cartItem) => cartItem._id === item._id);
            if (existingItem) {
                return prevCart.map((cartItem) =>
                    cartItem._id === item._id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            }
            return [...prevCart, { ...item, quantity: 1 }];
        });
        alert("Added to cart!");
    };

    const removeFromCart = (itemId) => {
        setCart((prevCart) => prevCart.filter((item) => item._id !== itemId));
    };

    const updateQuantity = (itemId, quantity) => {
        if (quantity < 1) return;
        setCart((prevCart) =>
            prevCart.map((item) =>
                item._id === itemId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const totalAmount = cart.reduce((total, item) => total + (item.price || 0) * item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalAmount }}>
            {children}
        </CartContext.Provider>
    );
};
