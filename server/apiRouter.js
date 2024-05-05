import express from 'express'
import { Product } from './models.js'
import inspector from "schema-inspector";
const apiRouter = express.Router();
import multer from "multer";
import fs from "fs"
import { resolve } from 'path';
const storage = multer.diskStorage({
  destination: "public/",
  filename: function (req, file, callback) {
    callback(null, Date.now() + ".png");
}
});
const upload = multer({storage: storage})

// middleware that is specific to this router
const middleware = (req, res, next) => {
  //   console.log('Time: ', Date.now())
  next()
}
apiRouter.use(middleware)

apiRouter.get('/', (req, res) => {
  res.json(200)
})


apiRouter.get('/products', async (req, res) => {
  let products = await Product.find()
  res.send(JSON.stringify(products))
})

apiRouter.post('/putProduct', upload.single("files"), async (req, res) => {
  let validation = {
    type: 'object',
    properties: {
      _id: {type: "string", minLength: 1},
      name: { type: 'string', minLength: 5 },
      category: { type: 'string', minLength: 5 },
      price: { type: 'number', minLength: 1 },
      description: { type: 'string', minLength: 5 },
      image: {type: 'string', minLength: 5},
    },
  };
  let validated = inspector.validate(validation, req.body)
  if(!validated.valid){
    return res.status(501).json({message: "Неверные данные"});
  }
  if(req.file
    && !(req.file.mimetype == "image/png"
      || req.file.mimetype == "image/jpg"
      || req.file.mimetype == "image/jpeg")){
    fs.unlink(resolve(resolve(), "public", req.file.filename), (err) => err && console.error(err));
    return res.status(501).json({message: "Неверный тип файла"});
  }
  if(req.file){
    req.body.image = req.file.filename;
  }
  try{
    await Product.findOneAndUpdate({_id: req.body._id}, req.body)
    return res.status(200).json({message: "Данные обновлены"});
  }catch(error){
    return res.status(501).json({message: error});
  }
})

apiRouter.post('/postProduct', upload.single("files"), async (req, res) => {
  delete req.body._id
  let validation = {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 5 },
      // category: { type: 'string', minLength: 5 },
      price: { type: 'number', minLength: 1 },
      description: { type: 'string', minLength: 5 },
    },
  };
  let validated = inspector.validate(validation, req.body)
  console.log(req.body)
  if(!validated.valid){
    return res.status(501).json({message: "Неверные данные"});
  }
  if(!req.file){
    return res.status(501).json({message: "Изображение не найдено"})
  }
  if(req.file
    && !(req.file.mimetype == "image/png"
      || req.file.mimetype == "image/jpg"
      || req.file.mimetype == "image/jpeg")){
    fs.unlink(resolve(resolve(), "public", req.file.filename), (err) => err && console.error(err));
    return res.status(501).json({message: "Неверный тип файла"});
  }
  if(req.file){
    req.body.image = req.file.filename;
  }
  console.log(req.body)
  try{
    await (new Product(req.body)).save()
    return res.status(200).json({message: "Данные добавлены"});
  }catch(error){
    return res.status(501).json({message: error});
  }
})

export default apiRouter