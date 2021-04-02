const layout = require('../layout');
module.exports = ({req})=>{
    return layout({

    content:`
                <div>
                    your id is: ${req.session.userid} 
                    <form method = "POST">
                        <input name = "email", placeholder = "email" />
                        <input name = "password", placeholder = "password" />
                        <input name = "passwordConfirmation", placeholder = "password confirmation" />
                        <button> sign up </button> 
                    </form> 
                </div>
`});
};