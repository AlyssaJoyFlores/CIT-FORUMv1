const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');


const usersSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Provide username"]
    },
    password: {
        type: String,
        required: [true, "Provide password"]
    }
},{
    timestamps: true,
})




usersSchema.pre('save', async function(){
    if(!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

usersSchema.methods.comparePassword = async function(candidatePassword){
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch;
}


module.exports = mongoose.model('User' , usersSchema);
