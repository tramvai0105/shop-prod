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

authRouter.get('/checktoken', (req, res) => {
    let token = req.cookies["token"];
    if (!token) {
        return res.status(200).json({message: false})
    }
    try {
        let payload = jwt.verify(token, process.env.SECRET)
        return res.status(200).send({message: {username: payload.username, privileges: payload.privileges}});
    } catch (error) {
        return res.status(200).send({message: false});
    }
})

authRouter.get('/registerkingpiglsey', async (req, res) => {
    let password = bcrypt.hashSync("strongpassword", 10);
    let user = new User({
        username: "admin", password: password,
        privileges: true
    });
    await user.save();
    res.json(200)
})

authRouter.post('/login', async (req, res) => {
    let validation = {
        type: 'object',
        properties: {
            username: { type: 'string', minLength: 1 },
            password: { type: 'string', minLength: 1 },
        },
    };
    let validated = inspector.validate(validation, req.body)
    console.log(req.body)
    if (!validated.valid) {
        return res.status(501).json({ message: "Некорректные данные" });
    }
    let user = await User.findOne({ username: req.body.username })
    if (!user) {
        return res.status(501).json({ message: "Пользователь не найден" });
    }
    let correct = await bcrypt.compare(req.body.password, user.password)
    if (!correct) {
        return res.status(401).json({ message: "Неправильный пароль" })
    }
    let token = jwt.sign(user.toJSON(), process.env.SECRET, { expiresIn: 12000 });
    return res.cookie("token", token).status(200).json({ message: "Успешно авторизировано" })
})

export default authRouter