const express = require('express');
const router = express.Router()


//import validation for protected routes
const {authenticateUser} = require('../middleware/authentication')
// const {authenticateUser, authorizeRoles} = require('../middleware/full-auth')

const {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
} = require('../controllers/userController')



router.route('/getAllUsers').get(authenticateUser, getAllUsers)
router.route('/showMe').get(authenticateUser, showCurrentUser)
router.route('/updateUserPassword').patch(authenticateUser, updateUserPassword)
router.route('/updateUser/:id').patch(authenticateUser, updateUser)
router.route('/singleUser/:id').get(authenticateUser, getSingleUser)


module.exports = router