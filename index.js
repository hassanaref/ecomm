const express = require('express');
const bodyParser = require('body-parser');
const cookiesession = require('cookie-session');
const usersrepo = require('./repositories/users');
const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookiesession({
    keys: ['erthtyrhyy34tyertgd']
}));

app.get('/signup', (req, res) => {
    res.send(`
<!doctype html>
<html>
<div>
    your id is: ${req.session.userid}
    <form method="POST">
        <input name="email" , placeholder="email" />
        <input name="password" , placeholder="password" />
        <input name="passwordConfirmation" , placeholder="password confirmation" />
        <button>sign up</button>
    </form>
</div>

</html>
`);
});

app.post('/signup', async (req, res) => {
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

app.get('/signout', (req, res) => {
    req.session = null;
    res.send('you signed out');
});

app.get('/signin', (req, res) => {
    res.send(`
<!doctype html>
    <html>
        <div>
            <form method="POST">
                <input name="email" , placeholder="email" />
                <input name="password" , placeholder="password"/>
                <button> sign in </button>
            </form>
        </div>
    </html> `)
});

app.post('/signin' ,async (req,res) => {
    const {email, password} = req.body;
    const user = await usersrepo.getoneby({email});
    if(!user){
        return res.send('email.on found');
    };
    if (user.password !== password){
        return res.send('wrong password');
    };
     req.session.userid= user.id;
     res.send('you are signed in !!!');
});

app.listen(3000, () => {
    console.log('listening');
});