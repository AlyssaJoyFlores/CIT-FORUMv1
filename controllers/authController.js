const User = require('../models/usersModel')
const Token = require('../models/tokenModel')
const CustomError = require('../errors')
const crypto = require('crypto')

require('dotenv').config();
const {StatusCodes} = require('http-status-codes')
const { attachedCookiesToResponse, createTokenUser} = require('../utils')



const register = async (req, res) => {
    const {
        username,
        password,
    } = req.body;

  
    const usernameExist = await User.findOne({ username });
    if (usernameExist) {
        throw new CustomError.BadRequestError('Username Already Exist');
    }

 

    const user = await User.create({
        username,
        password,
    });



    res.status(StatusCodes.CREATED).json({ msg: 'Register User Successfully', user});
};





const login = async (req, res) => {
    const { username, password } = req.body;

   
    if (!username || !password) {
        throw new CustomError.BadRequestError('Please provide username or password');
    }


    const user = await User.findOne({ username });
    if (!user) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }


    // Check if password correct, if not throw error
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials, wrong password');
    }


    const tokenUser = createTokenUser(user);

    // Setup token for refresh and access
    // refreshToken
    let refreshToken = '';

    // Check for existing refreshToken
    const existingToken = await Token.findOne({ user: user._id });

    if (existingToken) {
        const { isValid } = existingToken;
        if (!isValid) {
            throw new CustomError.UnauthenticatedError('Invalid Credentials');
        }

        refreshToken = existingToken.refreshToken;
        attachedCookiesToResponse({ res, user: tokenUser, refreshToken });
        res.status(StatusCodes.OK).json({ msg: 'Login User Successfully,  Already Have Refresh Token', user: tokenUser });
        return;
    }

    // Setup token
    refreshToken = crypto.randomBytes(40).toString('hex');
    const userAgent = req.headers['user-agent'];
    const ip = req.ip;
    const userToken = { refreshToken, userAgent, ip, user: user._id };
    // Token create
    await Token.create(userToken);

    attachedCookiesToResponse({ res, user: tokenUser, refreshToken });

    console.log(user);
    res.status(StatusCodes.OK).json({ msg: 'Login Credential Submitted Successfully', user: tokenUser });
};



const logout = async (req, res) => {
    const userId = req.user.userId;


    await Token.findOneAndDelete({ user: userId });

    res.cookie('accessToken', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now() + 1000),
    });

    res.cookie('refreshToken', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now() + 1000),
    });

    res.status(StatusCodes.OK).json({ msg: 'Logout user'});
};







module.exports = {
    register,
    logout,
    login,
}