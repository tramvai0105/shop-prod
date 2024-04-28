import express from 'express'
const adminRouter = express.Router()
import fs from 'node:fs/promises'
import { resolve } from 'path'
import jwt from 'jsonwebtoken';

const isProduction = process.env.MODE === 'production'
  const middleware = async (req, res, next) => {
  let token = req.cookies["token"];
  if(!token){
    res.status(404).send("Not found")
  }
  try{
    let payload = jwt.verify(token, process.env.SECRET)
    if(payload.privileges){
      next()
    }else{
      res.status(404).send("Not found")
    }
  }catch(error){
    res.status(404).send("Not found");
  }
}

adminRouter.use(middleware)

if (!isProduction)
  adminRouter.get('/', async (req, res) => {
    let html = await fs.readFile(resolve(resolve(), "admin", "indexDev.html"), 'utf-8')
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  })
else {
  adminRouter.get('/', async (req, res) => {
    let html = await fs.readFile(resolve(resolve(), "dist", "client", "admin", "index.html"), 'utf-8')
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  })
}

export default adminRouter