import React from 'react'
import './App.css'
import AppRoutes from './routes/AppRoutes'

import { CartProvider } from './context/CartContext'

function App() {


  return (
    <CartProvider>
      <AppRoutes />
    </CartProvider>
  )
}

export default App
