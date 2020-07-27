const Post=require('../models/post');
const postMailer=require('../mailers/user_mailer');

// Create a post by Async Await
module.exports.create= async function(req, res){
    try {
        // await Post.create({
        let post=await Post.create({
            content: req.body.content,
            user: req.user._id
        });

        // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
        post = await post.populate('user', 'name email').execPopulate();
        postMailer.newUser(post);
        // if the data in ajax
        if(req.xhr){
            

            return res.status(200).json({
                data: {
                    post: post
                },
                message: "Post Created"
            });
        }

        req.flash('success','Post Published!');
        return res.redirect('back');

    } catch (err) {
        req.flash('error',err);
        return res.redirect('back');
    }
}
