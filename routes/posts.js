const express=require('express');
const router=express.Router();
const postsController=require('../controllers/posts_controller');
const passport=require('passport');


// edit in routes.posts for authentication
router.post('/create',passport.checkAuthentication, postsController.create);
// router.get('/destroy/:id',passport.checkAuthentication, postsController.destroy);

module.exports=router; 
