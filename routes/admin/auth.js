const express = require('express');
const usersrepo = require('../../repositories/users');
const signuptemplate = require('../../veiws/admins/auth/signup');
signintemplate = require('../../veiws/admins/auth/signin');
const router = express.Router();

router.get('/signup', (req, res) => {
    res.send(signuptemplate({req}));
});

router.post('/signup', async (req, res) => {
    const {
        email,
        password,
        passwordConfirmation
    } = req.body;
    const exuser = await usersrepo.getoneby({
        email
    });
    if (exuser) {
        return res.send('email used');
    }
    if (password !== passwordConfirmation) {
        return res.send('password not matching');
    }
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