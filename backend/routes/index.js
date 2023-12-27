const express = require('express');
const authController = require('../controller/authController')
const router = express.Router();
 
// router.get('/test', (req, res) => res.json({msg:'Hello World!! test is working'})
//   )
// user
// register
router.post('/register', authController.register);
// login
// router.post('/login', authController.login);
// logout 
// refresh

//blog
// crued
//create, read all blogs, read blog by id, update, delete, 
// comment
// create comment
// read comments by blog id

module.exports = router;