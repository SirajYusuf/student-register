const express = require('express')
const router = new express.Router()
const {register, uploadPic,viewPic, getStudent, updatePic, updateStudent, deleteStudent} = require('../controller/studentController')
const login = require('../controller/adminController')
const {upload} = require('../utils/multer')
const auth = require('../middleware/auth')

router.post('/register',auth,register)
router.post('/login',login)
router.post('/uploadPic/:id',auth,upload.array('pic',3),uploadPic)
router.post('/viewPic/:id',auth,viewPic)
router.get('/getStudent',auth,getStudent)
router.patch('/updateStudent/:id',auth,updateStudent)
router.delete('/deleteStudent/:id',auth,deleteStudent)
router.post('/updatePic/:id/:id2',auth,upload.array('pic'),updatePic)  

module.exports = router