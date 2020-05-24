const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');

const User = require('../../models/User');

//test protected route
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('server error');
    }
});

//authenticate user and get token
router.post('/', [
    check('email', 'please enter a valid email').isEmail(),
    check('password', 'password is required').exists()
], async (req, res) => {
    //check for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    //get user crebdentials
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
        }

        //password should match
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ errors: 'Invalid credentials' });
        }
        const tokenpayload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(tokenpayload, config.get('jwtSecret'), { expiresIn: 3600 }, (err, token) => {
            if (err) {
                throw err;
            }
            res.json({ token })
        })
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
})

module.exports = router;
