const User = require('../models/usersModel')

const CustomError = require('../errors')
const {StatusCodes} = require('http-status-codes')
const { attachedCookiesToResponse, createTokenUser} = require('../utils')



const getAllUsers = async(req, res) => {
  const users = await User.find({}).select('-password')
  res.status(StatusCodes.OK).json({users})
}

const getSingleUser = async(req, res) => {
  const user = await User.findOne({_id: req.params.id }).select('-password')
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id : ${req.params.id}`);
  }

  res.status(StatusCodes.OK).json({msg: 'get single user', user})
}


const showCurrentUser = async(req, res) => {
  console.log(req.user)
  res.status(StatusCodes.OK).json(req.user);
}


const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id)

  if(!user){
    throw new CustomError.NotFoundError(`User not found for id ${user}`)
  }

  const updateUser = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    {new:true}
  )

  const tokenUser = createTokenUser(updateUser);
  attachedCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};





const updateUserPassword = async(req, res) => {

  const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      throw new CustomError.BadRequestError('Please provide both values');
    }
    const user = await User.findOne({ _id: req.user.userId });
  
    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
      throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }
    user.password = newPassword;
  
    await user.save();
    res.status(StatusCodes.OK).json({ msg: 'Success! Password Updated.' });
}





module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword
}


