import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
const app = express()
const PORT = process.env.PORT || 5001
import cb from './db/db.js'
import userRoute from './routes/userapi.js'
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true,}));
app.use('/uploads', express.static('uploads'))
app.use('/files', express.static('./public/files'))
app.use('/api/user', userRoute)

cb()

app.get('/',(req,res)=>{
    res.send('hello')
})
app.listen(PORT , ()=>{
    console.log(`Server started at post http://localhost:${PORT}`)
})
