const express = require('express');
const {
    check,
    validationResult
} = require('express-validator');
const usersrepo = require('../../repositories/users');
const signuptemplate = require('../../veiws/admins/auth/signup');
signintemplate = require('../../veiws/admins/auth/signin');
const router = express.Router();

router.get('/signup', (req, res) => {
    res.send(signuptemplate({
        req
    }));
});

router.post('/signup', [
        check('email')
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage('email must be valid')
        .custom(async email => {
            const exuser = await usersrepo.getoneby({
                email
            });
            if (exuser) {
                throw new Error('email used');
            }
        }),
        check('password')
        .trim()
        .isLength({
            min: 4,
            max: 20
        })
        .withMessage('must be between 4 and 20'),
        check('passwordConfirmation')
        .trim()
        .isLength({
            min: 4,
            max: 20
        })
        .withMessage('must be between 4 and 20')
        .custom((passwordConfirmation, {
            req
        }) => {
            if (passwordConfirmation !== req.body.password) {
                throw new Error('password must match');
            }
        }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        console.log(errors);
        const {
            email,
            password,
            passwordConfirmation
        } = req.body;

        const user = await usersrepo.create({
            email,
            password
        });
        req.session.userid = user.id;
        res.send('account created!!!')
    });

router.get('/signout', (req, res) => {
    req.session = null;
    res.send('you signed out');
});

router.get('/signin', (req, res) => {
    res.send(signintemplate());
});

router.post('/signin', async (req, res) => {
    const {
        email,
        password
    } = req.body;
    const user = await usersrepo.getoneby({
        email
    });
    if (!user) {
        return res.send('email.on found');
    };
    const validpass = await usersrepo.comparepass(
        user.password,
        password
    );
    if (!validpass) {
        return res.send('wrong password');
    };
    req.session.userid = user.id;
    res.send('you are signed in !!!');
});

module.exports = router;