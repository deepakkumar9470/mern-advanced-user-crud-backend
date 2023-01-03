import multer from 'multer'

const storage = multer.diskStorage({
    destination : (req,file,cb)=>{
        cb(null, './uploads')
    },
    filename :  (req,file,cb)=>{
        const filename = `image-${Date.now()}.${file.originalname}`
        cb(null,filename)
    },
});

const fileFilter = (req,file,cb) =>{
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg'){
        cb(null,true)
    }else{
        cb(null,false)
        return cb(new Error('Only .png .jpg & .jpeg formatted are allowed'))
    }
}

const upload = multer({storage, fileFilter : fileFilter})

export default upload