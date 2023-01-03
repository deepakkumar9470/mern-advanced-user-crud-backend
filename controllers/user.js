import User from '../models/User.js'
import moment from 'moment'
import csv from 'fast-csv'
import fs from 'fs'

export const registerUser =async  (req,res) =>{
      const file  = req.file.filename
      const {firstName,lastName,email,mobile,gender,location,status} = req.body

      if(!firstName || !lastName || !email || !mobile || !gender|| !location || !status){
        res.status(204).json('Please fill all fields')
      }

     try {
        const user = await User.findOne({email : email})
        if(user)  res.status(204).json('User already exists')
        const dateCreated = moment(new Date()).format("DD-MM-YYYY hh:mm:ss")
        const newUser = await new User({
            firstName  :req.body.firstName,
            lastName  :req.body.lastName,
            email  :req.body.email,
            mobile  :req.body.mobile,
            gender  :req.body.gender,
            location  :req.body.location,
            status  :req.body.status,
            profile : file,
            dateCreated
         }).save()
         res.status(201).json({newUser})
     } catch (error) {
        res.status(500).json(error)
     }
}

export const getUser = async (req,res) =>{
    const search = req.query.search || ""
    const gender = req.query.gender || ""
    const status = req.query.status || ""
    const sort = req.query.sort || ""
    const page = req.query.page || 1
    const PER_PAGE_ITEMS = 5
      

    const query = {
        firstName : {$regex:search,$options:"i"}
    }
    if(gender !== "All"){
        query.gender = gender
    }
    if(status !== "All"){
        query.status = status
    }
    try {
        const skip = (page - 1) * PER_PAGE_ITEMS // 1-1 * 5

        const count = await User.countDocuments(query)

        const user = await User.find(query)
        .sort({dateCreated :sort == "new"  ? -1 : 1})
        .limit(PER_PAGE_ITEMS)
        .skip(skip)

        const pageCount = Math.ceil(count / PER_PAGE_ITEMS)  // 10/4 = 2.5
        res.status(200).json({
            Pagination : {
                count,
                pageCount
            },
            user
        })   
    } catch (error) {
       res.status(400).json(error)   
    }
}

export const getSingleUser = async (req,res) =>{
    const {id} = req.params
    try {
        const user = await User.findOne({_id:  id})
        res.status(200).json(user)   
    } catch (error) {
       res.status(400).json(error)   
    }
}


export const editUser = async (req,res) =>{
    const {id} = req.params
    const {firstName,lastName,email,mobile,gender,location,status,users_profile} = req.body
    const file = req.file ? req.file.filename : user_profile
    
    const dateUpdated = moment(new Date()).format("DD-MM-YYYY hh:mm:ss")
    try {
        
        const updateUser = await User.findByIdAndUpdate({_id:id},{
                firstName,lastName,email,mobile,gender,location,status, 
                profile:file,dateUpdated
                } ,{new : true})
         
         await updateUser.save()
         res.status(200).json(updateUser)
        } catch (error) {
       res.status(400).json(error)   
    }
}

export const deleteUser = async (req,res) =>{
    const {id} = req.params   
    try {        
        await User.findByIdAndDelete({_id:id})
        res.status(200).json('User has been deleted')
        } catch (error) {
          res.status(400).json(error)   
    }
}

// Change status
export const userStatusChange = async (req,res) =>{
    const {id} = req.params
    const {data} = req.body
    
    try {
        
        const updateUser = await User.findByIdAndUpdate({_id:id},{status:data} ,{new : true})        
         await updateUser.save()
         res.status(200).json(updateUser)
        } catch (error) {
       res.status(400).json(error)   
    }
}


// export to csv

export const exportUsertoCsv = async (req,res) =>{

   try {
    
    const userdata = await User.find()

    const csvStream = csv.format({headers  : true})

    if(!fs.existsSync('public/files/export')){
        if(!fs.existsSync('public/files')){
                 fs.mkdirSync('public/files/')
        }
        if(!fs.existsSync('public/files/export')){
            fs.mkdir('./public/files/export')
       }
    }


    const writableStream = fs.createWriteStream(
        'public/files/export/users.csv'
    )

    csvStream.pipe(writableStream)

    writableStream.on("finish", ()=>{
        res.json({
            downloadUrl : `${process.env.BASE_URL}/files/export/users.csv`
        })
    })

     if(userdata.length > 0){
        userdata.map((user)=>{
            csvStream.write({
                FirstName : user.firstName ? user.firstName : "_",
                LastName : user.lasttName ? user.lasttName : "_",
                Email : user.email ? user.email : "_",
                Mobile : user.mobile ? user.mobile : "_",
                Gender : user.gender ? user.gender : "_",
                Profile : user.profile ? user.profile : "_",
                Location : user.location ? user.location : "_",
                Status : user.status ? user.status : "",
                DateCreated : user.dateCreated ? user.dateCreated : "",
                DateUpdated : user.dateUpdated ? user.dateUpdated : "",
            })
        })
     }
    csvStream.end()
    writableStream.end()


   } catch (error) {
    
   }
}