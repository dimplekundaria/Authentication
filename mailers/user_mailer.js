const nodeMailer=require('../config/nodemailer');

// This is the another way for exporting a method
exports.newUser=(user) =>{
    console.log('Inside user mailer',user)

    // to Send template in mail
    // let htmlString=nodeMailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs');

    nodeMailer.transporter.sendMail({
        from: 'dimplekundaria@gmail.com',
        to:post.user.email,
        subject: "New post published!",
        html: '<h1>Yup, Your post is now published <h1>'
    },(err, info) =>{
        if(err){
            console.log('Error in sending mail', err);
            return;
        }
        console.log('Message send',info);
        return;
    });
}