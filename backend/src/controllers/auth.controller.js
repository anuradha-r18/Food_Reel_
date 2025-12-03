const userModel = require('../models/user.model');
const foodPartnerModel = require("../models/foodpartner.model");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


function setAuthCookie(res, tokenName, tokenValue) {
    res.cookie(tokenName, tokenValue, {
        httpOnly: false,
        secure: false,  
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",     
      });
}


async function registerUser(req, res) {
    try {
        const { fullName, email, password } = req.body;

        const existing = await userModel.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            fullName,
            email,
            password: hashedPassword
        });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        // important: separate cookie
        setAuthCookie(res, "userToken", token);

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid email or password" });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(400).json({ message: "Invalid email or password" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        setAuthCookie(res, "userToken", token);

        return res.status(200).json({
            message: "User logged in successfully",
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
            }
        });
    } catch (error) {
        console.error("Error logging in user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


function logoutUser(req, res) {
    res.clearCookie("userToken");
    return res.status(200).json({ message: "User logged out successfully" });
}


async function registerFoodPartner(req, res) {
    try {
        const { name, email, password, phone, contactName, address } = req.body;

        const existing = await foodPartnerModel.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "Food partner already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const partner = await foodPartnerModel.create({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
            contactName
        });

        const token = jwt.sign({ id: partner._id }, process.env.JWT_SECRET);
        setAuthCookie(res, "partnerToken", token);

        return res.status(201).json({
            message: "Food partner registered successfully",
            foodPartner: {
                _id: partner._id,
                name: partner.name,
                email: partner.email,
                phone: partner.phone,
                address: partner.address,
                contactName: partner.contactName,
            }
        });

    } catch (error) {
        console.error("Error registering food partner:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function loginFoodPartner(req, res) {
    try {
        const { email, password } = req.body;

        console.log("LOGIN ATTEMPT:");
        console.log("Email sent:", email);
        console.log("Password sent:", password);

        const partner = await foodPartnerModel.findOne({ email });
        console.log("Found partner in DB:", partner);

        if (!partner) return res.status(400).json({ message: "Invalid email or password" });

        const valid = await bcrypt.compare(password, partner.password);
        console.log("Password valid?", valid);

        if (!valid) return res.status(400).json({ message: "Invalid email or password" });

        const token = jwt.sign({ id: partner._id }, process.env.JWT_SECRET);
        setAuthCookie(res, "partnerToken", token);

        return res.status(200).json({
            message: "Food partner logged in successfully",
            foodPartner: {
                _id: partner._id,
                name: partner.name,
                email: partner.email
            }
        });

    } catch (error) {
        console.error("Error logging in food partner:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


function logoutFoodPartner(req, res) {
    res.clearCookie("partnerToken");
    return res.status(200).json({ message: "Food partner logged out successfully" });
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,

    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner
};
