// import the model
const User=require('../models/user');
const userMailer=require('../mailers/user_mailer');

// Render the profile page
module.exports.profile=function(req,res){
    User.findById(req.params.id, function(err, user){
        return res.render('profile',{       // Render views/profile file to the server
            title: 'profile',
            profile_user: user
        });
    });
}

// for update the form
module.exports.update=function(req,res){
    if(req.user.id == req.params.id){
        User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
            return res.redirect('back');
        });
    }else{
        // req.flash('error','Unauthorized');
        return res.status(401).send('Unauthorized');
    }
}

// Render the Sign-up page
module.exports.signUp=function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile')
    }
    return res.render('user_sign_up',{
        title: "sign up"
    });
}

// Render the sign-in page
module.exports.signIn=function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile')
    }
    return res.render('user_sign_in',{
        title: "sign in"
    });
}

// get the sign-up data
module.exports.create=function(req,res){
    // check password and conform password
    if (req.body.password != req.body.confirm_password) {
        return res.redirect('back');
    }

    // check whether email is present or not
    User.findOne({email: req.body.email},function(err,user){
        if(err){
            console.log('Error in finding user in signing up');
            return;
        }

        // create now account for new user if email is not present
        if(!user){
            User.create(req.body,function(err,user){
                if(err){
                    console.log('Error in creating user while signing up');
                    return;
                }
                return res.redirect('/users/sign-in');
            });
        }
        else{
            return res.redirect('back');  // return back if email is present 
        }
    });
}

// Sign in and create a session for user
module.exports.createSession=function(req,res){
    req.flash('success','Logged in Successfully');
    return res.redirect('/');
}

// Sign Out and destroy the current session
module.exports.destroySession=function(req,res){
    req.logout();
    req.flash('success','You have Logged Out!');
    return res.redirect('/');
}