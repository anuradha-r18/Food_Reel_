const foodModel = require('../models/food.model');
const storageService = require('../services/storage.service');
const likeModel = require('../models/likes.model');
const saveModel = require('../models/save.model');
const { v4: uuid } = require('uuid');

/**
 * Create a new food item (with video upload to ImageKit)
 */
async function createFood(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No video file uploaded" });
    }

    const fileName = `${uuid()}-${req.file.originalname}`;

    const fileUploadResult = await storageService.uploadFile(req.file.buffer, fileName);

    const foodItem = await foodModel.create({
      name: req.body.name,
      description: req.body.description,
      video: fileUploadResult.url,
      foodPartner: req.foodPartner._id
    });

    res.status(201).json({
      message: "Food created successfully",
      food: foodItem
    });
  } catch (error) {
    console.error("Error creating food:", error.message || error);
    res.status(500).json({ message: "Failed to create food" });
  }
}

/**
 * Fetch all food items with user's like/save status
 */
async function getFoodItems(req, res) {
  try {
    const userId = req.user._id;
    const foodItems = await foodModel.find({}).lean();

    const foodItemsWithStatus = await Promise.all(foodItems.map(async (food) => {
      const isLiked = await likeModel.exists({ user: userId, food: food._id });
      const isSaved = await saveModel.exists({ user: userId, food: food._id });
      return {
        ...food,
        isLiked: !!isLiked,
        isSaved: !!isSaved
      };
    }));

    res.status(200).json({
      message: "Food items fetched successfully",
      foodItems: foodItemsWithStatus
    });
  } catch (error) {
    console.error("Error fetching food items:", error.message || error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * Like/unlike a food item
 */
async function likeFood(req, res) {
  try {
    const { foodId } = req.body;
    const userId = req.user._id;

    const existing = await likeModel.findOne({ user: userId, food: foodId });

    if (existing) {
      await likeModel.deleteOne({ user: userId, food: foodId });
      await foodModel.findByIdAndUpdate(foodId, { $inc: { likeCount: -1 } });
      return res.status(200).json({ message: "Food unliked successfully" });
    }

    const like = await likeModel.create({ user: userId, food: foodId });
    await foodModel.findByIdAndUpdate(foodId, { $inc: { likeCount: 1 } });

    res.status(201).json({ message: "Food liked successfully", like });
  } catch (error) {
    console.error("Error liking food:", error.message || error);
    res.status(500).json({ message: "Failed to like food" });
  }
}

/**
 * Save/unsave a food item
 */
async function saveFood(req, res) {
  try {
    const { foodId } = req.body;
    const userId = req.user._id;

    const existing = await saveModel.findOne({ user: userId, food: foodId });

    if (existing) {
      await saveModel.deleteOne({ user: userId, food: foodId });
      await foodModel.findByIdAndUpdate(foodId, { $inc: { savesCount: -1 } });
      return res.status(200).json({ message: "Food unsaved successfully" });
    }

    const save = await saveModel.create({ user: userId, food: foodId });
    await foodModel.findByIdAndUpdate(foodId, { $inc: { savesCount: 1 } });

    res.status(201).json({ message: "Food saved successfully", save });
  } catch (error) {
    console.error("Error saving food:", error.message || error);
    res.status(500).json({ message: "Failed to save food" });
  }
}

/**
 * Get all foods saved by the user
 */
async function getSaveFood(req, res) {
  try {
    const userId = req.user._id;
    const savedFoods = await saveModel.find({ user: userId }).populate('food');

    if (!savedFoods || savedFoods.length === 0) {
      return res.status(404).json({ message: "No saved foods found" });
    }

    res.status(200).json({
      message: "Saved foods fetched successfully",
      savedFoods
    });
  } catch (error) {
    console.error("Error fetching saved foods:", error.message || error);
    res.status(500).json({ message: "Failed to fetch saved foods" });
  }
}

module.exports = {
  createFood,
  getFoodItems,
  likeFood,
  saveFood,
  getSaveFood
};
