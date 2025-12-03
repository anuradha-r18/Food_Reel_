const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes');
const foodPartnerRoutes = require('./routes/food-partner.routes');
const orderRoutes = require('./routes/order.routes');
const cors = require('cors');





const app = express();
app.use(cookieParser());
app.use(express.json());

// CORS configuration
const allowedOrigins = [
    "https://food-reel-delta.vercel.app",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",
];

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow non-browser clients or same-origin
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error("Not allowed by CORS"));
        },
        credentials: true,        
    })
);






app.get('/', (req, res) => {
    res.send("Hello World")
})

app.use('/api/auth', authRoutes)
app.use('/api/food', foodRoutes)
app.use("/api/food-partner", foodPartnerRoutes);
app.use('/api/order', orderRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err);
    res.status(500).json({
        message: "Internal Server Error",
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});


module.exports = app;