const express = require('express');
const bodyParser = require('body-parser');
const cookiesession = require('cookie-session');
const authrouter = require('./routes/admin/auth');
const app = express();


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookiesession({
    keys: ['erthtyrhyy34tyertgd']
}));
app.use(authrouter);


app.listen(3000, () => {
    console.log('listening');
});