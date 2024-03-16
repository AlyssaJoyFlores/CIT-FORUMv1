const express = require('express');
const router = express.Router();


const {authenticateUser} = require('../middleware/authentication')

const {
    getAllForums,
    getSingleForum,
    getUserCreateForum,
    getTopForums,
    searchForum,
    createForum,
    updateForum,
    deleteForum,
    createComment,
    getCommentsForForum
} = require('../controllers/forumController')


// routes for forum
router.route('/getAllForums').get(authenticateUser, getAllForums)
router.route('/getUserCreateForum').get(authenticateUser, getUserCreateForum)
router.route('/getTopForums').get(authenticateUser, getTopForums)
router.route('/searchForum').get(authenticateUser, searchForum)

router.route('/createForum').post(authenticateUser, createForum)

router.route('/getSingleForum/:id').get(authenticateUser, getSingleForum)

router.route('/updateForum/:id').patch(authenticateUser, updateForum)
router.route('/deleteForum/:id').delete(authenticateUser, deleteForum)

// routes for comment
router.route('/createComment/:id').post(authenticateUser, createComment);
router.route('/getCommentsForForum/:id').get(authenticateUser, getCommentsForForum);


module.exports = router;

