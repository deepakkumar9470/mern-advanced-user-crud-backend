import express from 'express'
const router  = express.Router()
import {registerUser,getUser, getSingleUser,editUser, deleteUser, userStatusChange, exportUsertoCsv } from '../controllers/user.js'
import upload from '../multerfileupload/fileUpload.js'


//@  /api/user/register
router.post('/register',upload.single('user_profile') ,registerUser)

//@  /api/user
router.get('/', getUser)

//@  /api/user/:id
router.get('/:id', getSingleUser)

//@  /api/user/edit/:id
router.put('/edit/:id',upload.single('user_profile'),editUser )


//@ /api/user/:id
router.delete('/:id', deleteUser)

//@ /api/user/status/:id
router.put('/status/:id', userStatusChange)

//@ /api/user/export
router.get('/export', exportUsertoCsv)

export default router