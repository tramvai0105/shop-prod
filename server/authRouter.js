import express from 'express'
import { User } from './models.js'
import inspector from "schema-inspector";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const authRouter = express.Router()

const middleware = (req, res, next) => {
    next()
}

authRouter.use(middleware)

authRouter.get('/', (req, res) => {
    res.json(200)
})

authRouter.get('/registerkingpiglsey', async (req, res) => {
    let password = bcrypt.hashSync("strongpassword", 10);
    let user = new User({username: "admin", password: password,
    privileges: true});
    await user.save();
    res.json(200)
})

authRouter.get('/login', async (req, res) => {
    let user = await User.findOne({ username: "admin" })
    let correct = await bcrypt.compare("strongpassword", user.password)
    if(!correct){
        res.status(401).send("incorrect password")
    }
    let token = jwt.sign(user.toJSON(), process.env.SECRET, { expiresIn: 1200 });
    res.cookie("token", token).status(200).send("authorized")
})

export default authRouter