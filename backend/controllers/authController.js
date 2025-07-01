const userModel = require("../model/userSchema");
const emailvalidator = require("email-validator");
const bcrypt = require("bcrypt");

exports.Signup = async (req, res) => {

    const {name, email, password, confirmPassword} = req.body;
    console.log(name, email, password, confirmPassword);

    if(!name || !email || !password || !confirmPassword) {
        return res.status(400).json({
            success:false,
            message: 'Please fill all the fields'
        })
    }
    const validEmail = emailvalidator.validate(email);
    if(!validEmail) {
        return res.status(400).json({
            success:false,
            message: 'Please enter a valid email'
        });
    }
    if(password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: 'Password and confirm password do not match'
        })
    }
try {
    const userInfo = userModel(req.body);
    const result = await userInfo.save();

    return res.status(200).json({
        success:true,
        data: result        
    });
} catch (error) {
    if(error.code === 11000){
        return res.status(400).json({
            success:false,
            message: 'Email already registered'
        });
    }
    return res.status(400).json({
        success:false,
        message: error.message
    }); 
}


}

exports.Signin = async (req, res) => {

const {email,password} = req.body;

if(!email || !password) {
    return res.status(400).json({
        success: false,
        message: 'Please fill all the fields'
    })
}
try {
    const user = await userModel.findOne({email}).select('+password');

if(!user || !(await bcrypt.compare(password, user.password))) {

      return res.status(400).json({
        success: false,
        message: 'Invalid Credentials'
      })
}
    
const token = user.jwtToken();
user.password = undefined;

const cookieOptions = {
    maxAge: 24*60*60*1000,
    httpOnly: true 
};

res.cookie("token",token,cookieOptions);

return res.status(200).json({
    success: true,
    data: user

})
} 

catch (error) {
    res.status(400).json({
        success: false,
        message: error.message
    })
}


}

exports.getUser = async (req, res, next) => {

const userId = req.user.id;

try {
    const user = await userModel.findById(userId);
    return res.status(200).json({
        success: true,
        data: user
    });
} catch (error) {
    return res.status(400).json({
        success: false,
        message: error.message
    });
}


}

exports.Logout = async (req, res) => {
    try {
        const cookieOptions = {
            expires: new Date(),
            httpOnly: true,
        };
        res.cookie("token", null, cookieOptions)
        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}


