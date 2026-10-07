import express from "express"
import connectDB from "./config/db.js"
import productRoute from './route/productRoute.js'
import cors from 'cors'
import dotenv from 'dotenv'
import userRoute from './route/userRoute.js'
import cookieParser from "cookie-parser"

const app=express()
dotenv.config()
connectDB()

app.use(cookieParser())
app.use(cors({ origin: true, credentials: true }))
app.use(express.json({ limit: "7mb" }))

app.use('/product',productRoute)
app.use('/user',userRoute)

app.listen(3000,()=>{
    console.log('server running ...')
})