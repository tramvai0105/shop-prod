import express from 'express'
import { Product } from './models.js'
import inspector from "schema-inspector";
const apiRouter = express.Router();
import multer from "multer";
const upload = multer({ dest: "uploads/" });

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

apiRouter.post('/putProduct', upload.array("files"), async (req, res) => {
  let validation = {
    type: 'object',
    properties: {
      _id: {type: "string", minLength: 1},
      name: { type: 'string', minLength: 5 },
      category: { type: 'string', minLength: 5 },
      price: { type: 'number', minLength: 1 },
      description: { type: 'string', minLength: 5 },
    },
  };
  let validated = inspector.validate(validation, req.body)
  if(!validated.valid){
    return res.status(501).json({message: "Неверные данные"});
  }
  if(req.files && req.files[0] 
    && (req.files[0].mimetype != "image/png"
      || req.files[0].mimetype != "image/jpg")){
    return res.status(501).json({message: "Неверный тип файла"});
  }
  try{
    await Product.findOneAndUpdate({_id: req.body._id}, req.body)
    return res.status(200).json({message: "Данные обновлены"});
  }catch(error){
    return res.status(501).json({message: error});
  }
})

apiRouter.post('/postProduct', upload.array("files"), async (req, res) => {
  let validation = {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 1 },
      category: { type: 'string', minLength: 1 },
      price: { type: 'number', minLength: 1 },
      description: { type: 'string', minLength: 1 },
    },
  };
  let validated = inspector.validate(validation, req.body)
  if(!validated.valid){
    res.json({message: "Not valid data"})
  }
  let prod = new Product(req.body);
  try{
    await prod.save();
  }catch(error){
    res.json({message: error});
  }
  res.json(200)
})

export default apiRouter