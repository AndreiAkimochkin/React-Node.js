const Router = require("express");
const User = require("../models/users");
const router = new Router();
const bcrypt = require('bcryptjs');
const {check, validationResult} = require("express-validator");

router.post('/registration',
    [
        check('email','Uncorrected email' ).isEmail(),
        check('password','Password must be longer than 3 and shorter and 12 symbols' ).
        isLength({min: 3, max: 12})
    ],
    async (req, res)=> {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({message: 'Uncorrected request', errors})
        }

        const {email, password} = req.body
        const candidate = await User.findOne({email})

        if ({candidate}) {
            return res.status(400).json({message: `User with email ${email} is already exist`})
        }
        const hashPassword = await  bcrypt.hash(password, 15);
        const user = new User({email, password: hashPassword});
        await user.save();
        return res.json({message: 'User was created'})
    }

    catch (e) {
        res.send({message: "Server error"})
    }
})

module.exports =router;


