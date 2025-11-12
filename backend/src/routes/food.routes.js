const express = require('express');
const foodController = require('../controllers/food.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const router = express.Router();
const multer = require('multer')


const upload = multer({
    storage: multer.memoryStorage(),
})





// method=POST  route="/api/food/"  [protected]
router.post('/',authMiddleware.authFoodPartnerMiddleware ,upload.single("video") ,  foodController.createFood)


// GET /api/food/   [proctected]
router.get('/', authMiddleware.authUserMiddleware , foodController.getFoodItems )


router.post('/like', authMiddleware.authUserMiddleware , foodController.likeFood )


router.post('/save',authMiddleware.authUserMiddleware , foodController.saveFood)


module.exports = router ;