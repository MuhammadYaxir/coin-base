const Joi = require('joi');
const User = require('../models/user')
const bcrypt = require('bcryptjs');
const userDTO = require("../dto/user")

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

const authController = {
    async register(req, res, next) {
        // 1. validate user input
        const userRegistraterSchema = Joi.object({
            username: Joi.string().min(5).max(30).required(),
            name: Joi.string().max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(passwordPattern).required(),
            confirmPassword: Joi.ref('password')
        });

        const {error} = userRegistraterSchema.validate(req.body);
        // 2. if error in validation -> return error via middleware
        if (error){
            return next(error);
        }

        //3. if email or username is already registered -> return error
        const {username, name, email, password} = req.body;

        // check if email is not already registered
        try {
            const emailInUse = await User.exists({email});

            const usernameInUse = await User.exists({username});
           

            if (emailInUse){
                const error = {
                    status: 409,
                    message: 'Email already registered. Use another email!'
                }
                return next(error)
            }
            if (usernameInUse){
                const error = {
                    status: 409,
                    message: 'Username not available. Use another username!'
                }
                return next(error)
            }
            
        } catch (error) {
            return next(error);
        }
        // 4. Password hasd
        const hashedPassword = await bcrypt.hash(password, 10);
        // 5. store user data in db
        const userToRegister = new User({
            username,
            email,
            name,
            password: hashedPassword
        });
        const user = await userToRegister.save();
        const userDto = new userDTO(user);
        //6. response send
        return res.status(201).json({user: userDto})
    },
    async login(req, res, next) {
        // 1. validate user input
        const userLoginSchema = Joi.object({
            username: Joi.string().min(5).max(30).required(),
            password: Joi.string().pattern(passwordPattern).required(),
        });
        // 2. if validation error, return error
        const {error} = userLoginSchema.validate(req.body);
        // 2. if error in validation -> return error via middleware
        if (error){
            return next(error);
        }
        // 3. math username and password
        const {username, password} = req.body;
        let user;
        try {
            user = await User.findOne({username: username});
            //match username
            if (!user){
                const error = {
                    status: 401,
                    message: 'Invalid Username'
                }
                return next(error)
            }
            //match password
            //req.body.passsword -> hash -> match
            const match = await bcrypt.compare(password, user.password);
            if (!match){
                const error = {
                    status: 401,
                    message: 'Invalid Password'
                }
                return next(error)
            }
            
        } catch (error) {
            return next(error);
        }
        const userDto = new userDTO(user);
        // 4. return response
        return res.status(200).json({user: userDto})
    }
    
}

module.exports = authController;