import mongoose from 'mongoose'


const connetcDb = async (req,res) =>{
    try {
        await mongoose.connect(process.env.MONGO_DB_URL)
        console.log('Database Connected..')
    } catch (error) {
        console.log(error)
    }
}

export default connetcDb