import React from 'react';
import { useCart } from '../../context/CartContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, clearCart, totalAmount } = useCart();
    const navigate = useNavigate();
    const VITE_API_URL = import.meta.env.VITE_API_URL;

    const handlePlaceOrder = async () => {
        if (cart.length === 0) return;

        try {
            const items = cart.map(item => ({
                food: item._id,
                quantity: item.quantity,
                price: item.price || 0
            }));

            await axios.post(`${VITE_API_URL}/api/order`, {
                items,
                totalAmount
            }, { withCredentials: true });

            alert('Order placed successfully!');
            clearCart();
            navigate('/');
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order.');
        }
    };

    if (cart.length === 0) {
        return (
            <div style={{ padding: '20px', textAlign: 'center', color: 'white' }}>
                <h2>Your Cart is Empty</h2>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', color: 'white', maxWidth: '600px', margin: '0 auto' }}>
            <h2>Your Cart</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {cart.map((item) => (
                    <div key={item._id} style={{ display: 'flex', gap: '10px', background: '#333', padding: '10px', borderRadius: '8px' }}>
                        {/* Use video thumbnail or placeholder if image not available */}
                        <div style={{ width: '80px', height: '80px', background: '#000', borderRadius: '4px', overflow: 'hidden' }}>
                            <video src={item.video} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3>{item.name || 'Food Item'}</h3>
                            <p>Price: ${item.price || 0}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
                                <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                            </div>
                        </div>
                        <button onClick={() => removeFromCart(item._id)} style={{ alignSelf: 'start', color: 'red' }}>Remove</button>
                    </div>
                ))}
            </div>
            <div style={{ marginTop: '20px', borderTop: '1px solid #555', paddingTop: '10px' }}>
                <h3>Total: ${totalAmount}</h3>
                <button
                    onClick={handlePlaceOrder}
                    style={{
                        width: '100%',
                        padding: '15px',
                        background: '#ff4757',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '1.1rem',
                        cursor: 'pointer',
                        marginTop: '10px'
                    }}
                >
                    Place Order
                </button>
            </div>
        </div>
    );
};

export default Cart;
