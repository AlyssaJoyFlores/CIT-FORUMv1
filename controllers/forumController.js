
const Forum = require('../models/forumModel')
const { checkPermissions } = require('../utils')
const CustomError = require('../errors')
const {StatusCodes} = require('http-status-codes')


const getAllForums = async(req, res)=>{
    const forums = await Forum.find({})
    res.status(StatusCodes.OK).json(forums)
}

// getSingleForum
const getSingleForum = async(req, res) => {
    const forum = await Forum.findById(req.params.id)
    if(!forum){
        res.status(404)
        throw new CustomError.NotFoundError("Forum not found")
    }
    res.status(StatusCodes.OK).json(forum)
}


// getUserForum  {user_id: req.user.id}
const getUserCreateForum = async(req, res)=>{
    const forums = await Forum.find({user: req.user.userId})
    res.status(StatusCodes.OK).json({forums, count: forums.length})
}


const createForum = async(req, res)=>{
    console.log(req.body);
    const {forumName, forumCategories, forumDescription} = req.body;
    if(!forumName || !forumCategories){
        throw new CustomError.BadRequestError("All fields are required")
    }

    const forum = await Forum.create({
        forumName,
        forumCategories,
        forumDescription,
   
  
    })
            // forumPublisher: req.user.username,
          // user: req.user.userId
    res.status(StatusCodes.CREATED).json({msg: 'Forum Created Successfully', forum})
}



const updateForum = async(req, res)=>{
    const forum = await Forum.findById(req.params.id)
    if(!forum){
        throw new CustomError.NotFoundError("Forum not found")
    }


    const updatedForum = await Forum.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true}
    )
    res.status(StatusCodes.OK).json({msg: 'Forum Updated Successfully', updatedForum})
}



const deleteForum = async(req, res)=>{
    const forum = await Forum.findById(req.params.id)
    if(!forum){
        throw new CustomError.NotFoundError("Forum not found")
    }

    await Forum.deleteOne({_id: req.params.id})
    
    res.status(StatusCodes.OK).json({msg: 'Forum Deleted Successfully', forum})
}




const createComment = async (req, res) => {
    const forumId = req.params.id;
    const { comment } = req.body;
    if (!comment) {
        throw new CustomError.BadRequestError("Comment is required");
    }

    const forum = await Forum.findById(forumId);
    if (!forum) {
        throw new CustomError.NotFoundError("Forum not found");
    }

    forum.comments.push({
        user_id: req.user.id,
        comment: comment
    });

    await forum.save();

    res.status(StatusCodes.CREATED).json({ msg: 'Comment Added Successfully', forum });
};



const getCommentsForForum = async (req, res) => {
    const forumId = req.params.id;
    
    const forum = await Forum.findById(forumId);

    if (!forum) {
        throw new CustomError.NotFoundError("Forum not found");
    }

    const comments = forum.comments;
    const forumName = forum.forumName
    res.status(StatusCodes.OK).json({forumName, comments, count: comments.length});
};




module.exports = { 
    getAllForums,
    getSingleForum,
    getUserCreateForum,
    createForum,
    updateForum,
    deleteForum,
    createComment,
    getCommentsForForum

}


