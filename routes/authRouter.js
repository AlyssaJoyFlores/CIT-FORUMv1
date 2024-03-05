const express = require('express');
const router = express.Router()

const {authenticateUser} = require('../middleware/authentication')

const rateLimiter = require('express-rate-limit')
const apiLimiter = rateLimiter({
    windowMs: 1 * 60 * 1000, //1 min
    max: 5,
    message: {
        msg: 'Too many request. Please Try again later'
    }
})


const {
    register,
    logout,
    login,
} = require('../controllers/authController')

router.route('/register').post(apiLimiter, register)
router.route('/login').post(apiLimiter, login)
router.route('/logout').delete(authenticateUser, logout)

module.exports = router