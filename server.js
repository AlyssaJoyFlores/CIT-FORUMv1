// dependencies
const express = require('express');
require('dotenv').config();
require('express-async-errors')
const cors = require('cors');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2
const morgan = require('morgan');
const cookieParser = require('cookie-parser')
const path = require("path");


const server = express()

// server.set('trust proxy', 1);

// cloudinary
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
})


// imports
const connectDb = require('./db/dbConnection');


// middleware
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

// Morgan setup
server.use(morgan('tiny'))



server.use(cors())


server.use(express.json()); //passer - to be able to receive the data from the client into the server
server.use(express.urlencoded({ extended: true}));
server.use(fileUpload({useTempFiles:true}));
server.use(cookieParser(process.env.JWT_SECRET));





// api routes
server.use('/api/auth', require('./routes/authRouter'))
server.use('/api/users', require('./routes/userRouter'))
server.use('/api/forums', require('./routes/forumRoute'))



server.use(notFoundMiddleware)
server.use(errorHandlerMiddleware)

server.get('/', (req, res) => {
    res.status(200).json({message: 'link to the client'})
    console.log('link to the client')
})


const port = process.env.PORT || 3000;

const startServer = async() => {
    try {
        await connectDb();
        server.listen(port, ()=> {
            console.log(`Server start listening on port ${port}`);
        });
    } catch (error) {
        console.log(error);
    }
   
};

startServer();

