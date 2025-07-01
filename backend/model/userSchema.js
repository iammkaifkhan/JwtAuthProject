const mongoose =  require('mongoose');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true,'user name is required'],
        minLength: [5,'name must be at least 5 char'],
        maxLength: [50, 'name must be less than 50 char'],
        trim: true
    },
    email: {
        type: String,
        required: [true,'user email is required'],
        lowercase: true,
        unique: [true,'already registered']
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        select: false
    },
    forgotPasswordToken: {
        type: String
    },
    forgotPasswordExpiryDate: {
        type: Date
    }
},
{
    timestamps:true
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    return next();
})

userSchema.methods = {
jwtToken() {
    return JWT.sign(
        { id: this._id, email: this.email},
        process.env.SECRET,
        { expiresIn: '24h' }
    )
}
     

}

const userModel = mongoose.model('User',userSchema);

module.exports = userModel;