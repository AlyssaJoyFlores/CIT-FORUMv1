const express = require('express');
const router = express.Router();


const {authenticateUser} = require('../middleware/authentication')

const {
    getAllForums,
    getSingleForum,
    getUserCreateForum,
    createForum,
    updateForum,
    deleteForum,
    createComment,
    getCommentsForForum
} = require('../controllers/forumController')


// routes for forum
router.route('/getAllForums').get(getAllForums)
router.route('/getUserCreateForum').get(getUserCreateForum)
router.route('/createForum').post(createForum)
router.route('/getSingleForum/:id').get(getSingleForum)
router.route('/updateForum/:id').patch(updateForum)
router.route('/deleteForum/:id').delete(deleteForum)

// routes for comment
router.route('/createComment/:id').post(authenticateUser, createComment);
router.route('/getCommentsForForum/:id').get(authenticateUser, getCommentsForForum);


module.exports = router;

